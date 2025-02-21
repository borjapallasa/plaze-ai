
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Save, MapPin, Calendar } from "lucide-react";

export const ExpertHeader = () => {
  return (
    <Card className="mt-8 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex sm:hidden gap-4 items-start w-full">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">Expert in UX Design</h1>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex gap-4 items-start">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold">Expert in UX Design</h1>
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
                <p className="text-xl text-muted-foreground">John Doe</p>
                <div className="text-muted-foreground">•</div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-base text-muted-foreground">San Francisco, CA</span>
                </div>
                <div className="text-muted-foreground">•</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-base text-muted-foreground">Expert since 2020</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:hidden items-start gap-2.5">
            <div className="flex items-center gap-2.5">
              <p className="text-lg text-muted-foreground">John Doe</p>
              <div className="text-muted-foreground">•</div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-base text-muted-foreground">San Francisco, CA</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-base text-muted-foreground">Expert since 2020</span>
              </div>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Save className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
