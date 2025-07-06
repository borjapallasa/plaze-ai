
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/hooks/use-product";
import { TemplateHeroImage } from "@/components/admin/template/TemplateHeroImage";
import { TemplateDescription } from "@/components/admin/template/TemplateDescription";
import { TemplateDemoCard } from "@/components/admin/template/TemplateDemoCard";
import { TemplateReviews } from "@/components/admin/template/TemplateReviews";
import { TemplateHeader } from "@/components/admin/template/TemplateHeader";
import { TemplateInfoCard } from "@/components/admin/template/TemplateInfoCard";
import { TemplateStatusCard } from "@/components/admin/template/TemplateStatusCard";
import { TemplateFinancialMetrics } from "@/components/admin/template/TemplateFinancialMetrics";
import { TemplateVariables } from "@/components/admin/template/TemplateVariables";
import { TemplateOrganization } from "@/components/admin/template/TemplateOrganization";

export default function AdminTemplateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct({ productId: id });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <MainHeader />
        <div className="pt-24 flex justify-center">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <MainHeader />
        <div className="pt-24 container mx-auto px-4">
          <div className="text-center text-red-500">
            Error loading product details. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <MainHeader />
        <div className="pt-24 container mx-auto px-4">
          <div className="text-center text-red-500">
            Product not found. Please check the URL and try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MainHeader />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {product.category ? 'Digital Product' : 'Product'}
              </Badge>
              <Badge 
                variant={product.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {product.status}
              </Badge>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <TemplateHeroImage thumbnail={product.thumbnail} productName={product.name} />
              <TemplateDescription description={product.description} />
              <TemplateDemoCard demo={product.demo} />
              <TemplateReviews productUuid={product.product_uuid} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <TemplateHeader 
                productName={product.name}
                publicLink={product.public_link}
              />
              <TemplateInfoCard 
                expertUuid={product.expert_uuid}
                type={product.category ? 'Digital Product' : 'Product'}
                createdAt={product.created_at}
                projectFiles={product.product_files}
              />
              <TemplateStatusCard 
                status={product.status}
                created_at={product.created_at}
              />
              <TemplateFinancialMetrics 
                salesAmount={product.sales_amount}
                salesCount={product.sales_count}
                feesAmount={product.fees_amount}
              />
              <TemplateVariables 
                techStack={product.tech_stack}
                difficultyLevel={product.difficulty_level}
              />
              <TemplateOrganization 
                productIncludes={product.product_includes}
                difficultyLevel={product.difficulty_level}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
