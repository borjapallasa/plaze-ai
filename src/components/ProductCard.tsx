import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  seller: string;
  description: string;
  tags: string[];
  fromPrice?: string;
  category: string;
}

export const ProductCard = ({ title, price, image, seller, description, tags, fromPrice, category }: ProductCardProps) => {
  return (
    <Card className="product-card hover:shadow-lg transition-shadow">
      <CardContent className="p-6 relative">
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 font-medium capitalize bg-blue-50 text-blue-600 hover:bg-blue-50"
        >
          {category}
        </Badge>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate w-full max-w-[200px]">{title}</h3>
              {fromPrice && (
                <span className="text-sm text-muted-foreground mt-0.5">from {fromPrice}</span>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
          <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs flex-shrink-0"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};