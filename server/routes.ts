import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateDailyQuests } from "./openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get daily quests (uses cached or generates new)
  app.get("/api/quests/daily", async (req, res) => {
    try {
      const quests = await generateDailyQuests();
      res.json({ quests, generatedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Error fetching daily quests:", error);
      res.status(500).json({ error: "Failed to fetch quests" });
    }
  });

  // Generate new quests
  app.post("/api/quests/generate", async (req, res) => {
    try {
      const quests = await generateDailyQuests();
      res.json({ quests, generatedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Error generating quests:", error);
      res.status(500).json({ error: "Failed to generate quests" });
    }
  });

  return httpServer;
}
