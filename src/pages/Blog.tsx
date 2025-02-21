
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Clock } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      title: "VAPI AI Review: The Ultimate Guide to Choosing the Best AI Phone Agent for Your Needs",
      image: "/lovable-uploads/385ba41d-cf26-4fe6-a604-0a7dd0f79b94.png",
      readTime: "7 minutes",
      description: "A comprehensive review of VAPI AI's phone agent technology",
      tags: ["ai", "automation"],
      category: "Review"
    },
    {
      title: "Master Google Spreadsheets: Your Complete Guide to Efficiency and Expertise",
      image: "/lovable-uploads/385ba41d-cf26-4fe6-a604-0a7dd0f79b94.png",
      readTime: "8 minutes",
      description: "Learn to master Google Spreadsheets for better productivity",
      tags: ["productivity", "tutorial"],
      category: "Guide"
    },
    {
      title: "Discover the Top 12 Airtable Alternatives in 2024 for Enhanced Productivity",
      image: "/lovable-uploads/385ba41d-cf26-4fe6-a604-0a7dd0f79b94.png",
      readTime: "7 minutes",
      description: "Explore the best Airtable alternatives for your workflow",
      tags: ["tools", "productivity"],
      category: "Comparison"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-primary">Read</span> all AI & No-Code Tool <span className="text-primary">Blog!</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {blogPosts.map((post, index) => (
          <ProductCard
            key={index}
            title={post.title}
            description={post.description}
            image={post.image}
            category={post.category}
            tags={post.tags}
            price={post.readTime}
            seller=""
            fromPrice=""
          />
        ))}
      </div>

      <div className="bg-accent/30 rounded-xl p-8 md:p-12 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          The <span className="text-blue-600">easiest way</span> to{" "}
          <span className="text-blue-600">buy & sell no-code templates!</span>
        </h2>
        
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          NoCodeClick is the easiest way to buy and sell no code templates, offering a streamlined platform that caters to both developers and buyers for quick, hassle-free transactions.
        </p>

        <Button asChild size="lg" className="font-semibold">
          <Link to="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
