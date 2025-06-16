
import { Search, User, DollarSign, Calendar, LayoutGrid, LayoutList, Grid3X3 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

type LayoutType = 'gallery' | 'grid' | 'list';

export default function DraftTemplates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<LayoutType>('grid');
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
    navigate(`/admin/product/${templateId}`);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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

  const renderGalleryLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredTemplates.map((template) => (
        <Card 
          key={template.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleTemplateClick(template.id)}
        >
          <CardContent className="p-0">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
              <img
                src={template.image}
                alt={template.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{template.title}</h3>
                <p className="text-sm text-[#8E9196] line-clamp-2">{template.description}</p>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-[#8E9196]" />
                  <span className="text-[#8E9196]">Uploaded by:</span>
                  <span className="font-medium truncate">{template.uploadedBy}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-[#8E9196]" />
                  <span className="text-[#8E9196]">Price:</span>
                  <span className="font-medium">{template.price}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-[#8E9196]" />
                  <span className="text-[#8E9196]">Created:</span>
                  <span className="font-medium text-xs">{template.createdAt}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderGridLayout = () => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>Template</TableHead>
            <TableHead className="w-[150px]">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#8E9196]" />
                <span>Uploaded by</span>
              </div>
            </TableHead>
            <TableHead className="w-[120px]">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#8E9196]" />
                <span>Price</span>
              </div>
            </TableHead>
            <TableHead className="w-[150px]">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#8E9196]" />
                <span>Created @</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTemplates.map((template) => (
            <TableRow 
              key={template.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => handleTemplateClick(template.id)}
            >
              <TableCell>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">{template.title}</h3>
                  <p className="text-xs text-[#8E9196] line-clamp-2">{template.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium truncate">{template.uploadedBy}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{template.price}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{template.createdAt}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-6">
      {filteredTemplates.map((template) => (
        <Card 
          key={template.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleTemplateClick(template.id)}
        >
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-xl mb-2">{template.title}</h3>
                  <p className="text-[#8E9196] line-clamp-3">{template.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#8E9196]" />
                    <span className="text-[#8E9196]">Uploaded by:</span>
                    <span className="font-medium">{template.uploadedBy}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#8E9196]" />
                    <span className="text-[#8E9196]">Price:</span>
                    <span className="font-medium">{template.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#8E9196]" />
                    <span className="text-[#8E9196]">Created:</span>
                    <span className="font-medium">{template.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Draft Templates</h1>
          <p className="text-[#8E9196]">Manage and review all template drafts ({templates.length} found)</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
              <Input
                placeholder="Type here to search"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={layout === 'gallery' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayout('gallery')}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Gallery
              </Button>
              <Button
                variant={layout === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayout('grid')}
                className="flex items-center gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={layout === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayout('list')}
                className="flex items-center gap-2"
              >
                <LayoutList className="h-4 w-4" />
                List
              </Button>
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#8E9196]">No draft templates found matching your criteria.</p>
            </div>
          ) : (
            <>
              {layout === 'gallery' && renderGalleryLayout()}
              {layout === 'grid' && renderGridLayout()}
              {layout === 'list' && renderListLayout()}
            </>
          )}
        </div>
      </div>
    </>
  );
}
