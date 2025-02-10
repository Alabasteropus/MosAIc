import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { WEBHOOK_URLS } from "@/lib/constants";
import { type Memory } from "@shared/schema";

interface MemoryManagerProps {
  campaign: string;
}

export function MemoryManager({ campaign }: MemoryManagerProps) {
  const [memoryText, setMemoryText] = useState("");
  const [queryText, setQueryText] = useState("");
  const [retrievedMemories, setRetrievedMemories] = useState<Memory[]>([]);
  const { toast } = useToast();

  const handleInsertMemory = async () => {
    try {
      const response = await fetch(WEBHOOK_URLS.insertMemory, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: memoryText,
          metadata: {
            type: "episodic",
            timestamp: new Date().toISOString(),
            importance: 1.0,
            campaign: campaign
          }
        })
      });

      if (!response.ok) throw new Error('Failed to insert memory');

      setMemoryText("");
      toast({
        title: "Success",
        description: "Memory inserted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to insert memory",
        variant: "destructive",
      });
    }
  };

  const handleRetrieveMemories = async () => {
    try {
      const response = await fetch(WEBHOOK_URLS.retrieveMemory, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          campaign: campaign
        })
      });

      if (!response.ok) throw new Error('Failed to retrieve memories');

      const memories = await response.json();
      setRetrievedMemories(memories);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retrieve memories",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMemories = async () => {
    try {
      const response = await fetch(WEBHOOK_URLS.updateMemory, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to update memories');

      toast({
        title: "Success",
        description: "Memory importance updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update memories",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>Insert Memory</CardHeader>
        <CardContent>
          <Textarea
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            placeholder="Enter memory text..."
            className="mb-2"
          />
          <Button onClick={handleInsertMemory}>Insert Memory</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Retrieve Memories</CardHeader>
        <CardContent>
          <Input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Enter query text..."
            className="mb-2"
          />
          <Button onClick={handleRetrieveMemories} className="mb-4">
            Retrieve Memories
          </Button>
          {retrievedMemories.length > 0 && (
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[200px]">
              {JSON.stringify(retrievedMemories, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Update Memories</CardHeader>
        <CardContent>
          <Button onClick={handleUpdateMemories}>
            Update Memory Importance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}