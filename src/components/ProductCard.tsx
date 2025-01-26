import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  seller: string;
  description: string;
}

export const ProductCard = ({ title, price, image, seller, description }: ProductCardProps) => {
  return (
    <Card className="product-card hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <img
                src={image}
                alt={title}
                className="w-8 h-8 object-contain"
              />
            </div>
            <h3 className="font-semibold text-xl">{title}</h3>
          </div>
          <Badge variant="secondary" className="font-medium">
            {price}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};