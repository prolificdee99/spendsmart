import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema, insertBudgetSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import { z } from "zod";
import connectPgSimple from "connect-pg-simple";
import { Pool, neonConfig } from "@neondatabase/serverless";
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

const PgSession = connectPgSimple(session);

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

function requireAuth(req: Request, res: Response, next: Function) {
  console.log("Session data:", req.session);
  console.log("Session ID:", req.sessionID);
  console.log("Cookies:", req.headers.cookie);
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable must be set");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable must be set");
}

export async function registerRoutes(app: Express): Promise<Server> {
  const sessionPool = new Pool({ 
    connectionString: process.env.DATABASE_URL
  });
  
  app.set('trust proxy', 1);
  
  app.use(
    session({
      store: new PgSession({
        pool: sessionPool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      name: 'sessionId',
      rolling: true,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
        path: '/',
      },
    })
  );

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getTransactions(req.session.userId!);
      res.json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/transactions/:id", requireAuth, async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id, req.session.userId!);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Get transaction error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/transactions", requireAuth, async (req, res) => {
    try {
      const data = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction({
        ...data,
        userId: req.session.userId!,
      });
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create transaction error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/transactions/:id", requireAuth, async (req, res) => {
    try {
      const data = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(
        req.params.id,
        req.session.userId!,
        data
      );
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Update transaction error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/transactions/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteTransaction(req.params.id, req.session.userId!);
      if (!success) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Delete transaction error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/budgets", requireAuth, async (req, res) => {
    try {
      const budgets = await storage.getBudgets(req.session.userId!);
      res.json(budgets);
    } catch (error) {
      console.error("Get budgets error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/budgets/:id", requireAuth, async (req, res) => {
    try {
      const budget = await storage.getBudget(req.params.id, req.session.userId!);
      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      console.error("Get budget error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/budgets", requireAuth, async (req, res) => {
    try {
      const data = insertBudgetSchema.parse(req.body);
      
      const existing = await storage.getBudgetByCategory(req.session.userId!, data.category);
      if (existing) {
        const updated = await storage.updateBudget(existing.id, req.session.userId!, data);
        return res.json(updated);
      }
      
      const budget = await storage.createBudget({
        ...data,
        userId: req.session.userId!,
      });
      res.json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create budget error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/budgets/:id", requireAuth, async (req, res) => {
    try {
      const data = insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(
        req.params.id,
        req.session.userId!,
        data
      );
      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Update budget error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/budgets/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteBudget(req.params.id, req.session.userId!);
      if (!success) {
        return res.status(404).json({ error: "Budget not found" });
      }
      res.json({ message: "Budget deleted successfully" });
    } catch (error) {
      console.error("Delete budget error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/analytics/summary", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getTransactions(req.session.userId!);
      const budgets = await storage.getBudgets(req.session.userId!);
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(
        t => new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth
      );
      
      const totalSpent = monthTransactions.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0
      );
      
      const categoryTotals = monthTransactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
        return acc;
      }, {} as Record<string, number>);
      
      const budgetSummary = budgets.map(b => ({
        ...b,
        spent: categoryTotals[b.category] || 0,
        remaining: parseFloat(b.limit) - (categoryTotals[b.category] || 0),
      }));
      
      res.json({
        totalSpent,
        categoryTotals,
        budgetSummary,
        transactionCount: monthTransactions.length,
      });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
