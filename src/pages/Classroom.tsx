
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Classroom() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px] space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">How To Create Automated SEO Blogs With AI?</h1>
        
        {/* Video Section */}
        <Card className="overflow-hidden">
          <div className="aspect-video bg-muted relative">
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
        </Card>

        {/* Resources Link */}
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

        {/* Introduction */}
        <Card>
          <CardContent className="p-6 space-y-6">
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
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline">Edit Classroom Details</Button>
          <Button>Add New Lesson</Button>
        </div>
      </div>
    </div>
  );
}
