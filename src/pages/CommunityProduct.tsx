
import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Calendar, ExternalLink } from "lucide-react";

export default function CommunityProductPage() {
  const { id } = useParams();

  // Fake data for the product
  const productData = {
    name: "AI Automation Masterclass",
    description: "Complete guide to building AI-powered automation workflows without code. Learn from industry experts and join a community of 10,000+ automation enthusiasts.",
    price: 99.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviews: 342,
    students: 1250,
    lastUpdated: "Updated 2 weeks ago",
    features: [
      "Lifetime access to course materials",
      "Weekly live Q&A sessions",
      "Private community access",
      "30-day money-back guarantee",
      "Certificate of completion"
    ],
    tags: ["AI", "Automation", "No-Code", "Business"]
  };

  const handleCheckout = () => {
    // Fake checkout functionality
    alert("Redirecting to checkout - this would normally process payment");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <div className="aspect-video w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <span className="text-2xl font-bold">AI</span>
                  </div>
                  <h2 className="text-2xl font-bold">Course Preview</h2>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {productData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold text-foreground">
                {productData.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{productData.rating}</span>
                  <span>({productData.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{productData.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{productData.lastUpdated}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {productData.description}
              </p>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {productData.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      ${productData.price}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${productData.originalPrice}
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Limited Time Offer
                  </Badge>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                >
                  Buy Now
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    30-day money-back guarantee
                  </p>
                  <button className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
                    <ExternalLink className="w-3 h-3" />
                    Share this course
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {productData.students.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {productData.rating}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Community Access</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join thousands of automation experts in our exclusive community
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-medium">10,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Today</span>
                    <span className="font-medium">1,234</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product ID for reference */}
        <div className="text-center text-xs text-muted-foreground mt-8 pt-4 border-t">
          Product ID: {id}
        </div>
      </div>
    </div>
  );
}
