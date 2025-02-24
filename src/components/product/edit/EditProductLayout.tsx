
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { EditProductHeader } from "./EditProductHeader";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductTechnicalDetails } from "./ProductTechnicalDetails";
import { ProductMediaUpload } from "../ProductMediaUpload";
import { ProductStatus } from "../ProductStatus";
import { ProductOrganizationDetails } from "./ProductOrganizationDetails";
import { Variant } from "../types/variants";

interface EditProductLayoutProps {
  isSaving: boolean;
  onSave: () => Promise<void>;
  productId: string;
  productName: string;
  productDescription: string;
  variants: Variant[];
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onVariantsChange: (variants: Variant[]) => void;
  onAddVariant: () => void;
  techStack: string;
  techStackPrice: string;
  productIncludes: string;
  difficultyLevel: string;
  demo: string;
  onTechStackChange: (value: string) => void;
  onTechStackPriceChange: (value: string) => void;
  onProductIncludesChange: (value: string) => void;
  onDifficultyLevelChange: (value: string) => void;
  onDemoChange: (value: string) => void;
  industries: string[];
  useCases: string[];
  platform: string[];
  team: string[];
  onIndustryChange: (value: string) => void;
  onUseCaseChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onTeamChange: (value: string) => void;
}

export const EditProductLayout = ({
  isSaving,
  onSave,
  productId,
  productName,
  productDescription,
  variants,
  onNameChange,
  onDescriptionChange,
  onVariantsChange,
  onAddVariant,
  techStack,
  techStackPrice,
  productIncludes,
  difficultyLevel,
  demo,
  onTechStackChange,
  onTechStackPriceChange,
  onProductIncludesChange,
  onDifficultyLevelChange,
  onDemoChange,
  industries,
  useCases,
  platform,
  team,
  onIndustryChange,
  onUseCaseChange,
  onPlatformChange,
  onTeamChange,
}: EditProductLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <EditProductHeader isSaving={isSaving} onSave={onSave} />

          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <div className="space-y-3 sm:space-y-6">
                <div className="lg:hidden">
                  <ProductStatus />
                </div>

                <ProductBasicInfo
                  productName={productName}
                  productDescription={productDescription}
                  variants={variants}
                  onNameChange={onNameChange}
                  onDescriptionChange={onDescriptionChange}
                  onVariantsChange={onVariantsChange}
                  onAddVariant={onAddVariant}
                />

                <ProductTechnicalDetails
                  techStack={techStack}
                  techStackPrice={techStackPrice}
                  productIncludes={productIncludes}
                  difficultyLevel={difficultyLevel}
                  demo={demo}
                  onTechStackChange={onTechStackChange}
                  onTechStackPriceChange={onTechStackPrice}
                  onProductIncludesChange={onProductIncludes}
                  onDifficultyLevelChange={setDifficultyLevel}
                  onDemoChange={onDemoChange}
                />

                <Card className="p-3 sm:p-6">
                  <h2 className="text-lg font-medium mb-3 sm:mb-4">Media</h2>
                  <ProductMediaUpload productUuid={productId} />
                </Card>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 sm:space-y-6">
              <div className="hidden lg:block">
                <ProductStatus />
              </div>
              
              <ProductOrganizationDetails
                industries={industries}
                useCases={useCases}
                platform={platform}
                team={team}
                onIndustryChange={onIndustryChange}
                onUseCaseChange={onUseCaseChange}
                onPlatformChange={onPlatformChange}
                onTeamChange={onTeamChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
