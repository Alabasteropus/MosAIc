import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentEditor } from "@/components/AgentEditor";
import { ConversationWindow } from "@/components/ConversationWindow";
import { MemoryManager } from "@/components/MemoryManager";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Agent } from "@shared/schema";
import { MessageSquare, Database } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [agent, setAgent] = useState<Agent>({
    id: 1,
    name: "Alice",
    traits: ["Analytical", "Diplomatic", "Strategic"],
    drives: "Curiosity",
    secondaryDrive: "Knowledge",
    backstory: "A seasoned detective in a futuristic city.",
    campaign: "Default",
    avatarUrl: "",
  });

  const handleAgentUpdate = (update: Partial<Agent>) => {
    setAgent((prev) => ({ ...prev, ...update }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Agent Control Panel
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={agent.avatarUrl} />
                    <AvatarFallback className="bg-primary/5 text-2xl">
                      {agent.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl mb-2">{agent.name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {agent.traits.map((trait) => (
                        <span
                          key={trait}
                          className="px-2 py-1 rounded-full bg-primary/10 text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Primary Drive</h3>
                      <p className="text-foreground">{agent.drives}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Secondary Drive</h3>
                      <p className="text-foreground">{agent.secondaryDrive}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Backstory</h3>
                    <p className="text-foreground">{agent.backstory}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Campaign</h3>
                    <p className="text-foreground">{agent.campaign}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <AgentEditor agent={agent} onUpdate={handleAgentUpdate} />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Manage Memories
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Memory Management</DialogTitle>
                      </DialogHeader>
                      <MemoryManager campaign={agent.campaign} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>Conversation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ConversationWindow agent={agent} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}