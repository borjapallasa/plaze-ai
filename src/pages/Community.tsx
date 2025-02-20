import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, BookOpen, Calendar, Link, ThumbsUp, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";

export default function Community() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const templates = [
    {
      title: "Automated Email Workflow",
      price: "$49.99",
      image: "/placeholder.svg",
      seller: "Automation Pro",
      description: "Streamline your email marketing with this automated workflow template.",
      tags: ["email", "automation"],
      category: "marketing"
    },
    {
      title: "CRM Integration Template",
      price: "$79.99",
      image: "/placeholder.svg",
      seller: "CRM Expert",
      description: "Connect your favorite CRM with other tools seamlessly.",
      tags: ["crm", "integration"],
      category: "business"
    },
    {
      title: "Social Media Manager",
      price: "$39.99",
      image: "/placeholder.svg",
      seller: "Social Pro",
      description: "Manage all your social media accounts from one place.",
      tags: ["social", "management"],
      category: "marketing"
    },
    {
      title: "Project Tracker",
      price: "$59.99",
      image: "/placeholder.svg",
      seller: "PM Tools",
      description: "Keep track of your projects with this comprehensive template.",
      tags: ["project", "management"],
      category: "business"
    },
    {
      title: "Lead Generation System",
      price: "$89.99",
      image: "/placeholder.svg",
      seller: "Lead Gen Pro",
      description: "Generate and nurture leads automatically.",
      tags: ["leads", "automation"],
      category: "sales"
    },
    {
      title: "Customer Support Flow",
      price: "$69.99",
      image: "/placeholder.svg",
      seller: "Support Expert",
      description: "Streamline your customer support process.",
      tags: ["support", "workflow"],
      category: "service"
    }
  ];

  const events = [
    {
      title: "Community Meetup",
      date: new Date(2024, 3, 15), // April 15, 2024
      type: "meetup",
      description: "Monthly community gathering to discuss automation trends"
    },
    {
      title: "Workshop: No-Code Automation",
      date: new Date(2024, 3, 20), // April 20, 2024
      type: "workshop",
      description: "Learn how to build powerful automation without coding"
    },
    {
      title: "Q&A Session",
      date: new Date(2024, 3, 25), // April 25, 2024
      type: "qa",
      description: "Open Q&A session with automation experts"
    }
  ];

  const selectedDateEvents = events.filter(
    event => date && event.date.toDateString() === date.toDateString()
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px] space-y-8">
      {/* Main Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Video and Description */}
        <div className="lg:col-span-8">
          <Card className="p-6 space-y-6">
            {/* Video Section */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              <img 
                src="/lovable-uploads/890bbce9-6ca6-4a0e-958a-d7ba6f61bf73.png"
                alt="Community thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                  <div className="w-6 h-6 border-8 border-transparent border-l-primary ml-1" style={{ transform: 'rotate(-45deg)' }} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Imagine a spot where we all get together to chat about making our businesses run smoother with some automation magic and no-code shortcuts. Here's what you'll get by joining:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span><strong>Win Back Your Weekdays</strong> - Spend time on what truly grows your business.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span><strong>Elevate Your Team's Game</strong> - Simple tools, incredible results.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span><strong>Economize Effortlessly</strong> - Invest in growth, not unnecessary expenses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span><strong>Future-Proof Your Business</strong> - Adapt and thrive in the digital age.</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Right Column - Community Info */}
        <div className="lg:col-span-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>BP</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">This community is host by</p>
                  <p className="font-semibold">Borja P.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">Optimal Path Automations has 198 members!</span>
              </div>

              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Link className="w-4 h-4" />
                  <span className="font-medium">YouTube:</span> @BorjaPalleja
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Link className="w-4 h-4" />
                  <span className="font-medium">TikTok:</span> @borjapalleja
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Link className="w-4 h-4" />
                  <span className="font-medium">Calendly:</span> Book a call
                </a>
              </div>

              <Button className="w-full">Manage Community</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="threads" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="threads" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              See Threads
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              See Classrooms
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              All Templates
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="threads" className="space-y-6">
          <div className="flex gap-4">
            <Button>Create New Thread</Button>
            <Input placeholder="Search thread" className="flex-1" />
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>BP</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">Letter from Borja</h3>
                  <div className="text-sm text-muted-foreground">
                    Created by Borja P
                  </div>
                  <Badge variant="secondary" className="text-xs w-fit">Messages: 1</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <p>👋 Welcome to Optimal Path Automations! 👋</p>
                <p className="text-muted-foreground">
                  Hey everyone! I'm Borja, and I'm thrilled to welcome you to our community. Creating this space is a dream come true for me because I am passionate about helping others discover the power of no-code automation...
                </p>
                
                <div className="flex justify-between items-end">
                  <div className="text-sm text-muted-foreground">
                    Last Message: 10/24/2024, 8:31 PM
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <ThumbsUp className="w-3 h-3" />
                    8
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search templates" className="pl-9" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <ProductCard
                key={index}
                title={template.title}
                price={template.price}
                image={template.image}
                seller={template.seller}
                description={template.description}
                tags={template.tags}
                category={template.category}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <Card>
                <CardContent className="p-6">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {date ? date.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Select a date'}
                  </h3>
                  <div className="space-y-4">
                    {selectedDateEvents.length > 0 ? (
                      selectedDateEvents.map((event, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 py-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            {event.type}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No events scheduled for this day</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
