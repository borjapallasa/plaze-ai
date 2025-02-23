
import { Search } from "lucide-react";
import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Template {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  uploadedBy: string;
  customRequest?: string;
  price: string;
  guides?: string;
  offerInstallation?: boolean;
  templateFiles?: boolean;
  createdAt: string;
}

const categories = [
  { name: "Airtable", color: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  { name: "Automation", color: "bg-pink-100 text-pink-700 hover:bg-pink-100" },
  { name: "Chatbot", color: "bg-green-100 text-green-700 hover:bg-green-100" },
  { name: "Mini SaaS", color: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  { name: "Notion", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" }
];

const mockTemplates: Template[] = [
  {
    id: "1",
    title: "Summarise your Make.com scenario",
    description: "The No Code Template for Make.com automates the creation of summaries for your scenario blueprints. This tool utilizes Make and AI tools to generate concise summaries that can be easily saved to popular cloud storage platforms like Google Drive, OneDrive, or other cloud storage services.",
    image: "/lovable-uploads/f5087b2b-e030-4e42-8106-ca8be6835f5f.png",
    category: "Automation",
    uploadedBy: "manageautomations@gmail.com",
    price: "From $99",
    createdAt: "2/22/2025, 2:30 PM"
  },
  {
    id: "2",
    title: "BlueprintMusicPlatfromSubcriptions",
    description: "Built with a modern tech stack, the frontend employs React with TypeScript, Vite, TailwindCSS, Shadcn/UI, React Query, and Framer Motion for seamless user interactions. The backend utilizes Node.js with Express, TypeScript, Drizzle ORM, WebSocket for real-time functionality, and integrates Stripe for secure payments.",
    image: "/lovable-uploads/f5087b2b-e030-4e42-8106-ca8be6835f5f.png",
    category: "Automation",
    uploadedBy: "blueprintmusic@gmail.com",
    price: "From $199",
    createdAt: "2/22/2025, 2:30 PM"
  }
];

export default function DraftTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory ? template.category === selectedCategory : true;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Draft Templates</h1>
          <p className="text-[#8E9196]">Manage and review all template drafts</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Type here to search"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-[#8E9196] font-medium">By Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.name}
                  variant="secondary"
                  className={`cursor-pointer ${category.color} ${
                    selectedCategory === category.name ? "ring-2 ring-black ring-opacity-5" : ""
                  }`}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold">{template.title}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          categories.find(c => c.name === template.category)?.color
                        }`}
                      >
                        {template.category}
                      </Badge>
                    </div>
                    
                    <p className="text-[#8E9196] line-clamp-3">{template.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#8E9196]">Uploaded By</p>
                        <p className="text-sm font-medium truncate">{template.uploadedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#8E9196]">Price</p>
                        <p className="text-sm font-medium">{template.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#8E9196]">Created @</p>
                        <p className="text-sm font-medium">{template.createdAt}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <Button className="flex-1" variant="default">
                        Activate Template
                      </Button>
                      <Button className="flex-1" variant="outline">
                        Request Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
