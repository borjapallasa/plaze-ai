
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  seller: string;
  description: string;
  tags: string[];
  fromPrice?: string;
  category: string;
  split?: string;
}

export const ProductCard = ({ title, price, image, seller, description, tags, fromPrice, category, split }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group relative flex flex-col p-4 lg:p-6 hover:bg-accent transition-colors cursor-pointer" 
      onClick={() => navigate('/product')}
    >
      <div className="flex items-start gap-3 lg:gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight truncate">{title}</h3>
          <Badge 
            variant="secondary" 
            className="font-medium capitalize bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs mt-1.5"
          >
            {category}
          </Badge>
        </div>
      </div>

      <p className="text-base text-foreground line-clamp-2 mt-4 mb-6">{description}</p>

      <div className="flex gap-2 flex-wrap mt-auto mb-4">
        {tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="border-t border-border mt-auto pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">From {price}</span>
            </div>
            {split && (
              <div className="flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{split}</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
