import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { type Agent } from "@shared/schema";

const PERSONALITY_TRAITS = [
  "Witty, Observant",
  "Serious, Focused",
  "Cheerful, Energetic",
];

const DRIVES = ["Curiosity", "Justice", "Ambition", "Compassion"];

const CAMPAIGNS = ["Default", "Cyberpunk", "Lord of the Rings", "Blade Runner"];

interface AgentEditorProps {
  agent: Agent;
  onUpdate: (agent: Partial<Agent>) => void;
}

export function AgentEditor({ agent, onUpdate }: AgentEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(agent);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsOpen(false);
    toast({
      title: "Success",
      description: "Agent profile updated successfully",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Agent</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Agent Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="traits">Personality Traits</Label>
            <Select
              value={formData.traits}
              onValueChange={(value) =>
                setFormData({ ...formData, traits: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select traits" />
              </SelectTrigger>
              <SelectContent>
                {PERSONALITY_TRAITS.map((trait) => (
                  <SelectItem key={trait} value={trait}>
                    {trait}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="drives">Drives</Label>
            <Select
              value={formData.drives}
              onValueChange={(value) =>
                setFormData({ ...formData, drives: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select drives" />
              </SelectTrigger>
              <SelectContent>
                {DRIVES.map((drive) => (
                  <SelectItem key={drive} value={drive}>
                    {drive}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backstory">Backstory</Label>
            <Textarea
              id="backstory"
              value={formData.backstory}
              onChange={(e) =>
                setFormData({ ...formData, backstory: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign">Campaign</Label>
            <Select
              value={formData.campaign}
              onValueChange={(value) =>
                setFormData({ ...formData, campaign: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGNS.map((campaign) => (
                  <SelectItem key={campaign} value={campaign}>
                    {campaign}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
