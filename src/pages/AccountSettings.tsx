
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Upload, User, BellRing, Key, Eye, EyeOff, X, Check } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AccountSettings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile state
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    projectNotifications: false,
    comments: false,
    marketingEmails: false,
  });

  // Password state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // File validation
  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 512 * 1024; // 512KB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG or PNG image.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image under 512KB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setHasProfileChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  // Remove photo
  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setHasProfileChanges(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Profile form handlers
  const handleProfileInputChange = (field: string, value: string) => {
    setHasProfileChanges(true);
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
    }
  };

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Profile update handler
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsProfileSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProfileSaving(false);
      setHasProfileChanges(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1000);
  };

  // Notification handlers
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectAllNotifications = () => {
    const allSelected = Object.values(notifications).every(Boolean);
    const newValue = !allSelected;
    setNotifications({
      projectNotifications: newValue,
      comments: newValue,
      marketingEmails: newValue,
    });
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(passwords.new);
  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 25) return "bg-red-500";
    if (strength < 50) return "bg-orange-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  // Password validation
  const isPasswordFormValid = () => {
    return (
      passwords.current.length > 0 &&
      passwords.new.length >= 8 &&
      passwords.new === passwords.confirm &&
      passwords.new !== passwords.current
    );
  };

  // Password update handler
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isPasswordFormValid()) {
      toast({
        title: "Password validation failed",
        description: "Please check all password requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPasswordSaving(false);
      setPasswords({ current: "", new: "", confirm: "" });
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-[126px] pb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="space-y-8">
            {/* Profile Section */}
            <Card className="border border-border/20 shadow-sm bg-card">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
                  <div className="flex-shrink-0">
                    <div
                      className={`relative group ${isDragOver ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Avatar className="h-32 w-32 rounded-xl border-2 border-dashed border-border transition-all group-hover:border-primary/50">
                        {selectedFile ? (
                          <AvatarImage src={selectedFile} alt="Profile" className="object-cover" />
                        ) : (
                          <AvatarFallback className="bg-muted">
                            <User className="h-16 w-16 text-muted-foreground" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {selectedFile && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={handleRemovePhoto}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Profile Photo</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a photo to personalize your account. Drag and drop or click to browse.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Input
                          ref={fileInputRef}
                          type="file"
                          id="photo"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleFileChange}
                        />
                        <Label
                          htmlFor="photo"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer text-sm transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </Label>
                        <span className="text-xs text-muted-foreground self-center">
                          JPG, PNG • Max 512KB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mb-8" />

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Full Name</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => handleProfileInputChange('email', e.target.value)}
                      placeholder="Your email"
                      className={`bg-background/50 ${email && !isValidEmail(email) ? 'border-destructive' : ''}`}
                    />
                    {email && !isValidEmail(email) && (
                      <p className="text-sm text-destructive">Please enter a valid email address</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={!hasProfileChanges || isProfileSaving || (email && !isValidEmail(email))}
                    className="w-full md:w-auto"
                  >
                    {isProfileSaving ? "Saving..." : "Save Profile Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card className="border border-border/20 shadow-sm bg-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <BellRing className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <span className="text-sm font-medium">Notification Controls</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSelectAllNotifications}
                    >
                      {Object.values(notifications).every(Boolean) ? "Deselect All" : "Select All"}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <Label className="text-base font-medium">
                          Project Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your project activities
                        </p>
                      </div>
                      <Switch
                        checked={notifications.projectNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('projectNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <Label className="text-base font-medium">
                          Comments
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone comments on your content
                        </p>
                      </div>
                      <Switch
                        checked={notifications.comments}
                        onCheckedChange={(checked) => handleNotificationChange('comments', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <Label className="text-base font-medium">
                          Marketing Emails
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and promotions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card className="border border-border/20 shadow-sm bg-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Key className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwords.current}
                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        placeholder="Enter your current password"
                        className="bg-background/50 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                        placeholder="Enter your new password"
                        className="bg-background/50 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwords.new && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={passwordStrength} 
                            className={`flex-1 h-2 ${getPasswordStrengthColor(passwordStrength)}`}
                          />
                          <span className="text-xs font-medium min-w-[50px]">
                            {getPasswordStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            {passwords.new.length >= 8 ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                            <span>At least 8 characters</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/[A-Z]/.test(passwords.new) ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                            <span>Contains uppercase letter</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/[0-9]/.test(passwords.new) ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                            <span>Contains number</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/[^A-Za-z0-9]/.test(passwords.new) ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                            <span>Contains special character</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                        placeholder="Confirm your new password"
                        className={`bg-background/50 pr-12 ${
                          passwords.confirm && passwords.new !== passwords.confirm ? 'border-destructive' : ''
                        }`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwords.confirm && passwords.new !== passwords.confirm && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    variant="secondary" 
                    disabled={!isPasswordFormValid() || isPasswordSaving}
                    className="w-full md:w-auto"
                  >
                    {isPasswordSaving ? "Updating..." : "Update Password"}
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
