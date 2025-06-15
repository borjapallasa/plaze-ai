
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/use-product";
import { TemplateHeader } from "@/components/admin/template/TemplateHeader";
import { TemplateStatusCard } from "@/components/admin/template/TemplateStatusCard";
import { TemplateHeroImage } from "@/components/admin/template/TemplateHeroImage";
import { TemplateFinancialMetrics } from "@/components/admin/template/TemplateFinancialMetrics";
import { TemplateDescription } from "@/components/admin/template/TemplateDescription";
import { TemplateVariables } from "@/components/admin/template/TemplateVariables";
import { TemplateReviews } from "@/components/admin/template/TemplateReviews";
import { TemplateInfoCard } from "@/components/admin/template/TemplateInfoCard";
import { TemplateOrganization } from "@/components/admin/template/TemplateOrganization";
import { TemplateDemoCard } from "@/components/admin/template/TemplateDemoCard";

export default function AdminTemplateDetails() {
  const params = useParams();
  const { product, isLoading, error } = useProduct({
    productId: params.id
  });

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16 space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-1">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Template Not Found</h2>
            <p className="text-gray-600 mb-4">The template you're looking for doesn't exist or couldn't be loaded.</p>
            <TemplateHeader productName="" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16 space-y-6">
        <TemplateHeader productName={product.name || ""} />

        {/* Mobile Status Card */}
        <TemplateStatusCard status={product.status || "active"} isMobile />

        {/* Mobile Layout - Reordered for mobile */}
        <div className="block lg:hidden space-y-6">
          <TemplateHeroImage 
            thumbnail={product.thumbnail} 
            productName={product.name || ""} 
          />
          <TemplateFinancialMetrics 
            salesCount={product.sales_count || undefined}
            salesAmount={product.sales_amount || undefined}
            priceFrom={product.price_from || undefined}
          />
          <TemplateDescription description={product.description} />
          
          {/* Demo and Resources moved below description on mobile */}
          <TemplateDemoCard demo={product.demo} />
          
          <TemplateVariables 
            productUuid={product.product_uuid}
            techStack={product.tech_stack}
            productIncludes={product.product_includes}
            platform={product.platform}
            team={product.team}
            useCase={product.use_case}
            industries={product.industries}
          />
          <TemplateReviews productUuid={product.product_uuid} />
          
          <TemplateStatusCard status={product.status || "active"} />
          
          <TemplateOrganization 
            team={product.team}
            industries={product.industries}
            platform={product.platform}
            useCase={product.use_case}
          />

          {/* Template Information moved to bottom on mobile/tablet */}
          <TemplateInfoCard 
            expertUuid={product.expert_uuid || undefined}
            type={product.type || undefined}
            createdAt={product.created_at}
            projectFiles={product.product_files || undefined}
          />
        </div>

        {/* Desktop Layout - Updated with financial metrics under status */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <TemplateHeroImage 
              thumbnail={product.thumbnail} 
              productName={product.name || ""} 
            />
            <TemplateDescription description={product.description} />
            <TemplateVariables 
              productUuid={product.product_uuid}
              techStack={product.tech_stack}
              productIncludes={product.product_includes}
              platform={product.platform}
              team={product.team}
              useCase={product.use_case}
              industries={product.industries}
            />
            <TemplateReviews productUuid={product.product_uuid} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <TemplateStatusCard status={product.status || "active"} />
            
            {/* Financial metrics moved under status card */}
            <TemplateFinancialMetrics 
              salesCount={product.sales_count || undefined}
              salesAmount={product.sales_amount || undefined}
              priceFrom={product.price_from || undefined}
            />
            
            <TemplateOrganization 
              team={product.team}
              industries={product.industries}
              platform={product.platform}
              useCase={product.use_case}
            />

            <TemplateDemoCard demo={product.demo} />

            {/* Template Information at the bottom */}
            <TemplateInfoCard 
              expertUuid={product.expert_uuid || undefined}
              type={product.type || undefined}
              createdAt={product.created_at}
              projectFiles={product.product_files || undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
}
