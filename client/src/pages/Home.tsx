import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AgentEditor } from "@/components/AgentEditor";
import { ConversationWindow } from "@/components/ConversationWindow";
import { MemoryManager } from "@/components/MemoryManager";
import { type Agent } from "@shared/schema";

export default function Home() {
  const [agent, setAgent] = useState<Agent>({
    id: 1,
    name: "Alice",
    traits: "Witty, Observant",
    drives: "Curiosity",
    backstory: "A seasoned detective in a futuristic city.",
    campaign: "Default",
  });

  const handleAgentUpdate = (update: Partial<Agent>) => {
    setAgent((prev) => ({ ...prev, ...update }));
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-4xl font-bold mb-8">Agent Control Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="mb-6">
            <CardHeader>Agent Profile</CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {agent.name}
                </p>
                <p>
                  <strong>Traits:</strong> {agent.traits}
                </p>
                <p>
                  <strong>Drives:</strong> {agent.drives}
                </p>
                <p>
                  <strong>Backstory:</strong> {agent.backstory}
                </p>
                <p>
                  <strong>Campaign:</strong> {agent.campaign}
                </p>
              </div>
              <div className="mt-4">
                <AgentEditor agent={agent} onUpdate={handleAgentUpdate} />
              </div>
            </CardContent>
          </Card>

          <MemoryManager campaign={agent.campaign} />
        </div>

        <div>
          <Card>
            <CardHeader>Conversation</CardHeader>
            <CardContent>
              <ConversationWindow agent={agent} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
