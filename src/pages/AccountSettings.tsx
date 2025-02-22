
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Upload, User, BellRing, Key } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AccountSettings() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 512 * 1024) {
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

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-[126px] pb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="space-y-6">
            {/* Profile Section */}
            <Card className="border-none shadow-md bg-card/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24 rounded-xl">
                      {selectedFile ? (
                        <AvatarImage src={selectedFile} alt="Profile" />
                      ) : (
                        <AvatarFallback className="bg-primary/10">
                          <User className="h-12 w-12 text-primary" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex-grow space-y-2">
                    <h2 className="text-xl font-semibold">Profile Photo</h2>
                    <p className="text-sm text-muted-foreground">
                      Upload a photo to personalize your account
                    </p>
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer text-sm transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Photo
                      </Label>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Max size: 512KB
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="bg-background/50"
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    Save Profile Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card className="border-none shadow-md bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BellRing className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Checkbox id="projectNotifications" />
                    <div className="space-y-1">
                      <Label htmlFor="projectNotifications" className="text-base font-medium">
                        Project Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your project activities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Checkbox id="comments" />
                    <div className="space-y-1">
                      <Label htmlFor="comments" className="text-base font-medium">
                        Comments
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone comments on your content
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Checkbox id="marketingEmails" />
                    <div className="space-y-1">
                      <Label htmlFor="marketingEmails" className="text-base font-medium">
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card className="border-none shadow-md bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Key className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full md:w-auto">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
