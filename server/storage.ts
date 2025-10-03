import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import {
  users,
  transactions,
  budgets,
  type User,
  type InsertUser,
  type Transaction,
  type InsertTransaction,
  type Budget,
  type InsertBudget,
} from "@shared/schema";
import ws from "ws";

class CustomWebSocket extends ws {
  constructor(address: any, protocols?: any) {
    super(address, protocols, {
      rejectUnauthorized: false
    });
  }
}

neonConfig.webSocketConstructor = CustomWebSocket as any;
neonConfig.pipelineConnect = false;

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});
const db = drizzle(pool);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction methods
  getTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string, userId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction & { userId: string }): Promise<Transaction>;
  updateTransaction(id: string, userId: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string, userId: string): Promise<boolean>;
  getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
  getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]>;
  
  // Budget methods
  getBudgets(userId: string): Promise<Budget[]>;
  getBudget(id: string, userId: string): Promise<Budget | undefined>;
  getBudgetByCategory(userId: string, category: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget & { userId: string }): Promise<Budget>;
  updateBudget(id: string, userId: string, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: string, userId: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.phone, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Transaction methods
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.date));
  }

  async getTransaction(id: string, userId: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createTransaction(transaction: InsertTransaction & { userId: string }): Promise<Transaction> {
    const result = await db.insert(transactions).values({
      userId: transaction.userId,
      amount: transaction.amount.toString(),
      category: transaction.category,
      service: transaction.service,
      notes: transaction.notes,
      date: transaction.date ? new Date(transaction.date) : new Date(),
    }).returning();
    return result[0];
  }

  async updateTransaction(id: string, userId: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const updateData: any = {};
    if (transaction.amount !== undefined) updateData.amount = transaction.amount.toString();
    if (transaction.category !== undefined) updateData.category = transaction.category;
    if (transaction.service !== undefined) updateData.service = transaction.service;
    if (transaction.notes !== undefined) updateData.notes = transaction.notes;
    if (transaction.date !== undefined) updateData.date = new Date(transaction.date);
    
    const result = await db.update(transactions)
      .set(updateData)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date));
  }

  async getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.category, category)))
      .orderBy(desc(transactions.date));
  }

  // Budget methods
  async getBudgets(userId: string): Promise<Budget[]> {
    return await db.select().from(budgets).where(eq(budgets.userId, userId));
  }

  async getBudget(id: string, userId: string): Promise<Budget | undefined> {
    const result = await db.select().from(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .limit(1);
    return result[0];
  }

  async getBudgetByCategory(userId: string, category: string): Promise<Budget | undefined> {
    const result = await db.select().from(budgets)
      .where(and(eq(budgets.userId, userId), eq(budgets.category, category)))
      .limit(1);
    return result[0];
  }

  async createBudget(budget: InsertBudget & { userId: string }): Promise<Budget> {
    const result = await db.insert(budgets).values({
      userId: budget.userId,
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period,
    }).returning();
    return result[0];
  }

  async updateBudget(id: string, userId: string, budget: Partial<InsertBudget>): Promise<Budget | undefined> {
    const updateData: any = { updatedAt: new Date() };
    if (budget.category !== undefined) updateData.category = budget.category;
    if (budget.limit !== undefined) updateData.limit = budget.limit.toString();
    if (budget.period !== undefined) updateData.period = budget.period;
    
    const result = await db.update(budgets)
      .set(updateData)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteBudget(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
