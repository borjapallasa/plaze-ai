
import { MainHeader } from "@/components/MainHeader";
import { ProductCard } from "@/components/ProductCard";

const placeholderImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return placeholderImages[randomIndex];
};

const products = [
  {
    title: "Professional UI/UX Design Course",
    price: "$99.99",
    image: getRandomImage(),
    seller: "Design Master",
    description: "Complete guide to mastering UI/UX design principles and tools.",
    tags: ["design", "ui", "ux"],
    category: "design"
  },
  {
    title: "Advanced UX Research Methods",
    price: "$89.99",
    image: getRandomImage(),
    seller: "Design Master",
    description: "Learn professional UX research techniques and methodologies.",
    tags: ["research", "ux"],
    category: "design"
  },
  {
    title: "UI Animation Masterclass",
    price: "$79.99",
    image: getRandomImage(),
    seller: "Design Master",
    description: "Create engaging interface animations and micro-interactions.",
    tags: ["animation", "ui"],
    category: "design"
  },
  {
    title: "Design Systems Workshop",
    price: "$129.99",
    image: getRandomImage(),
    seller: "Design Master",
    description: "Build and maintain scalable design systems for large applications.",
    tags: ["systems", "workflow"],
    category: "design"
  },
  {
    title: "Figma Advanced Techniques",
    price: "$69.99",
    image: getRandomImage(),
    seller: "Design Master",
    description: "Master advanced Figma features and workflows for professional design.",
    tags: ["figma", "tools"],
    category: "design"
  },
  {
    title: "User Testing Fundamentals",
    price: "$94.99",
    image: getRandomImage(),
    seller: "Design Master",
    description: "Learn effective user testing methods and result analysis.",
    tags: ["testing", "research"],
    category: "design"
  }
];

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">All Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}
