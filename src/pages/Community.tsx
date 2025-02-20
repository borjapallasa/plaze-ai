import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, BookOpen, Calendar, Link, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Community() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px] space-y-8">
      {/* Main Content Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Video and Description */}
          <div className="lg:col-span-8 space-y-6">
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
          </div>

          {/* Right Column - Community Info */}
          <div className="lg:col-span-4 space-y-6">
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
                
                <div className="flex items-center gap-2 truncate">
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
      </Card>

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

        <div className="flex gap-4">
          <Button>Create New Thread</Button>
          <Input placeholder="Search thread" className="flex-1" />
          <Button variant="outline">Search by topic</Button>
        </div>

        <TabsContent value="threads" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>BP</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Letter from Borja</h3>
                        <Badge variant="secondary" className="text-xs">Messages: 1</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created by Borja P
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      8
                    </Badge>
                  </div>
                  
                  <p>👋 Welcome to Optimal Path Automations! 👋</p>
                  <p className="text-muted-foreground">
                    Hey everyone! I'm Borja, and I'm thrilled to welcome you to our community. Creating this space is a dream come true for me because I am passionate about helping others discover the power of no-code automation...
                  </p>
                  
                  <div className="text-sm text-muted-foreground">
                    Last Message: 10/24/2024, 8:31 PM
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
