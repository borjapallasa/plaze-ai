
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TemplateHeaderProps {
  productName: string;
  publicLink?: string;
}

export function TemplateHeader({ productName, publicLink }: TemplateHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handlePublicLinkClick = () => {
    if (publicLink) {
      window.open(publicLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="text-2xl font-semibold text-[#1A1F2C]">{productName}</h1>
      {publicLink && (
        <button
          onClick={handlePublicLinkClick}
          className="text-muted-foreground hover:text-foreground transition-colors ml-2"
          title="View public link"
        >
          <ExternalLink className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
