
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Save, MapPin } from "lucide-react";
import type { ExpertComponentProps } from "./types";
import { lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load secondary content
const SecondaryContent = lazy(() => import("./header/SecondaryContent"));

export const ExpertHeader = ({ expert }: ExpertComponentProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Card className="mt-8 mb-6">
        <CardContent className="p-6">
          <h1 
            className="text-2xl font-bold"
            style={{ 
              contentVisibility: 'auto',
              containIntrinsicSize: '0 32px'
            }}
          >
            {expert.title || "Expert in UX Design"}
          </h1>
          
          <div className="mt-4 flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <span className="text-base font-medium">
                {expert.name?.split(' ').map(n => n[0]).join('') || 'EX'}
              </span>
            </div>
            
            <div className="min-w-0 flex-1">
              <p className="text-base text-muted-foreground truncate">
                {expert.name || "John Doe"}
              </p>
            </div>
          </div>

          <Suspense fallback={null}>
            <SecondaryContent expert={expert} />
          </Suspense>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 mb-6">
      <CardContent className="p-6">
        <div className="flex gap-4 items-start">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 bg-muted rounded-full" />
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                loading="lazy"
                decoding="async"
              />
              <AvatarFallback>
                {expert.name?.split(' ').map(n => n[0]).join('') || 'EX'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h1 
                className="text-3xl font-bold"
                style={{ contentVisibility: 'auto' }}
              >
                {expert.title || "Expert in UX Design"}
              </h1>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Save className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 mt-2">
              <p className="text-xl text-muted-foreground">{expert.name || "John Doe"}</p>
              <div className="text-muted-foreground">•</div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-base text-muted-foreground">
                  {expert.location || "San Francisco, CA"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
