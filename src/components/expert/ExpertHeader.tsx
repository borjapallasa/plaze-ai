
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Save, MapPin, Calendar } from "lucide-react";
import type { ExpertComponentProps } from "./types";
import { lazy, Suspense } from "react";

// Lazy load secondary content
const SecondaryContent = lazy(() => import("./header/SecondaryContent"));

export const ExpertHeader = ({ expert }: ExpertComponentProps) => {
  // Use the expert's thumbnail if available, otherwise fallback to placeholder
  const avatarSrc = expert.thumbnail || 
    `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`;

  return (
    <Card className="mt-8 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Priority content - will be rendered immediately */}
          <div className="flex sm:hidden gap-4 items-start w-full">
            <div className="h-16 w-16 bg-muted rounded-full" /> {/* Avatar placeholder */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold" style={{ contentVisibility: 'auto' }}>
                  {expert.title || "Expert in UX Design"}
                </h1>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex gap-4 items-start">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 bg-muted rounded-full" /> {/* Avatar placeholder */}
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={avatarSrc}
                  loading="lazy"
                  decoding="async"
                />
                <AvatarFallback>{expert.name?.[0] || 'E'}</AvatarFallback>
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

              {/* Main content that needs to be visible immediately */}
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

          {/* Secondary content - will be lazy loaded */}
          <Suspense fallback={null}>
            <SecondaryContent expert={expert} />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
};
