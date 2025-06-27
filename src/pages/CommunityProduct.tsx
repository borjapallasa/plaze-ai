import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { useCommunityProduct } from "@/hooks/use-community-product";

export default function CommunityProductPage() {
  const { id } = useParams();
  const { data: communityProduct, isLoading, error } = useCommunityProduct(id);

  const handleCheckout = () => {
    if (communityProduct?.payment_link) {
      window.open(communityProduct.payment_link, '_blank');
    } else {
      alert("Payment link not available");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading product...</span>
        </div>
      </div>
    );
  }

  if (error || !communityProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground">The community product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Use product data from the joined query
  const productName = communityProduct.products?.name || communityProduct.name;
  const productDescription = communityProduct.products?.description || 'No description available';
  const productThumbnail = communityProduct.products?.thumbnail;
  const expertName = communityProduct.experts?.name || 'Unknown Expert';
  const expertThumbnail = communityProduct.experts?.thumbnail;
  const expertRating = communityProduct.experts?.client_satisfaction || 0;

  // Features array - keep some default features for now
  const features = [
    "Lifetime access to course materials",
    "Weekly live Q&A sessions",
    "Private community access",
    "30-day money-back guarantee",
    "Certificate of completion"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <div className="aspect-video w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden relative">
              {productThumbnail ? (
                <img 
                  src={productThumbnail} 
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <span className="text-2xl font-bold">CP</span>
                      </div>
                      <h2 className="text-2xl font-bold">Course Preview</h2>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                {productName}
              </h1>

              {/* Expert Information */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={expertThumbnail} alt={expertName} />
                  <AvatarFallback>{expertName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{expertName}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {expertRating ? `${expertRating}% satisfaction` : 'No rating available'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated recently</span>
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {productDescription}
              </p>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
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
                      ${communityProduct.price || 0}
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Community Product
                  </Badge>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                  disabled={!communityProduct.payment_link}
                >
                  Buy Now
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    30-day money-back guarantee
                  </p>
                  <button className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
                    <ExternalLink className="w-3 h-3" />
                    Share this product
                  </button>
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
