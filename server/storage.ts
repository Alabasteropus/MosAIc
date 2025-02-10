import { type Agent, type InsertAgent, type Memory, type InsertMemory } from "@shared/schema";

export interface IStorage {
  // Agent operations
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent | undefined>;
  
  // Memory operations
  insertMemory(memory: InsertMemory): Promise<Memory>;
  retrieveMemories(query: string, campaign: string): Promise<Memory[]>;
  updateMemoryImportance(): Promise<void>;
}

export class MemStorage implements IStorage {
  private agents: Map<number, Agent>;
  private memories: Map<number, Memory>;
  private currentAgentId: number;
  private currentMemoryId: number;

  constructor() {
    this.agents = new Map();
    this.memories = new Map();
    this.currentAgentId = 1;
    this.currentMemoryId = 1;
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = this.currentAgentId++;
    const agent: Agent = { ...insertAgent, id };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: number, update: Partial<InsertAgent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updatedAgent = { ...agent, ...update };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async insertMemory(memory: InsertMemory): Promise<Memory> {
    const id = this.currentMemoryId++;
    const newMemory: Memory = { ...memory, id };
    this.memories.set(id, newMemory);
    return newMemory;
  }

  async retrieveMemories(query: string, campaign: string): Promise<Memory[]> {
    return Array.from(this.memories.values())
      .filter(memory => 
        memory.campaign === campaign &&
        memory.text.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.importance - a.importance);
  }

  async updateMemoryImportance(): Promise<void> {
    // Simulate memory decay by reducing importance
    for (const [id, memory] of this.memories.entries()) {
      const decayedImportance = Math.max(0, memory.importance * 0.9);
      this.memories.set(id, { ...memory, importance: decayedImportance });
    }
  }
}

export const storage = new MemStorage();
