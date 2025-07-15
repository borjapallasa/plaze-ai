
import React from "react";
import { useParams } from "react-router-dom";
import { TemplateHeader } from "@/components/admin/template/TemplateHeader";
import { TemplateHeroImage } from "@/components/admin/template/TemplateHeroImage";
import { TemplateInfoCard } from "@/components/admin/template/TemplateInfoCard";
import { TemplateStatusCard } from "@/components/admin/template/TemplateStatusCard";
import { TemplateDescription } from "@/components/admin/template/TemplateDescription";
import { TemplateFinancialMetrics } from "@/components/admin/template/TemplateFinancialMetrics";
import { TemplateOrganization } from "@/components/admin/template/TemplateOrganization";
import { TemplateVariables } from "@/components/admin/template/TemplateVariables";
import { TemplateReviews } from "@/components/admin/template/TemplateReviews";
import { TemplateDemoCard } from "@/components/admin/template/TemplateDemoCard";
import { useProduct } from "@/hooks/use-product";
import { useProductVariants } from "@/hooks/use-product-variants";
import { useProductReviews } from "@/hooks/use-product-reviews";
import { useProductImages } from "@/hooks/use-product-images";

export default function AdminTemplateDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: product, isLoading, error } = useProduct(id || "");
  const { data: variants = [] } = useProductVariants(id || "");
  const { data: reviews = [] } = useProductReviews(id || "");
  const { images } = useProductImages(id || "");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <p className="text-gray-600">The template you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <TemplateHeader productName={product.name} publicLink={product.public_link} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TemplateHeroImage thumbnail={product.thumbnail} productName={product.name} />
          <TemplateDescription description={product.description} />
          <TemplateFinancialMetrics 
            priceFrom={product.price_from}
            priceTo={product.price_to}
            salesCount={product.sales_count}
            salesAmount={product.sales_amount}
          />
          <TemplateOrganization 
            techStack={product.additional_details}
            category={product.slug}
          />
          <TemplateVariables variants={variants} />
          <TemplateReviews reviews={reviews} />
        </div>
        
        <div className="space-y-6">
          <TemplateInfoCard 
            createdAt={product.created_at}
            updatedAt={product.updated_at}
            expertUuid={product.expert_uuid}
          />
          <TemplateStatusCard 
            status={product.status}
            productUuid={product.product_uuid}
          />
          <TemplateDemoCard demoUrl={product.demo_url} />
        </div>
      </div>
    </div>
  );
}
