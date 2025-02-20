
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Users, GraduationCap, MessageSquare, Package2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const ExpertCommunity = () => {
  return (
    <div className="col-span-4 col-start-2">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">UX Design Community</h2>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Public Community</span>
        </div>
        <Badge variant="secondary" className="text-xs px-2 py-0.5">Free Access</Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Video and Description */}
            <div className="col-span-7 space-y-6">
              {/* Video thumbnail */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5"
                  alt="Community thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-4 h-4 border-8 border-transparent border-l-primary ml-1" style={{ transform: 'rotate(-45deg)' }} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-base leading-relaxed text-muted-foreground">
                Join our vibrant community of UX designers where we share insights, 
                collaborate on projects, and help each other grow. Get access to exclusive 
                resources, participate in discussions, and connect with fellow designers 
                from around the world.
              </p>
            </div>

            {/* Right Column - Stats and CTAs */}
            <div className="col-span-5 space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Members</span>
                  </div>
                  <p className="text-3xl font-bold">1,234</p>
                </Card>
                <Card className="p-4 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Classrooms</span>
                  </div>
                  <p className="text-3xl font-bold">12</p>
                </Card>
                <Card className="p-4 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Posts</span>
                  </div>
                  <p className="text-3xl font-bold">456</p>
                </Card>
                <Card className="p-4 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Package2 className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Products</span>
                  </div>
                  <p className="text-3xl font-bold">89</p>
                </Card>
              </div>

              <Separator />

              {/* CTAs */}
              <div className="space-y-3">
                <Button size="lg" className="w-full text-base font-semibold py-6">
                  Join Community
                </Button>
                <Button variant="outline" size="lg" className="w-full text-base">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
