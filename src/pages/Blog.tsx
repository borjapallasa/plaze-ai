import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";

export default function Blog() {
  const blogPosts = [
    {
      title: "Integrations",
      image: "/lovable-uploads/385ba41d-cf26-4fe6-a604-0a7dd0f79b94.png",
      description: "Integrate NoCodeClick with tools like your CRM system, calendar, and email.",
      link: "/integrations"
    },
    {
      title: "NoCodeClick Support",
      image: "/lovable-uploads/385ba41d-cf26-4fe6-a604-0a7dd0f79b94.png",
      description: "Set up an AI-powered omnichannel contact center in minutes.",
      link: "/support"
    },
    {
      title: "NoCodeClick University",
      image: "/lovable-uploads/385ba41d-cf26-4fe6-a604-0a7dd0f79b94.png",
      description: "Become a NoCodeClick expert at your own pace.",
      link: "/university"
    }
  ];

  return (
    <div className="pt-16">
      <MainHeader />
      <div className="container mx-auto px-4 py-12 max-w-[1200px]">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Do more with NoCodeClick
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card 
              key={index} 
              className="group relative flex flex-col overflow-hidden bg-transparent border border-border/50 hover:bg-accent transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 p-6 pb-16">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-muted-foreground">{post.description}</p>
              </div>
              <Link to={post.link}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-4 right-4 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
