
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, ShoppingBag, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductsSection } from "./ProductsSection";
import { CommunitiesSection } from "./CommunitiesSection";
import type { Service } from "@/components/expert/types";

interface SellerContentProps {
  products: any[];
  communities: any[];
  productsLoading: boolean;
  communitiesLoading: boolean;
}

export function SellerContent({
  products,
  communities,
  productsLoading,
  communitiesLoading
}: SellerContentProps) {
  const [activeSection, setActiveSection] = useState<'products' | 'communities'>('products');
  const [productsOpen, setProductsOpen] = useState(true);
  const [communitiesOpen, setCommunitiesOpen] = useState(false);

  const hasProducts = products && products.length > 0;
  const hasCommunities = communities && communities.length > 0;

  // If no communities, show only products
  if (!hasCommunities && !communitiesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Products</h2>
            <span className="text-sm text-muted-foreground">({products?.length || 0})</span>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/seller/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
        <ProductsSection products={products} isLoading={productsLoading} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Segmented Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="inline-flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={activeSection === 'products' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('products')}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              activeSection === 'products' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Products ({products?.length || 0})
          </Button>
          <Button
            variant={activeSection === 'communities' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('communities')}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              activeSection === 'communities' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Communities ({communities?.length || 0})
          </Button>
        </div>

        <div className="flex gap-2">
          {activeSection === 'products' && (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/seller/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          )}
          {activeSection === 'communities' && (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/seller/communities/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown - only show on small screens */}
      <div className="sm:hidden">
        <select
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value as 'products' | 'communities')}
          className="w-full p-3 border border-input rounded-md bg-background"
        >
          <option value="products">Products ({products?.length || 0})</option>
          <option value="communities">Communities ({communities?.length || 0})</option>
        </select>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        <Collapsible open={productsOpen} onOpenChange={setProductsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto border border-border rounded-lg hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">Products</span>
                <span className="text-sm text-muted-foreground">({products?.length || 0})</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <ProductsSection products={products} isLoading={productsLoading} />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={communitiesOpen} onOpenChange={setCommunitiesOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto border border-border rounded-lg hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">Communities</span>
                <span className="text-sm text-muted-foreground">({communities?.length || 0})</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${communitiesOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <CommunitiesSection 
              communities={communities.map(community => ({
                ...community,
                status: community.status || 'active'
              }))} 
              isLoading={communitiesLoading} 
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
