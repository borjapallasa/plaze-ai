import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  seller: string;
}

export const ProductCard = ({ title, price, image, seller }: ProductCardProps) => {
  return (
    <Card className="product-card overflow-hidden">
      <CardContent className="p-0">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{seller}</p>
        <p className="font-bold">{price}</p>
      </CardFooter>
    </Card>
  );
};