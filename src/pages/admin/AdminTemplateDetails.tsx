
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
import { useProductData } from "@/hooks/use-product-data";

export default function AdminTemplateDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: productData, isLoading, error } = useProductData(id || "");

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

  if (error || !productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <p className="text-gray-600">The template you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { product, variants, images, reviews } = productData;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <TemplateHeader product={product} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TemplateHeroImage images={images} productName={product.name} />
          <TemplateDescription product={product} />
          <TemplateFinancialMetrics product={product} />
          <TemplateOrganization product={product} />
          <TemplateVariables variants={variants} />
          <TemplateReviews reviews={reviews} />
        </div>
        
        <div className="space-y-6">
          <TemplateInfoCard product={product} />
          <TemplateStatusCard product={product} />
          <TemplateDemoCard product={product} />
        </div>
      </div>
    </div>
  );
}
