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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { type Agent } from "@shared/schema";
import { Upload } from "lucide-react";
import { ImageCropper } from "./ImageCropper";

const PERSONALITY_TRAITS = {
  core: [
    // Positive traits
    "Analytical",
    "Creative",
    "Practical",
    "Empathetic",
    "Logical",
    // Negative traits
    "Impulsive",
    "Overconfident",
    "Pessimistic",
    "Cynical",
    "Obsessive",
  ],
  social: [
    // Positive traits
    "Diplomatic",
    "Supportive",
    "Charismatic",
    "Trustworthy",
    "Extroverted",
    // Negative traits
    "Manipulative",
    "Distrustful",
    "Confrontational",
    "Antisocial",
    "Deceptive",
  ],
  work: [
    // Positive traits
    "Strategic",
    "Detail-oriented",
    "Innovative",
    "Resourceful",
    "Organized",
    // Negative traits
    "Perfectionist",
    "Procrastinator",
    "Micromanager",
    "Unfocused",
    "Risk-averse",
  ],
};

const DRIVES = [
  // Positive drives
  "Curiosity",
  "Justice",
  "Compassion",
  "Knowledge",
  "Protection",
  // Complex/ambiguous drives
  "Ambition",
  "Recognition",
  "Control",
  "Independence",
  // Negative drives
  "Vengeance",
  "Power",
  "Greed",
  "Dominance",
];

const CAMPAIGNS = ["Default", "Cyberpunk", "Fantasy", "Sci-fi"];

interface AgentEditorProps {
  agent: Agent;
  onUpdate: (agent: Partial<Agent>) => void;
}

export function AgentEditor({ agent, onUpdate }: AgentEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    ...agent,
    avatarUrl: agent.avatarUrl || "",
    traits: Array.isArray(agent.traits) ? agent.traits : [
      PERSONALITY_TRAITS.core[0],
      PERSONALITY_TRAITS.social[0],
      PERSONALITY_TRAITS.work[0],
    ],
    secondaryDrive: agent.secondaryDrive || DRIVES[0],
  });
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCropperImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (croppedImage: string) => {
    setFormData({ ...formData, avatarUrl: croppedImage });
    setCropperImage(null);
  };

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
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Agent</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Agent Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-primary/20">
                <AvatarImage src={formData.avatarUrl} />
                <AvatarFallback className="bg-primary/5 text-2xl">
                  {formData.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={handleImageUpload}
                />
                <Label
                  htmlFor="avatar-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-md cursor-pointer hover:bg-primary/20 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Avatar
                </Label>
              </div>
            </div>

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
              <Label>Core Personality Trait</Label>
              <Select
                value={formData.traits[0]}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    traits: [value, formData.traits[1], formData.traits[2]],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select core trait" />
                </SelectTrigger>
                <SelectContent>
                  {PERSONALITY_TRAITS.core.map((trait) => (
                    <SelectItem key={trait} value={trait}>
                      {trait}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Social Personality Trait</Label>
              <Select
                value={formData.traits[1]}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    traits: [formData.traits[0], value, formData.traits[2]],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select social trait" />
                </SelectTrigger>
                <SelectContent>
                  {PERSONALITY_TRAITS.social.map((trait) => (
                    <SelectItem key={trait} value={trait}>
                      {trait}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Work Style Trait</Label>
              <Select
                value={formData.traits[2]}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    traits: [formData.traits[0], formData.traits[1], value],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work trait" />
                </SelectTrigger>
                <SelectContent>
                  {PERSONALITY_TRAITS.work.map((trait) => (
                    <SelectItem key={trait} value={trait}>
                      {trait}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="drives">Primary Drive</Label>
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
              <Label htmlFor="secondaryDrive">Secondary Drive</Label>
              <Select
                value={formData.secondaryDrive}
                onValueChange={(value) =>
                  setFormData({ ...formData, secondaryDrive: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select secondary drive" />
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

      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onCrop={handleCroppedImage}
          onClose={() => setCropperImage(null)}
          aspectRatio={1}
        />
      )}
    </>
  );
}