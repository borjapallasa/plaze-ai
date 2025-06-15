
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface TemplateHeaderProps {
  productName: string;
}

export function TemplateHeader({ productName }: TemplateHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <Link
        to="/a/admin/draft-templates"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-[#1A1F2C]">{productName}</h1>
        <p className="text-[#8E9196]">Review and manage template details</p>
      </div>
    </>
  );
}
