import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  seller: string;
  description: string;
  tags: string[];
  fromPrice?: string;
}

export const ProductCard = ({ title, price, image, seller, description, tags, fromPrice }: ProductCardProps) => {
  return (
    <Card className="product-card hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-semibold text-xl">{title}</h3>
              {fromPrice && (
                <span className="text-sm text-muted-foreground">from {fromPrice}</span>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="font-medium">
            {price}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
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
      </CardContent>
    </Card>
  );
};