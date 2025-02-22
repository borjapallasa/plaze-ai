
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AccountSettings() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 512 * 1024) { // 512KB limit
        toast({
          title: "File too large",
          description: "Please select an image under 512KB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <MainHeader />
      </div>

      <div className="container mx-auto px-4 pt-[126px] pb-8 max-w-3xl">
        <Card className="border-none bg-card/50">
          <CardContent className="p-6 space-y-8">
            {/* Profile Photo Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Profile photo</h2>
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  {selectedFile ? (
                    <AvatarImage src={selectedFile} alt="Profile" />
                  ) : (
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    You can upload images up to 512KB
                  </div>
                  <div className="relative">
                    <Input
                      type="file"
                      id="photo"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Label
                      htmlFor="photo"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer text-sm"
                    >
                      <Upload className="h-4 w-4" />
                      Upload a photo
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info Section */}
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-base">First name:</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-base">Last Name:</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email:</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  className="bg-background/50"
                />
              </div>

              {/* Notifications Settings */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Notifications Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="projectNotifications" />
                    <Label htmlFor="projectNotifications">Project notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="comments" />
                    <Label htmlFor="comments">Comments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marketingEmails" />
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
