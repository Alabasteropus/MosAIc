import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAgentSchema, insertMemorySchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Agent routes
  app.post("/api/agents", async (req, res) => {
    try {
      const agentData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(agentData);
      res.json(agent);
    } catch (error) {
      res.status(400).json({ error: "Invalid agent data" });
    }
  });

  app.patch("/api/agents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const update = insertAgentSchema.partial().parse(req.body);
      const agent = await storage.updateAgent(id, update);
      if (!agent) {
        res.status(404).json({ error: "Agent not found" });
        return;
      }
      res.json(agent);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Memory routes
  app.post("/api/memories", async (req, res) => {
    try {
      const memoryData = insertMemorySchema.parse(req.body);
      const memory = await storage.insertMemory(memoryData);
      res.json(memory);
    } catch (error) {
      res.status(400).json({ error: "Invalid memory data" });
    }
  });

  app.post("/api/memories/retrieve", async (req, res) => {
    const schema = z.object({
      query: z.string(),
      campaign: z.string(),
    });

    try {
      const { query, campaign } = schema.parse(req.body);
      const memories = await storage.retrieveMemories(query, campaign);
      res.json(memories);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/memories/update", async (req, res) => {
    await storage.updateMemoryImportance();
    res.json({ message: "Memory importance updated" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
