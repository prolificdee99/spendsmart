import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 15 }).notNull().unique(), // 📌 phone replaces email
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  service: text("service").notNull(),
  notes: text("notes"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  limit: decimal("limit", { precision: 10, scale: 2 }).notNull(),
  period: text("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ✅ Schema for inserting a user
export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  phone: true,
  password: true,
}).extend({
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
  password: z.string().min(6),
});

// ✅ Transaction schema
export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  amount: z.string().or(z.number()),
  category: z.enum(["Food", "Transport", "Airtime", "Other"]),
  service: z.enum(["MTN", "AirtelTigo", "Telecel"]),
  date: z.string().or(z.date()).optional(),
});

// ✅ Budget schema
export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  limit: z.string().or(z.number()),
  category: z.enum(["Food", "Transport", "Airtime", "Other"]),
  period: z.enum(["daily", "weekly", "monthly"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;
