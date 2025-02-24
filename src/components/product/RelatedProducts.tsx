
import { ProductCard } from "@/components/ProductCard";

interface Product {
  title: string;
  price: string;
  image: string;
  seller: string;
  description: string;
  tags: string[];
  category: string;
}

interface RelatedProductsProps {
  products: Product[];
  className?: string;  // Added className as optional prop
}

export function RelatedProducts({ products, className }: RelatedProductsProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            title={product.title}
            price={product.price}
            image={product.image}
            seller={product.seller}
            description={product.description}
            tags={product.tags}
            category={product.category}
          />
        ))}
      </div>
    </div>
  );
}
