import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { WEBHOOK_URLS } from "@/lib/constants";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get agent response using build-prompt webhook
      const response = await fetch(WEBHOOK_URLS.buildPrompt, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: input,
          campaign: agent.campaign,
          agentProfile: agent
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      // Add agent response
      const agentMessage: Message = {
        id: Date.now() + 1,
        sender: "agent",
        text: data.prompt,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "agent",
        text: "Sorry, I encountered an error while processing your message.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
              {message.sender === "agent" && (
                <div className="flex items-start space-x-2">
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarImage src={agent.avatarUrl} />
                    <AvatarFallback className="bg-primary/5 text-sm">
                      {agent.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {agent.name}
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <p>{message.text}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {message.sender === "user" && (
                <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
                  <p>{message.text}</p>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarImage src={agent.avatarUrl} />
                  <AvatarFallback className="bg-primary/5 text-sm">
                    {agent.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {agent.name}
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <p>Thinking...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading}>
          Send
        </Button>
      </div>
    </Card>
  );
}