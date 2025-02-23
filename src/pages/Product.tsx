
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductReviews } from "@/components/product/ProductReviews";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";
import { StickyATC } from "@/components/product/StickyATC";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Product() {
  const [selectedVariant, setSelectedVariant] = useState("premium");
  const [showStickyATC, setShowStickyATC] = useState(false);
  const variantsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      console.log('Product data:', data);
      return data;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      if (variantsRef.current) {
        const variantsRect = variantsRef.current.getBoundingClientRect();
        setShowStickyATC(variantsRect.bottom < -100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: "Your item has been added to the cart.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 pt-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center text-red-500">
            Product not found or error loading product details.
          </div>
        </div>
      </div>
    );
  }

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
    { 
      id: 1, 
      author: "John Doe", 
      rating: 5, 
      content: "Excellent course, very detailed",
      description: "The course content is well structured and easy to follow. I learned a lot about UI/UX design principles.",
      avatar: getRandomImage(),
      date: "2 days ago",
      itemQuality: 5,
      shipping: 5,
      customerService: 5
    },
    { 
      id: 2, 
      author: "Jane Smith", 
      rating: 4, 
      content: "Great content, well structured",
      description: "Very comprehensive material with practical examples. Could use more exercises.",
      avatar: getRandomImage(),
      date: "1 week ago",
      itemQuality: 4,
      shipping: 5,
      customerService: 4
    },
    { 
      id: 3, 
      author: "Mike Johnson", 
      rating: 5, 
      content: "Best design course I've taken!",
      description: "The instructor explains complex concepts in a very clear and engaging way.",
      avatar: getRandomImage(),
      date: "2 weeks ago",
      itemQuality: 5,
      shipping: 4,
      customerService: 5
    },
    { 
      id: 4, 
      author: "Sarah Williams", 
      rating: 4, 
      content: "Very comprehensive",
      description: "Excellent course materials and resources. The practical examples were particularly helpful.",
      avatar: getRandomImage(),
      date: "3 weeks ago",
      itemQuality: 4,
      shipping: 4,
      customerService: 5
    }
  ];

  const moreFromSeller = [
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
    },
    {
      title: "Design Psychology",
      price: "$84.99",
      image: getRandomImage(),
      seller: "Design Master",
      description: "Understanding human behavior and cognitive principles in UX design.",
      tags: ["psychology", "ux"],
      category: "design"
    },
    {
      title: "Mobile UX Design",
      price: "$99.99",
      image: getRandomImage(),
      seller: "Design Master",
      description: "Create exceptional mobile user experiences and interfaces.",
      tags: ["mobile", "ux"],
      category: "design"
    },
    {
      title: "Design Portfolio Workshop",
      price: "$59.99",
      image: getRandomImage(),
      seller: "Design Master",
      description: "Build a standout design portfolio that attracts clients.",
      tags: ["portfolio", "career"],
      category: "design"
    },
    {
      title: "Enterprise UX Strategy",
      price: "$149.99",
      image: getRandomImage(),
      seller: "Design Master",
      description: "Strategic approaches to enterprise-level UX design challenges.",
      tags: ["enterprise", "strategy"],
      category: "design"
    },
    {
      title: "Design Leadership",
      price: "$129.99",
      image: getRandomImage(),
      seller: "Design Master",
      description: "Lead design teams and manage design processes effectively.",
      tags: ["leadership", "management"],
      category: "design"
    },
    {
      title: "Accessibility in Design",
      price: "$89.99",
      image: getRandomImage(),
      seller: "Design Master",
      description: "Create inclusive designs that work for everyone.",
      tags: ["accessibility", "inclusive"],
      category: "design"
    },
    {
      title: "Design Ethics",
      price: "$74.99",
      image: getRandomImage(),
      seller: "Design Master",
      description: "Ethical considerations and practices in UX/UI design.",
      tags: ["ethics", "principles"],
      category: "design"
    }
  ];

  const relatedProducts = [
    {
      title: "Responsive Web Design Course",
      price: "$79.99",
      image: getRandomImage(),
      seller: "WebMaster Pro",
      description: "Master the art of responsive web design and development.",
      tags: ["web", "responsive", "design"],
      category: "development"
    },
    {
      title: "Digital Marketing Fundamentals",
      price: "$89.99",
      image: getRandomImage(),
      seller: "Marketing Guru",
      description: "Learn essential digital marketing strategies and tools.",
      tags: ["marketing", "digital"],
      category: "marketing"
    },
    {
      title: "Product Management Essentials",
      price: "$99.99",
      image: getRandomImage(),
      seller: "PM Expert",
      description: "Comprehensive guide to modern product management.",
      tags: ["product", "management"],
      category: "business"
    },
    {
      title: "JavaScript Advanced Concepts",
      price: "$94.99",
      image: getRandomImage(),
      seller: "JS Master",
      description: "Deep dive into advanced JavaScript programming.",
      tags: ["javascript", "programming"],
      category: "development"
    },
    {
      title: "Graphic Design Masterclass",
      price: "$84.99",
      image: getRandomImage(),
      seller: "Design Pro",
      description: "Complete guide to professional graphic design.",
      tags: ["graphic", "design"],
      category: "design"
    },
    {
      title: "Content Creation Workshop",
      price: "$69.99",
      image: getRandomImage(),
      seller: "Content Creator",
      description: "Learn to create engaging digital content.",
      tags: ["content", "creation"],
      category: "marketing"
    },
    {
      title: "Data Analysis with Python",
      price: "$109.99",
      image: getRandomImage(),
      seller: "Data Expert",
      description: "Master data analysis using Python.",
      tags: ["python", "data"],
      category: "development"
    },
    {
      title: "SEO Optimization Course",
      price: "$79.99",
      image: getRandomImage(),
      seller: "SEO Master",
      description: "Learn modern SEO techniques and strategies.",
      tags: ["seo", "marketing"],
      category: "marketing"
    },
    {
      title: "Business Strategy Planning",
      price: "$129.99",
      image: getRandomImage(),
      seller: "Strategy Pro",
      description: "Develop effective business strategies.",
      tags: ["business", "strategy"],
      category: "business"
    },
    {
      title: "Mobile App Development",
      price: "$119.99",
      image: getRandomImage(),
      seller: "App Developer",
      description: "Complete mobile app development course.",
      tags: ["mobile", "development"],
      category: "development"
    },
    {
      title: "Email Marketing Strategy",
      price: "$74.99",
      image: getRandomImage(),
      seller: "Email Pro",
      description: "Master email marketing campaigns.",
      tags: ["email", "marketing"],
      category: "marketing"
    },
    {
      title: "Photography Basics",
      price: "$64.99",
      image: getRandomImage(),
      seller: "Photo Master",
      description: "Learn fundamental photography techniques.",
      tags: ["photography", "creative"],
      category: "creative"
    }
  ];

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 pt-24">
        <div className="lg:hidden">
          <ProductGallery 
            image={product.image || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"} 
            className="mb-6" 
          />
          <ProductHeader 
            title={product.name}
            seller={product.seller || "Design Master"}
            rating={4.8}
            className="mb-6"
          />
          <div ref={variantsRef}>
            <VariantPicker
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
              onAddToCart={handleAddToCart}
              className="mb-2"
            />
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 mb-8"
            onClick={() => {
              console.log("Contact seller clicked");
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Contact Seller
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="hidden lg:block">
              <ProductGallery 
                image={product.image || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"} 
                className="mb-8" 
              />
            </div>

            <Card className="p-6 mb-8">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
                <br /><br />
                {product.tech_stack && (
                  <>
                    Tech Stack:
                    <br />
                    {product.tech_stack.split(',').map((tech) => (
                      `• ${tech.trim()}`
                    )).join('<br />')}
                    <br /><br />
                  </>
                )}
                {product.product_includes && (
                  <>
                    What's Included:
                    <br />
                    {product.product_includes}
                  </>
                )}
              </p>
            </Card>
          </div>

          <div className="hidden lg:block">
            <ProductHeader 
              title={product.name}
              seller={product.seller || "Design Master"}
              rating={4.8}
              className="mb-6"
            />
            <div ref={variantsRef}>
              <VariantPicker
                variants={variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
                onAddToCart={handleAddToCart}
                className="mb-2"
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 mb-6"
              onClick={() => {
                console.log("Contact seller clicked");
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Contact Seller
            </Button>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                {product.tech_stack && (
                  <div>
                    <h4 className="font-medium mb-2">Tech Stack</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {product.tech_stack.split(',').map((tech, index) => (
                        <li key={index}>{tech.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">What's Included</h4>
                  <div className="text-sm text-muted-foreground">
                    {product.product_includes || 'No information provided'}
                  </div>
                </div>

                {product.difficulty_level && (
                  <div>
                    <h4 className="font-medium mb-2">Difficulty Level</h4>
                    <span className="text-sm text-muted-foreground">
                      {product.difficulty_level}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Demo</h2>
        <Card className="p-6 mb-8">
          <div className="aspect-video bg-accent rounded-lg"></div>
        </Card>

        <div className="lg:hidden mb-8">
          <Card className="p-6 mb-4">
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

        <ProductReviews reviews={reviews} className="p-6 mb-16" />

        <div className="pt-8">
          <MoreFromSeller products={moreFromSeller} className="mt-30" />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
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

        <StickyATC 
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          visible={showStickyATC}
          onAddToCart={handleAddToCart}
        />
      </main>
    </div>
  );
}
