
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AccountSettings() {
  const { toast } = useToast();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Password Changed",
      description: "Your password has been successfully changed.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <MainHeader />
      </div>

      <div className="container mx-auto px-4 pt-[54px] pb-8 max-w-2xl">
        <div className="space-y-8">
          {/* Update Profile Section */}
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Update Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName" className="text-base font-medium">Name *</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Enter your first name" 
                      required 
                      className="h-11 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName" className="text-base font-medium">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Enter your last name" 
                      required 
                      className="h-11 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-base font-medium">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      required 
                      className="h-11 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="photo" className="text-base font-medium">Your Account Photo *</Label>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                        <Input
                          id="photo"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <Label htmlFor="photo" className="cursor-pointer text-center space-y-3">
                          <Upload className="mx-auto h-10 w-10 text-primary/60" />
                          <div className="text-sm text-muted-foreground">
                            Drop your image here or{" "}
                            <span className="text-primary font-medium">browse</span>
                          </div>
                        </Label>
                      </div>
                      {selectedFile && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 px-4 py-2 rounded-lg">
                          <span className="truncate flex-1">Selected file</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFile(null)}
                            className="hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Section */}
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="oldPassword" className="text-base font-medium">Old password</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Enter your old password"
                        className="h-11 bg-white dark:bg-gray-800 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="newPassword" className="text-base font-medium">New password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="h-11 bg-white dark:bg-gray-800 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
