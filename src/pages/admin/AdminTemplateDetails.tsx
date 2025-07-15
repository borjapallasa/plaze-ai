
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TemplateHeader } from "@/components/admin/template/TemplateHeader";
import { TemplateHeroImage } from "@/components/admin/template/TemplateHeroImage";
import { TemplateDescription } from "@/components/admin/template/TemplateDescription";
import { TemplateFinancialMetrics } from "@/components/admin/template/TemplateFinancialMetrics";
import { TemplateStatusCard } from "@/components/admin/template/TemplateStatusCard";
import { TemplateOrganization } from "@/components/admin/template/TemplateOrganization";
import { TemplateVariables } from "@/components/admin/template/TemplateVariables";
import { TemplateReviews } from "@/components/admin/template/TemplateReviews";
import { TemplateInfoCard } from "@/components/admin/template/TemplateInfoCard";
import { TemplateDemoCard } from "@/components/admin/template/TemplateDemoCard";

export default function AdminTemplateDetails() {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: variants = [] } = useQuery({
    queryKey: ['admin-product-variants', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_uuid', id);

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TemplateHeader 
            name={product.name}
            slug={product.slug}
            status={product.status}
          />
          
          <TemplateHeroImage 
            thumbnail={product.thumbnail}
            name={product.name}
          />
          
          <TemplateDescription 
            description={product.description}
            additionalDetails={product.additional_details}
          />
          
          <TemplateFinancialMetrics 
            price_from={product.price_from}
            price_to={product.price_to}
            sales_count={product.sales_count}
            sales_amount={product.sales_amount}
          />
          
          <TemplateStatusCard status={product.status} />
          
          <TemplateOrganization 
            tech_stack={product.tech_stack}
            category={product.category}
          />
          
          <TemplateVariables productVariants={variants} />
          <TemplateReviews productUuid={product.product_uuid} />
        </div>
        
        <div className="space-y-6">
          <TemplateInfoCard 
            created_at={product.created_at}
            updated_at={product.updated_at}
            expert_uuid={product.expert_uuid}
          />
          
          {product.demo_url && (
            <TemplateDemoCard 
              demo_url={product.demo_url}
            />
          )}
        </div>
      </div>
    </div>
  );
}
