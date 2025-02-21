
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  return (
    <Card className="group relative flex flex-col space-y-4 p-4 lg:p-6 hover:bg-accent transition-colors">
      <div className="flex items-start gap-3 lg:gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight truncate">{title}</h3>
          <Badge 
            variant="secondary" 
            className="font-medium capitalize bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs mt-1.5"
          >
            {category}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-foreground line-clamp-2">{description}</p>

      <div className="space-y-1">
        <div className="text-sm font-medium">Minimum earnings: {price}</div>
        {split && (
          <div className="text-xs text-muted-foreground">
            Commission split: {split}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between -mt-3">
        <div className="flex gap-2 flex-wrap">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
