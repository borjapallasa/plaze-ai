
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, MessageSquare, Star } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

export default function Product() {
  // Placeholder data
  const product = {
    title: "Professional UI/UX Design Course",
    views: "9,995",
    seller: "Design Master",
    rating: 4.8,
    image: "/placeholder.svg",
    price: "$99.99",
    description: "Complete guide to mastering UI/UX design principles and tools.",
    tags: ["design", "ui", "ux"],
    category: "design"
  };

  const reviews = [
    { id: 1, author: "John Doe", rating: 5, content: "Excellent course, very detailed and practical." },
    { id: 2, author: "Jane Smith", rating: 4, content: "Great content, well structured." },
    { id: 3, author: "Mike Johnson", rating: 5, content: "Best design course I've taken so far!" },
    { id: 4, author: "Sarah Williams", rating: 4, content: "Very comprehensive, great examples." }
  ];

  const moreFromSeller = Array(5).fill({
    title: "Another Great Course",
    price: "$79.99",
    image: "/placeholder.svg",
    seller: "Design Master",
    description: "More amazing content from our expert instructor.",
    tags: ["design", "learning"],
    category: "education"
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg overflow-hidden mb-8 aspect-square">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8">
            {Array(5).fill(0).map((_, i) => (
              <img 
                key={i}
                src={product.image} 
                alt={`Preview ${i + 1}`}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
            ))}
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
              <br /><br />
              This comprehensive course covers everything you need to know about UI/UX design. From fundamental principles 
              to advanced techniques, you'll learn how to create beautiful and functional user interfaces. Topics include:
              <br /><br />
              • User Research and Analysis<br />
              • Wireframing and Prototyping<br />
              • Visual Design Principles<br />
              • User Testing and Iteration<br />
              • Industry Standard Tools<br />
              <br />
              Perfect for beginners and intermediate designers looking to enhance their skills and create professional-grade designs.
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">{product.title}</h1>
              <Badge variant="secondary" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                {product.views}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent" />
              <div>
                <h3 className="font-medium">{product.seller}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full">
                Watch
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Apps & Pricing</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Basic License</span>
                <span className="font-medium">{product.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Extended License</span>
                <span className="font-medium">${parseFloat(product.price.replace('$', '')) * 2}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Full-width Demo Section */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Demo</h2>
        <div className="aspect-video bg-accent rounded-lg"></div>
      </Card>

      {/* Full-width Reviews Section */}
      <Card className="p-6 mb-16">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {Array(review.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">{review.author}</span>
              </div>
              <p className="text-muted-foreground">{review.content}</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* More from seller */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-8">More from seller</h2>
        <div className="product-grid">
          {moreFromSeller.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
