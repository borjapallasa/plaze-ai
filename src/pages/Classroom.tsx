import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ProductVariants } from "@/components/product/ProductVariants";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Classroom() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState("basic");
  const isMobile = useIsMobile();
  
  const lessons = [
    {
      title: "Week 5",
      isActive: false,
    },
    {
      title: "Week 4",
      isActive: true,
    },
    {
      title: "Week 3",
      isActive: false,
    },
    {
      title: "Week 1",
      isActive: false,
    },
  ];

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

  const handleAddToCart = () => {
    // Add to cart logic here
  };

  const LessonsList = () => (
    <div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-2 hover:bg-muted/50 p-2 rounded-lg transition-colors"
      >
        <h3 className="font-medium">New set</h3>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isExpanded ? "transform rotate-0" : "transform rotate-180"
          )} 
        />
      </button>
      <div className={cn(
        "space-y-1 overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-[500px]" : "max-h-0"
      )}>
        {lessons.map((lesson) => (
          <button
            key={lesson.title}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              lesson.isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            {lesson.title}
          </button>
        ))}
      </div>
    </div>
  );

  const ProductsSection = () => (
    <div className="pt-4 border-t">
      <h3 className="font-semibold mb-4">Products in this class</h3>
      <ProductVariants
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        onAddToCart={handleAddToCart}
        className="space-y-2"
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      {isMobile ? (
        <div className="space-y-6">
          <Card className="w-full">
            <CardContent className="p-6 space-y-6">
              <h1 className="text-4xl font-bold">How To Create Automated SEO Blogs With AI?</h1>
              
              <div className="space-y-4">
                <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                  <img 
                    src="/lovable-uploads/ecaf60f3-4e1d-4836-ab26-8d0f919503e0.png"
                    alt="Course thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                      <div className="w-6 h-6 border-8 border-transparent border-l-primary ml-1" style={{ transform: 'rotate(-45deg)' }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">All formulas & scripts →</span>
                  <a 
                    href="https://docs.google.com/document/d/1TYRkoPNAFhU-ryYDhzPLQi6zrP5kezlg6N5ukcCRP5Vk/edit?usp=sharing" 
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    View Documentation
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <p>
                  In this video, we are going to learn how to create an auto blogging no-code software using{" "}
                  <span className="font-semibold">OpenAI, Airtable & Make</span> and publish them automatically to{" "}
                  <span className="font-semibold">Shopify</span> and{" "}
                  <span className="font-semibold">Wordpress</span>.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">No-Code Approach</h3>
                    <p className="text-muted-foreground">
                      This no-code approach allows users to manage and generate blogs through an accessible Airtable interface. 
                      By enabling the importation of existing web articles and the incorporation of new client details, 
                      our solution ensures content accurately mirrors the intended tone and voice of different websites.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Synergy Between Tools</h3>
                    <p className="text-muted-foreground">
                      The synergy between Airtable, Make, and OpenAI streamlines the content creation process. 
                      This workflow automatically generates written content, enhancing the blogging experience 
                      for both creators and their audience. Furthermore, our system brings visual appeal to each 
                      blog post by including images from the Unsplash API.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Automated Organization</h3>
                    <p className="text-muted-foreground">
                      The blogs are automatically organized to feature an index, FAQs, and conclusions and also 
                      to include related images properly alt-texted. This structured format enhances the reader's 
                      experience by making content easily navigable and informative.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Target Audience</h3>
                    <p className="text-muted-foreground">
                      Designed for content creators, digital marketers, and business owners, our solution focuses 
                      on ease of use. It aims to reduce the complexity of maintaining an updated and relevant blog, 
                      freeing up users to concentrate on other critical aspects of their work. By automating content 
                      creation, our system saves time and allows for the efficient management of a consistent online presence.
                    </p>
                  </div>
                </div>

              </div>

              <div className="flex gap-4">
                <Button variant="outline">Edit Classroom Details</Button>
                <Button>Add New Lesson</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-4">
              <ProductsSection />
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-left leading-snug">How To Create Automated SEO Blogs With AI</h2>
                  <div className="h-2 bg-muted rounded-full mb-2">
                    <div className="h-full w-0 bg-primary rounded-full"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">0% complete</p>
                </div>

                <LessonsList />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex gap-6">
          <Card className="w-80 flex-shrink-0 h-fit">
            <CardContent className="p-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-left leading-snug">How To Create Automated SEO Blogs With AI</h2>
                  <div className="h-2 bg-muted rounded-full mb-2">
                    <div className="h-full w-0 bg-primary rounded-full"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">0% complete</p>
                </div>

                <LessonsList />

                <ProductsSection />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-6 space-y-6">
              <h1 className="text-4xl font-bold">How To Create Automated SEO Blogs With AI?</h1>
              
              <div className="space-y-4">
                <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                  <img 
                    src="/lovable-uploads/ecaf60f3-4e1d-4836-ab26-8d0f919503e0.png"
                    alt="Course thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                      <div className="w-6 h-6 border-8 border-transparent border-l-primary ml-1" style={{ transform: 'rotate(-45deg)' }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">All formulas & scripts →</span>
                  <a 
                    href="https://docs.google.com/document/d/1TYRkoPNAFhU-ryYDhzPLQi6zrP5kezlg6N5ukcCRP5Vk/edit?usp=sharing" 
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    View Documentation
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <p>
                  In this video, we are going to learn how to create an auto blogging no-code software using{" "}
                  <span className="font-semibold">OpenAI, Airtable & Make</span> and publish them automatically to{" "}
                  <span className="font-semibold">Shopify</span> and{" "}
                  <span className="font-semibold">Wordpress</span>.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">No-Code Approach</h3>
                    <p className="text-muted-foreground">
                      This no-code approach allows users to manage and generate blogs through an accessible Airtable interface. 
                      By enabling the importation of existing web articles and the incorporation of new client details, 
                      our solution ensures content accurately mirrors the intended tone and voice of different websites.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Synergy Between Tools</h3>
                    <p className="text-muted-foreground">
                      The synergy between Airtable, Make, and OpenAI streamlines the content creation process. 
                      This workflow automatically generates written content, enhancing the blogging experience 
                      for both creators and their audience. Furthermore, our system brings visual appeal to each 
                      blog post by including images from the Unsplash API.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Automated Organization</h3>
                    <p className="text-muted-foreground">
                      The blogs are automatically organized to feature an index, FAQs, and conclusions and also 
                      to include related images properly alt-texted. This structured format enhances the reader's 
                      experience by making content easily navigable and informative.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Target Audience</h3>
                    <p className="text-muted-foreground">
                      Designed for content creators, digital marketers, and business owners, our solution focuses 
                      on ease of use. It aims to reduce the complexity of maintaining an updated and relevant blog, 
                      freeing up users to concentrate on other critical aspects of their work. By automating content 
                      creation, our system saves time and allows for the efficient management of a consistent online presence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline">Edit Classroom Details</Button>
                <Button>Add New Lesson</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
