import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Agent } from "@shared/schema";

interface Message {
  id: number;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
}

interface ConversationWindowProps {
  agent: Agent;
}

export function ConversationWindow({ agent }: ConversationWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate agent response
    const agentMessage: Message = {
      id: Date.now() + 1,
      sender: "agent",
      text: `${agent.name}: This is a simulated response based on my ${agent.traits} personality.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, agentMessage]);
    setInput("");
  };

  return (
    <Card className="flex flex-col h-[500px] p-4">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Card>
  );
}
