import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductVariants } from "@/components/product/ProductVariants";
import { ProductReviews } from "@/components/product/ProductReviews";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";

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
    { 
      id: 1, 
      author: "John Doe", 
      rating: 5, 
      content: "Excellent course, very detailed",
      description: "The course content is well structured and easy to follow. I learned a lot about UI/UX design principles.",
      avatar: "/placeholder.svg",
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
      avatar: "/placeholder.svg",
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
      avatar: "/placeholder.svg",
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
      avatar: "/placeholder.svg",
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
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Learn professional UX research techniques and methodologies.",
      tags: ["research", "ux"],
      category: "design"
    },
    {
      title: "UI Animation Masterclass",
      price: "$79.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Create engaging interface animations and micro-interactions.",
      tags: ["animation", "ui"],
      category: "design"
    },
    {
      title: "Design Systems Workshop",
      price: "$129.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Build and maintain scalable design systems for large applications.",
      tags: ["systems", "workflow"],
      category: "design"
    },
    {
      title: "Figma Advanced Techniques",
      price: "$69.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Master advanced Figma features and workflows for professional design.",
      tags: ["figma", "tools"],
      category: "design"
    },
    {
      title: "User Testing Fundamentals",
      price: "$94.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Learn effective user testing methods and result analysis.",
      tags: ["testing", "research"],
      category: "design"
    },
    {
      title: "Design Psychology",
      price: "$84.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Understanding human behavior and cognitive principles in UX design.",
      tags: ["psychology", "ux"],
      category: "design"
    },
    {
      title: "Mobile UX Design",
      price: "$99.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Create exceptional mobile user experiences and interfaces.",
      tags: ["mobile", "ux"],
      category: "design"
    },
    {
      title: "Design Portfolio Workshop",
      price: "$59.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Build a standout design portfolio that attracts clients.",
      tags: ["portfolio", "career"],
      category: "design"
    },
    {
      title: "Enterprise UX Strategy",
      price: "$149.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Strategic approaches to enterprise-level UX design challenges.",
      tags: ["enterprise", "strategy"],
      category: "design"
    },
    {
      title: "Design Leadership",
      price: "$129.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Lead design teams and manage design processes effectively.",
      tags: ["leadership", "management"],
      category: "design"
    },
    {
      title: "Accessibility in Design",
      price: "$89.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Create inclusive designs that work for everyone.",
      tags: ["accessibility", "inclusive"],
      category: "design"
    },
    {
      title: "Design Ethics",
      price: "$74.99",
      image: "/placeholder.svg",
      seller: "Design Master",
      description: "Ethical considerations and practices in UX/UI design.",
      tags: ["ethics", "principles"],
      category: "design"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <ProductGallery image={product.image} className="mb-6" />
        <ProductHeader 
          title={product.title}
          seller={product.seller}
          rating={product.rating}
          className="mb-6"
        />
        <ProductVariants
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          className="mb-6"
        />
      </div>

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="hidden lg:block">
            <ProductGallery image={product.image} className="mb-8" />
          </div>

          <Card className="p-6 mb-8">
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
          <ProductHeader 
            title={product.title}
            seller={product.seller}
            rating={product.rating}
          />
          <ProductVariants
            variants={variants}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
          />
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

      <h2 className="text-xl font-semibold mb-4">Demo</h2>
      <Card className="p-6 mb-8">
        <div className="aspect-video bg-accent rounded-lg"></div>
      </Card>

      <ProductReviews reviews={reviews} className="p-6 mb-16" />

      <MoreFromSeller products={moreFromSeller} className="mt-16" />
    </div>
  );
}
