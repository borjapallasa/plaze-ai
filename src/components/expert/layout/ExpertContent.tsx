
import { ExpertInfo } from "@/components/expert/ExpertInfo";
import { ExpertSkills } from "@/components/expert/ExpertSkills";
import { ExpertStats } from "@/components/expert/ExpertStats";
import { ExpertServices } from "@/components/expert/ExpertServices";
import { ExpertCommunity } from "@/components/expert/ExpertCommunity";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";
import { ProductReviews } from "@/components/product/ProductReviews";
import type { Expert, Service } from "@/components/expert/types";

interface ExpertContentProps {
  expert: Expert;
  services: Service[];
  moreProducts: any[];
  reviews: any[];
}

export const ExpertContent = ({ expert, services, moreProducts, reviews }: ExpertContentProps) => {
  return (
    <div className="container mx-auto px-4">
      {/* Desktop Layout */}
      <div className="hidden lg:block space-y-8">
        <div className="grid grid-cols-5 gap-6">
          <ExpertInfo expert={expert} />
          <ExpertSkills expert={expert} />
        </div>

        <div className="grid grid-cols-5 gap-6">
          <ExpertStats expert={expert} />
          <ExpertServices services={services} />
        </div>

        <ExpertCommunity />

        <div className="space-y-8">
          <MoreFromSeller products={moreProducts} />
          <ProductReviews reviews={reviews} className="p-6 border-gray-100" />
        </div>
      </div>

      {/* Mobile Layout - Reordered */}
      <div className="lg:hidden space-y-8">
        <div>
          <ExpertSkills expert={expert} />
        </div>

        <div>
          <ExpertInfo expert={expert} />
        </div>

        <div>
          <ExpertServices services={services} />
        </div>

        <div>
          <ExpertStats expert={expert} />
        </div>

        <div>
          <ExpertCommunity />
        </div>

        <div>
          <MoreFromSeller products={moreProducts} />
        </div>

        <div>
          <ProductReviews reviews={reviews} className="p-6 border-gray-100" />
        </div>
      </div>
    </div>
  );
};
