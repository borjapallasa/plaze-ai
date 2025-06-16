import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

export default function DraftTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['draftTemplates'],
    queryFn: async () => {
      console.log('Fetching draft templates with status = review');
      const { data, error } = await supabase
        .from('products')
        .select(`
          product_uuid,
          name,
          description,
          thumbnail,
          platform,
          expert_uuid,
          price_from,
          created_at,
          experts!inner(
            name,
            email
          )
        `)
        .eq('status', 'review');

      if (error) {
        console.error('Error fetching draft templates:', error);
        throw error;
      }

      console.log('Fetched draft templates:', data);

      return data?.map(product => ({
        id: product.product_uuid,
        title: product.name || 'Untitled',
        description: product.description || 'No description available',
        image: product.thumbnail || '/lovable-uploads/f5087b2b-e030-4e42-8106-ca8be6835f5f.png',
        category: Array.isArray(product.platform) && product.platform.length > 0 
          ? String(product.platform[0])
          : 'Automation',
        uploadedBy: product.experts?.email || 'Unknown',
        price: product.price_from ? `From $${product.price_from}` : 'Free',
        createdAt: new Date(product.created_at).toLocaleString()
      })) || [];
    }
  });

  const handleTemplateClick = (templateId: string) => {
    navigate(`/admin/template/${templateId}`);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory ? template.category === selectedCategory : true;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Draft Templates</h1>
            <p className="text-[#8E9196]">Manage and review all template drafts</p>
          </div>
          <div className="text-center py-8">
            <p className="text-[#8E9196]">Loading draft templates...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Draft Templates</h1>
            <p className="text-[#8E9196]">Manage and review all template drafts</p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading draft templates. Please try again.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Draft Templates</h1>
          <p className="text-[#8E9196]">Manage and review all template drafts ({templates.length} found)</p>
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

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#8E9196]">No draft templates found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleTemplateClick(template.id)}
                >
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
                          className={
                            categories.find(c => c.name === template.category)?.color || "bg-gray-100 text-gray-700"
                          }
                        >
                          {template.category}
                        </Badge>
                      </div>
                      
                      <p className="text-[#8E9196] line-clamp-3">{template.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#8E9196]">Uploaded By</p>
                          <p className="text-sm font-medium truncate">{template.uploadedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8E9196]">Price</p>
                          <p className="text-sm font-medium">{template.price}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-sm text-[#8E9196]">Created @</p>
                          <p className="text-sm font-medium">{template.createdAt}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 pt-4">
                        <Button 
                          className="w-full" 
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add activation logic here
                          }}
                        >
                          Activate Template
                        </Button>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add request changes logic here
                          }}
                        >
                          Request Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
