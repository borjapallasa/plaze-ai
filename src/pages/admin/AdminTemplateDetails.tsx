import { ArrowLeft, FileText, Link as LinkIcon, Play, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
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

interface Template {
  title: string;
  description: string;
  image: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
  filesUrl: string;
  demoUrl: string;
  guideUrl: string;
  setupGuide?: string;
  financialMetrics: {
    timesSold: number;
    totalRevenue: number;
    averagePrice: number;
    conversionRate: number;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    items: {
      id: string;
      author: string;
      rating: number;
      date: string;
      content: string;
    }[];
  };
}

const mockTemplate: Template = {
  title: "Automated SEO Article Writer to Shopify And WordPress With Airtable Interface",
  description: "The Automated SEO Article Writer to Shopify and WordPress with Airtable Interface is a no code template designed to simplify content creation. Users can enter an idea or content into the Airtable Interface and swiftly generate an article with just a click using Make Automation. This generated article can be further polished through manual edits or automated adjustments utilizing the Make Automation feature.\n\nWith a seamless integration, users can directly publish the finalized content to their Shopify platform. Furthermore, the template offers the option to recreate an existing article. Leveraging Airtable, Make, and OpenAI, this solution provides an efficient way to create, edit, and publish SEO-optimized articles hassle-free.",
  image: "/lovable-uploads/cafa2af6-1bec-4be0-a7c6-9d2ed24347a7.png",
  category: "Automation",
  uploadedBy: "info@optimalpath.ai",
  createdAt: "3/22/2024, 7:15 PM",
  filesUrl: "https://drive.google.com/drive/folders/1aZiM-7_-lWNZqSZC7Ze8I9nJLQQF1j48?usp=sharing",
  demoUrl: "https://www.youtube.com/watch?v=2dVf_bUffFso&t=159s",
  guideUrl: "https://docs.google.com/document/d/1HVn0nBopn4m4-Rj74V77lb8SgCRbPr-xnCF2yuW-rak/edit?usp=sharing",
  financialMetrics: {
    timesSold: 35,
    totalRevenue: 1200,
    averagePrice: 39,
    conversionRate: 8.5
  },
  reviews: {
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
  }
};

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
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

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
          <h1 className="text-2xl font-semibold text-[#1A1F2C]">{mockTemplate.title}</h1>
          <p className="text-[#8E9196]">Review and manage template details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Image */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-blue-600">
                  <img
                    src={mockTemplate.image}
                    alt={mockTemplate.title}
                    className="w-full h-full object-cover"
                  />
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
                    <p className="text-xl font-semibold">{mockTemplate.financialMetrics.timesSold}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-[#8E9196]">Total Revenue</p>
                    <p className="text-xl font-semibold text-green-600">
                      ${mockTemplate.financialMetrics.totalRevenue}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-[#8E9196]">Average Price</p>
                    <p className="text-xl font-semibold">
                      ${mockTemplate.financialMetrics.averagePrice}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-[#8E9196]">Conversion Rate</p>
                    <p className="text-xl font-semibold">
                      {mockTemplate.financialMetrics.conversionRate}%
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
                {mockTemplate.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-[#1A1F2C] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Customer Reviews ({mockTemplate.reviews.totalReviews})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Rating */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center px-6 border-r border-gray-200">
                    <p className="text-3xl font-bold text-[#1A1F2C]">
                      {mockTemplate.reviews.averageRating}
                    </p>
                    <StarRating rating={mockTemplate.reviews.averageRating} />
                    <p className="text-sm text-[#8E9196] mt-1">
                      {mockTemplate.reviews.totalReviews} reviews
                    </p>
                  </div>
                  <div className="flex-1">
                    {/* Add rating distribution here if needed */}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {mockTemplate.reviews.items.map((review) => (
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
                      {review.id !== mockTemplate.reviews.items[mockTemplate.reviews.items.length - 1].id && (
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
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* Primary Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-[#8E9196]">Uploaded by</p>
                  <p className="text-sm font-medium">{mockTemplate.uploadedBy}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-[#8E9196]">Category</p>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
                    {mockTemplate.category}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-[#8E9196]">Created @</p>
                  <p className="text-sm font-medium">{mockTemplate.createdAt}</p>
                </div>

                <Separator />

                <TransactionFiles
                  filesUrl={mockTemplate.filesUrl}
                  guidesUrl={mockTemplate.guideUrl}
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
                <div className="space-y-2">
                  <Label htmlFor="team">Teams</Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
                      <div className="flex flex-wrap gap-1">
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
                        {selectedTeams.length === 0 && (
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
                        {selectedTeams.length > 0 && (
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              if (!selectedTeams.includes(value)) {
                                setSelectedTeams([...selectedTeams, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-6 focus:ring-0" hideIndicator>
                              <span className="text-muted-foreground">+</span>
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

                <div className="space-y-2">
                  <Label htmlFor="industries">Industries</Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
                      <div className="flex flex-wrap gap-1">
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
                        {selectedIndustries.length === 0 && (
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
                        {selectedIndustries.length > 0 && (
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              if (!selectedIndustries.includes(value)) {
                                setSelectedIndustries([...selectedIndustries, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-6 focus:ring-0" hideIndicator>
                              <span className="text-muted-foreground">+</span>
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

                <div className="space-y-2">
                  <Label htmlFor="platform">Platforms</Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
                      <div className="flex flex-wrap gap-1">
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
                        {selectedPlatforms.length === 0 && (
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
                        {selectedPlatforms.length > 0 && (
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              if (!selectedPlatforms.includes(value)) {
                                setSelectedPlatforms([...selectedPlatforms, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-6 focus:ring-0" hideIndicator>
                              <span className="text-muted-foreground">+</span>
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

                <div className="space-y-2">
                  <Label htmlFor="useCase">Use Cases</Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
                      <div className="flex flex-wrap gap-1">
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
                        {selectedUseCases.length === 0 && (
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
                        {selectedUseCases.length > 0 && (
                          <Select
                            defaultValue=""
                            onValueChange={(value) => {
                              if (!selectedUseCases.includes(value)) {
                                setSelectedUseCases([...selectedUseCases, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-6 focus:ring-0" hideIndicator>
                              <span className="text-muted-foreground">+</span>
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
                    onClick={() => window.open(mockTemplate.demoUrl, '_blank')}
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
