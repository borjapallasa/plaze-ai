
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export const ExpertCommunity = () => {
  return (
    <div className="col-span-4 col-start-2">
      <h2 className="text-2xl font-bold mb-6">Community</h2>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-6">
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

            {/* Title and badges */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">UX Design Community</h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Public Community</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                <Badge variant="secondary" className="text-xs px-2 py-0.5">Free Access</Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              Join our vibrant community of UX designers where we share insights, 
              collaborate on projects, and help each other grow. Get access to exclusive 
              resources, participate in discussions, and connect with fellow designers 
              from around the world.
            </p>

            {/* Stats */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Community Size</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-xs text-muted-foreground mt-1.5">Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground mt-1.5">Classrooms</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-2xl font-bold">456</p>
                    <p className="text-xs text-muted-foreground mt-1.5">Posts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-xs text-muted-foreground mt-1.5">Products</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Button className="w-full">
                Join Community
              </Button>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
