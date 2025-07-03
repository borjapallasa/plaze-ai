import { Search, User, DollarSign, Calendar, LayoutGrid, LayoutList, Grid3X3, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface Template {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  uploadedBy: string;
  customRequest?: string;
  price: string;
  priceValue: number;
  guides?: string;
  offerInstallation?: boolean;
  templateFiles?: boolean;
  createdAt: string;
  submittedAt?: string;
  status: string;
}

type LayoutType = 'gallery' | 'grid' | 'list';
type SortField = 'created_at' | 'submitted_at' | 'name' | 'price_from';
type SortOrder = 'asc' | 'desc';

export default function DraftTemplates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState("review"); // Default to review status
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Switch to gallery view if currently on list view and on mobile
  useEffect(() => {
    if (isMobile && layout === 'list') {
      setLayout('gallery');
    }
  }, [isMobile, layout]);

  const { data: allTemplates = [], isLoading, error } = useQuery({
    queryKey: ['allProducts'],
    queryFn: async () => {
      console.log('Fetching all products');
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
          submitted_at,
          status,
          experts!inner(
            name,
            email
          )
        `);

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Fetched products:', data);

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
        priceValue: product.price_from || 0,
        createdAt: product.created_at,
        submittedAt: product.submitted_at,
        status: product.status || 'draft'
      })) || [];
    }
  });

  const handleTemplateClick = (templateId: string) => {
    navigate(`/admin/products/product/${templateId}`);
  };

  const handleSortChange = (value: string) => {
    console.log('Sort change:', value);
    const lastUnderscoreIndex = value.lastIndexOf('_');
    const field = value.substring(0, lastUnderscoreIndex) as SortField;
    const order = value.substring(lastUnderscoreIndex + 1) as SortOrder;
    console.log('Parsed sort:', { field, order });
    setSortField(field);
    setSortOrder(order);
  };

  const getSortedTemplates = (templates: Template[]) => {
    console.log('Sorting templates:', { sortField, sortOrder, templatesCount: templates.length });
    
    return [...templates].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'created_at':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'submitted_at':
          // Handle null/undefined submitted_at values - put them at the end for desc, beginning for asc
          if (!a.submittedAt && !b.submittedAt) return 0;
          if (!a.submittedAt) return sortOrder === 'desc' ? 1 : -1;
          if (!b.submittedAt) return sortOrder === 'desc' ? -1 : 1;
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
          break;
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price_from':
          aValue = Number(a.priceValue) || 0;
          bValue = Number(b.priceValue) || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const getFilteredAndSortedTemplates = () => {
    console.log('Filtering templates with query:', searchQuery, 'status:', statusFilter);
    
    // First filter by status
    const statusFiltered = allTemplates.filter(template => {
      if (statusFilter === "all") return true;
      return template.status === statusFilter;
    });

    // Then filter by search query
    const filtered = statusFiltered.filter(template => {
      if (!searchQuery.trim()) return true;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesTitle = template.title.toLowerCase().includes(searchLower);
      const matchesDescription = template.description.toLowerCase().includes(searchLower);
      const matchesUploadedBy = template.uploadedBy.toLowerCase().includes(searchLower);
      
      return matchesTitle || matchesDescription || matchesUploadedBy;
    });

    console.log('Filtered templates count:', filtered.length);
    
    // Then sort the filtered results
    const sortedAndFiltered = getSortedTemplates(filtered);
    
    console.log('Final templates count after sort:', sortedAndFiltered.length);
    return sortedAndFiltered;
  };

  const filteredTemplates = getFilteredAndSortedTemplates();

  // Get counts for each status from the unfiltered templates data
  const getStatusCounts = () => {
    if (!allTemplates) return { all: 0, draft: 0, review: 0, active: 0, inactive: 0 };
    
    const counts = {
      all: allTemplates.length,
      draft: allTemplates.filter(template => template.status === 'draft').length,
      review: allTemplates.filter(template => template.status === 'review').length,
      active: allTemplates.filter(template => template.status === 'active').length,
      inactive: allTemplates.filter(template => template.status === 'inactive').length
    };
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  const tabs = [
    { id: "all", label: "All", count: statusCounts.all },
    { id: "draft", label: "Draft", count: statusCounts.draft },
    { id: "review", label: "In Review", count: statusCounts.review },
    { id: "active", label: "Active", count: statusCounts.active },
    { id: "inactive", label: "Inactive", count: statusCounts.inactive }
  ];

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Products</h1>
            <p className="text-[#8E9196]">Manage and review all products</p>
          </div>
          <div className="text-center py-8">
            <p className="text-[#8E9196]">Loading products...</p>
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
            <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Products</h1>
            <p className="text-[#8E9196]">Manage and review all products</p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading products. Please try again.</p>
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
                  <span className="font-medium text-xs">{new Date(template.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderGridLayout = () => (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] sm:w-[120px]"></TableHead>
            <TableHead className="min-w-[200px] sm:w-[300px]">Template</TableHead>
            <TableHead className="min-w-[150px] sm:w-[250px]">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#8E9196]" />
                <span>Uploaded by</span>
              </div>
            </TableHead>
            <TableHead className="w-[100px] sm:w-[150px]">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#8E9196]" />
                <span>Price</span>
              </div>
            </TableHead>
            <TableHead className="min-w-[140px] sm:w-[200px]">
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
              <TableCell className="p-2 sm:p-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="p-2 sm:p-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-xs sm:text-sm leading-tight">{template.title}</h3>
                  <p className="text-xs text-[#8E9196] line-clamp-2 leading-tight">{template.description}</p>
                </div>
              </TableCell>
              <TableCell className="p-2 sm:p-4">
                <span className="text-xs sm:text-sm font-medium truncate block">{template.uploadedBy}</span>
              </TableCell>
              <TableCell className="p-2 sm:p-4">
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{template.price}</span>
              </TableCell>
              <TableCell className="p-2 sm:p-4">
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{new Date(template.createdAt).toLocaleDateString()}</span>
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
                    <span className="font-medium">{new Date(template.createdAt).toLocaleString()}</span>
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
          <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Products</h1>
          <p className="text-[#8E9196]">Manage and review all products ({allTemplates.length} found)</p>
        </div>

        {/* Custom styled tabs with counts */}
        <div className="mb-6">
          <div className="flex items-center gap-8 border-b border-[#E5E7EB] overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-1 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'text-[#1A1F2C] border-[#1A1F2C]'
                      : 'text-[#8E9196] border-transparent hover:text-[#1A1F2C] hover:border-[#8E9196]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    isActive 
                      ? 'bg-[#1A1F2C] text-white' 
                      : 'bg-[#F3F4F6] text-[#8E9196]'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
              <Input
                placeholder="Search by template name, description, or uploaded by..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 items-center w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4">
              <Select value={`${sortField}_${sortOrder}`} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at_desc">Created (Newest)</SelectItem>
                  <SelectItem value="created_at_asc">Created (Oldest)</SelectItem>
                  <SelectItem value="submitted_at_desc">Submitted (Newest)</SelectItem>
                  <SelectItem value="submitted_at_asc">Submitted (Oldest)</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price_from_desc">Price (High-Low)</SelectItem>
                  <SelectItem value="price_from_asc">Price (Low-High)</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  variant={layout === 'gallery' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLayout('gallery')}
                  className="p-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={layout === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLayout('grid')}
                  className="p-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={layout === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLayout('list')}
                  className="p-2 hidden sm:flex"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#8E9196]">
                {searchQuery ? 'No products found matching your search criteria.' : 'No products found.'}
              </p>
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
