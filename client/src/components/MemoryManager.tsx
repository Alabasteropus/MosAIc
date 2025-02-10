import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
      await apiRequest("POST", "/api/memories", {
        text: memoryText,
        type: "episodic",
        timestamp: new Date().toISOString(),
        importance: 1.0,
        campaign,
        metadata: {},
      });
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
      const response = await apiRequest("POST", "/api/memories/retrieve", {
        query: queryText,
        campaign,
      });
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
      await apiRequest("POST", "/api/memories/update", {});
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
