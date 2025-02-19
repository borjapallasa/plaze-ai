import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, MessageSquare, Star, ShoppingCart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Product() {
  const [selectedVariant, setSelectedVariant] = useState("premium");

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

  const variants = [
    { 
      id: "basic",
      name: "Basic Package",
      price: 99.99,
      comparePrice: 149.99,
      label: "Most Popular",
      features: ["Core Course", "Basic Resources"]
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 149.99,
      comparePrice: 199.99,
      label: "Best Value",
      highlight: true,
      features: ["Core Course", "Premium Resources"]
    },
    {
      id: "pro",
      name: "Professional Package",
      price: 199.99,
      comparePrice: 299.99,
      label: "Most Complete",
      features: ["Core Course", "Premium Resources"]
    }
  ];

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

  const currentVariant = variants.find(v => v.id === selectedVariant) || variants[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:hidden">
        <h1 className="text-2xl font-semibold mb-4">{product.title}</h1>
        
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

        <div className="mb-6">
          <RadioGroup 
            value={selectedVariant} 
            onValueChange={setSelectedVariant}
            className="space-y-4"
          >
            {variants.map((variant) => (
              <div 
                key={variant.id} 
                className={`relative rounded-lg p-4 transition-all ${
                  variant.highlight 
                    ? 'border-2 border-primary shadow-lg' 
                    : 'border border-border'
                }`}
              >
                <Badge 
                  variant={variant.highlight ? "default" : "secondary"}
                  className="absolute -top-2 left-4 z-10"
                >
                  {variant.label}
                </Badge>
                <RadioGroupItem 
                  value={variant.id} 
                  id={variant.id} 
                  className="absolute right-4 top-4"
                />
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-base font-semibold">{variant.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">${variant.price}</span>
                    <span className="text-xs text-muted-foreground line-through">
                      ${variant.comparePrice}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {variant.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-4 mt-4">
            <Button className="w-full">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Seller
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-card rounded-lg overflow-hidden mb-4 aspect-square">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {Array(5).fill(0).map((_, i) => (
              <img 
                key={i}
                src={product.image} 
                alt={`Preview ${i + 1}`}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="hidden lg:block">
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

        <div className="hidden lg:block space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-4">{product.title}</h1>
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

            <div className="mb-6">
              <RadioGroup 
                value={selectedVariant} 
                onValueChange={setSelectedVariant}
                className="space-y-4"
              >
                {variants.map((variant) => (
                  <div 
                    key={variant.id} 
                    className={`relative rounded-lg p-4 transition-all ${
                      variant.highlight 
                        ? 'border-2 border-primary shadow-lg' 
                        : 'border border-border'
                    }`}
                  >
                    <Badge 
                      variant={variant.highlight ? "default" : "secondary"}
                      className="absolute -top-2 left-4 z-10"
                    >
                      {variant.label}
                    </Badge>
                    <RadioGroupItem 
                      value={variant.id} 
                      id={variant.id} 
                      className="absolute right-4 top-4"
                    />
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-base font-semibold">{variant.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold">${variant.price}</span>
                        <span className="text-xs text-muted-foreground line-through">
                          ${variant.comparePrice}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {variant.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="space-y-4 mt-4">
                <Button className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
              </div>
            </div>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Apps Involved</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Make</li>
                  <li>Google Sheets</li>
                  <li>Gmail</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Apps Pricing</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Make: Free tier available</li>
                  <li>Google Workspace: From $6/month</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">What's Included</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>3x Make Templates</li>
                  <li>1x Google Sheet Template</li>
                  <li>Setup Documentation</li>
                  <li>Email Support</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Difficulty Level</h4>
                <span className="text-sm text-muted-foreground">
                  Intermediate - Basic knowledge of Make and Google Sheets required
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Demo</h2>
        <div className="aspect-video bg-accent rounded-lg"></div>
      </Card>

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
