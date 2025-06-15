
import { ArrowLeft, FileText, Link as LinkIcon, Play, Star, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionFiles } from "./components/TransactionFiles";
import { Separator } from "@/components/ui/separator";
import { ProductStatus } from "@/components/product/ProductStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useProduct } from "@/hooks/use-product";
import { Skeleton } from "@/components/ui/skeleton";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default function AdminTemplateDetails() {
  const params = useParams();
  const { product, isLoading, error } = useProduct({
    productId: params.id
  });

  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16 space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-1">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Template Not Found</h2>
            <p className="text-gray-600 mb-4">The template you're looking for doesn't exist or couldn't be loaded.</p>
            <Link
              to="/a/admin/draft-templates"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Mock financial metrics and reviews data (these would need separate API calls)
  const mockFinancialMetrics = {
    timesSold: 35,
    totalRevenue: 1200,
    averagePrice: product.price_from || 39,
    conversionRate: 8.5
  };

  const mockReviews = {
    averageRating: 4.5,
    totalReviews: 12,
    items: [
      {
        id: "1",
        author: "John D.",
        rating: 5,
        date: "March 20, 2024",
        content: "Template is amazing! Everything works as it should. The support team is very friendly and helped me set everything up. Highly recommend!"
      },
      {
        id: "2",
        author: "Sarah M.",
        rating: 4,
        date: "March 18, 2024",
        content: "Great automation template, saved me hours of work. Would be perfect with a few more customization options."
      }
    ]
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16 space-y-6">
        {/* Breadcrumb */}
        <Link
          to="/a/admin/draft-templates"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#1A1F2C]">{product.name}</h1>
          <p className="text-[#8E9196]">Review and manage template details</p>
        </div>

        {/* Mobile Status Card - Only visible on mobile */}
        <div className="md:hidden">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Select defaultValue={product.status || "active"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Image */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-blue-600">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <FileText className="h-16 w-16" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-[#8E9196]">Times Sold</p>
                    <p className="text-xl font-semibold">{product.sales_count || mockFinancialMetrics.timesSold}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-[#8E9196]">Total Revenue</p>
                    <p className="text-xl font-semibold text-green-600">
                      ${product.sales_amount || mockFinancialMetrics.totalRevenue}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-[#8E9196]">Average Price</p>
                    <p className="text-xl font-semibold">
                      ${product.price_from || mockFinancialMetrics.averagePrice}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-[#8E9196]">Conversion Rate</p>
                    <p className="text-xl font-semibold">
                      {mockFinancialMetrics.conversionRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description ? (
                  product.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-[#1A1F2C] leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-[#8E9196]">No description available</p>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Customer Reviews ({product.review_count || mockReviews.totalReviews})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Rating */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center px-6 border-r border-gray-200">
                    <p className="text-3xl font-bold text-[#1A1F2C]">
                      {mockReviews.averageRating}
                    </p>
                    <StarRating rating={mockReviews.averageRating} />
                    <p className="text-sm text-[#8E9196] mt-1">
                      {product.review_count || mockReviews.totalReviews} reviews
                    </p>
                  </div>
                  <div className="flex-1">
                    {/* Add rating distribution here if needed */}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {mockReviews.items.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-[#8E9196]">({review.rating}/5)</span>
                      </div>
                      <p className="text-[#1A1F2C] italic">{review.content}</p>
                      <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                        <span>{review.author}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                      {review.id !== mockReviews.items[mockReviews.items.length - 1].id && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Card - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Select defaultValue={product.status || "active"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Save</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Primary Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-[#8E9196]">Uploaded by</p>
                  <p className="text-sm font-medium">{product.expert_uuid || "Unknown"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-[#8E9196]">Category</p>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
                    {product.type || "General"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-[#8E9196]">Created @</p>
                  <p className="text-sm font-medium">
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>

                <Separator />

                <TransactionFiles
                  filesUrl={product.public_link || ""}
                  guidesUrl=""
                />

                <div className="pt-4 space-y-3">
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Activate Template
                  </Button>
                  <Button variant="outline" className="w-full">
                    Edit Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Teams */}
                <div className="space-y-2">
                  <Label htmlFor="team">Teams</Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(product.team) && product.team.map((team: string) => (
                          <Badge key={team} variant="secondary" className="px-2 py-1">
                            {team}
                          </Badge>
                        ))}
                        {selectedTeams.map((team) => (
                          <Badge
                            key={team}
                            variant="secondary"
                            className="px-2 py-1 hover:bg-destructive/20 cursor-pointer"
                            onClick={() => setSelectedTeams(selectedTeams.filter(t => t !== team))}
                          >
                            {team}
                            <span className="ml-1">×</span>
                          </Badge>
                        ))}
                        {((!Array.isArray(product.team) || product.team.length === 0) && selectedTeams.length === 0) && (
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              if (!selectedTeams.includes(value)) {
                                setSelectedTeams([...selectedTeams, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-[100px] focus:ring-0" hideIndicator>
                              <SelectValue placeholder="Add team" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="team1">Team 1</SelectItem>
                              <SelectItem value="team2">Team 2</SelectItem>
                              <SelectItem value="team3">Team 3</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industries */}
                <div className="space-y-2">
                  <Label htmlFor="industries">Industries</Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(product.industries) && product.industries.map((industry: string) => (
                          <Badge key={industry} variant="secondary" className="px-2 py-1">
                            {industry}
                          </Badge>
                        ))}
                        {selectedIndustries.map((industry) => (
                          <Badge
                            key={industry}
                            variant="secondary"
                            className="px-2 py-1 hover:bg-destructive/20 cursor-pointer"
                            onClick={() => setSelectedIndustries(selectedIndustries.filter(i => i !== industry))}
                          >
                            {industry}
                            <span className="ml-1">×</span>
                          </Badge>
                        ))}
                        {((!Array.isArray(product.industries) || product.industries.length === 0) && selectedIndustries.length === 0) && (
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              if (!selectedIndustries.includes(value)) {
                                setSelectedIndustries([...selectedIndustries, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-[120px] focus:ring-0" hideIndicator>
                              <SelectValue placeholder="Add industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="saas">SaaS</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div className="space-y-2">
                  <Label htmlFor="platform">Platforms</Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(product.platform) && product.platform.map((platform: string) => (
                          <Badge key={platform} variant="secondary" className="px-2 py-1">
                            {platform}
                          </Badge>
                        ))}
                        {selectedPlatforms.map((platform) => (
                          <Badge
                            key={platform}
                            variant="secondary"
                            className="px-2 py-1 hover:bg-destructive/20 cursor-pointer"
                            onClick={() => setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))}
                          >
                            {platform}
                            <span className="ml-1">×</span>
                          </Badge>
                        ))}
                        {((!Array.isArray(product.platform) || product.platform.length === 0) && selectedPlatforms.length === 0) && (
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              if (!selectedPlatforms.includes(value)) {
                                setSelectedPlatforms([...selectedPlatforms, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-[120px] focus:ring-0" hideIndicator>
                              <SelectValue placeholder="Add platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="shopify">Shopify</SelectItem>
                              <SelectItem value="wordpress">WordPress</SelectItem>
                              <SelectItem value="wix">Wix</SelectItem>
                              <SelectItem value="webflow">Webflow</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Use Cases */}
                <div className="space-y-2">
                  <Label htmlFor="useCase">Use Cases</Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(product.use_case) && product.use_case.map((useCase: string) => (
                          <Badge key={useCase} variant="secondary" className="px-2 py-1">
                            {useCase}
                          </Badge>
                        ))}
                        {selectedUseCases.map((useCase) => (
                          <Badge
                            key={useCase}
                            variant="secondary"
                            className="px-2 py-1 hover:bg-destructive/20 cursor-pointer"
                            onClick={() => setSelectedUseCases(selectedUseCases.filter(u => u !== useCase))}
                          >
                            {useCase}
                            <span className="ml-1">×</span>
                          </Badge>
                        ))}
                        {((!Array.isArray(product.use_case) || product.use_case.length === 0) && selectedUseCases.length === 0) && (
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              if (!selectedUseCases.includes(value)) {
                                setSelectedUseCases([...selectedUseCases, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-[120px] focus:ring-0" hideIndicator>
                              <SelectValue placeholder="Add use case" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="automation">Automation</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="analytics">Analytics</SelectItem>
                              <SelectItem value="crm">CRM</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo & Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demo & Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full">
                      <Play className="h-5 w-5 text-[#9b87f5]" />
                    </div>
                    <div>
                      <div className="font-medium">Watch Demo</div>
                      <div className="text-sm text-[#8E9196]">See the template in action</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8E9196] hover:text-[#1A1F2C]"
                    onClick={() => product.demo && window.open(product.demo, '_blank')}
                    disabled={!product.demo}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
