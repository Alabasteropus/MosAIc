import { pgTable, text, serial, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  traits: json("traits").$type<string[]>().notNull(),
  drives: text("drives").notNull(),
  backstory: text("backstory").notNull(),
  campaign: text("campaign").notNull(),
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  type: text("type").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  importance: real("importance").notNull(),
  campaign: text("campaign").notNull(),
  metadata: json("metadata").$type<Record<string, any>>(),
});

export const insertAgentSchema = createInsertSchema(agents);
export const insertMemorySchema = createInsertSchema(memories);

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Agent = typeof agents.$inferSelect;
export type Memory = typeof memories.$inferSelect;