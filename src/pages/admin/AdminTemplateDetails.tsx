
import { ArrowLeft, FileText, Link as LinkIcon, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionFiles } from "./components/TransactionFiles";
import { Separator } from "@/components/ui/separator";

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
  guideUrl: "https://docs.google.com/document/d/1HVn0nBopn4m4-Rj74V77lb8SgCRbPr-xnCF2yuW-rak/edit?usp=sharing"
};

export default function AdminTemplateDetails() {
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
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
