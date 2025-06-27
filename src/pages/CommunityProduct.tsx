
import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, ExternalLink, Loader2, UserPlus } from "lucide-react";
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
  const productIncludes = communityProduct.products?.product_includes;
  const expertName = communityProduct.experts?.name || 'Unknown Expert';
  const expertThumbnail = communityProduct.experts?.thumbnail;
  const expertRating = communityProduct.experts?.client_satisfaction || 0;
  const expertCreatedAt = communityProduct.experts?.created_at;

  // Format the created date
  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Joined 1 day ago";
    if (diffDays < 7) return `Joined ${diffDays} days ago`;
    if (diffDays < 14) return "Joined 1 week ago";
    if (diffDays < 21) return "Joined 2 weeks ago";
    if (diffDays < 28) return "Joined 3 weeks ago";
    if (diffDays < 60) return "Joined 1 month ago";
    return `Joined ${Math.floor(diffDays / 30)} months ago`;
  };

  // Parse product_includes - it could be a string with line breaks or bullet points
  const parseProductIncludes = (includes: string) => {
    if (!includes) return [];
    
    // Split by line breaks and filter out empty lines
    const lines = includes.split(/\r?\n/).filter(line => line.trim());
    
    // If no line breaks, try splitting by bullet points or dashes
    if (lines.length === 1) {
      const bulletSplit = includes.split(/[•·-]\s*/).filter(item => item.trim());
      if (bulletSplit.length > 1) {
        return bulletSplit.map(item => item.trim()).filter(item => item);
      }
    }
    
    return lines.map(line => line.trim().replace(/^[•·-]\s*/, ''));
  };

  const features = productIncludes ? parseProductIncludes(productIncludes) : [
    "Lifetime access to course materials",
    "Weekly live Q&A sessions", 
    "Private community access",
    "30-day money-back guarantee",
    "Certificate of completion"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section - Balanced sizing */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden relative shadow-lg" style={{ height: '60vh', maxHeight: '400px' }}>
            {productThumbnail ? (
              <img 
                src={productThumbnail} 
                alt={productName} 
                className="w-full h-full object-cover" 
                loading="lazy"
                aria-hidden="true"
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Seller Info - Unified */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
                  {productName}
                </h1>
              </div>
              
              {/* Seller Badge */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={expertThumbnail} alt={expertName} />
                    <AvatarFallback className="text-xs">
                      {expertName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{expertName}</span>
                </div>

                {expertRating > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{expertRating}% satisfaction</span>
                    </div>
                  </>
                )}

                {expertCreatedAt && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <UserPlus className="w-4 h-4" />
                      <span>{formatJoinedDate(expertCreatedAt)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description Block */}
            <div className="mb-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                {productDescription}
              </p>
            </div>

            {/* What's Included Block */}
            {features.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Unified Price & CTA Card */}
          <div className="lg:sticky lg:top-4">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                {/* Price Section */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      ${communityProduct.price || 0}
                    </span>
                    {communityProduct.compare_price && communityProduct.compare_price > (communityProduct.price || 0) && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${communityProduct.compare_price}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={handleCheckout} 
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md" 
                  size="lg" 
                  disabled={!communityProduct.payment_link}
                >
                  Buy Now
                </Button>

                {/* Guarantee & Share */}
                <div className="space-y-3 pt-2 border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    30-day money-back guarantee
                  </p>
                  <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mx-auto transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    Share this product
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-50 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="text-xl font-bold text-foreground">
                    ${communityProduct.price || 0}
                  </span>
                  {communityProduct.compare_price && communityProduct.compare_price > (communityProduct.price || 0) && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ${communityProduct.compare_price}
                    </span>
                  )}
                </div>
                <Button 
                  onClick={handleCheckout} 
                  className="flex-none px-6 py-3 font-semibold bg-primary hover:bg-primary/90" 
                  disabled={!communityProduct.payment_link}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product ID for reference */}
        <div className="text-center text-xs text-muted-foreground mt-8 pt-4 border-t pb-20 lg:pb-4">
          Product ID: {id}
        </div>
      </div>
    </div>
  );
}
