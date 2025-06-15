
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TemplateHeaderProps {
  productName: string;
}

export function TemplateHeader({ productName }: TemplateHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Breadcrumb */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-[#1A1F2C]">{productName}</h1>
      </div>
    </>
  );
}
