import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, Music, Users, Banknote, Zap, Monitor, Heart, Dumbbell, BookOpen, Heart as HeartIcon, ArrowRight, Menu, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Typewriter from 'typewriter-effect';
import { Link } from "react-router-dom";

export default function Communities() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchCategory, setSearchCategory] = useState("Communities");

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 10);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-200 ease-out bg-background/95 ${
        isScrolled ? 'bg-background' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="hidden sm:flex relative py-6">
            <div className="w-full flex flex-col items-center">
              <div className={`transition-all duration-300 ease-out ${
                isScrolled ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-[42px] mb-8'
              }`}>
                <div className="text-[2rem] leading-relaxed font-bold whitespace-nowrap flex items-center justify-center">
                  <span className="text-foreground">Join Communities</span>
                  <span className="text-muted-foreground ml-2">
                    <Typewriter
                      options={{
                        strings: ["To Grow", "To Learn", "To Share", "To Connect"],
                        autoStart: true,
                        loop: true,
                        delay: 50,
                        deleteSpeed: 30,
                      }}
                    />
                  </span>
                </div>
              </div>

              <div className={`w-full max-w-3xl transition-transform duration-300 ease-in-out ${
                isScrolled ? 'transform -translate-y-2' : ''
              }`}>
                <div className="flex items-center gap-2 px-4 py-3 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
                  <div className="flex items-center gap-2 flex-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 hover:bg-transparent"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px]">
                        <DropdownMenuItem onClick={() => setSearchCategory("Products")}>
                          Products
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchCategory("Experts")}>
                          Experts
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchCategory("Communities")}>
                          Communities
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchCategory("Jobs")}>
                          Jobs
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-9 text-base"
                      placeholder="Search communities..."
                      type="search"
                    />
                  </div>
                  <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-9 w-9">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile header content */}
          <div className="sm:hidden flex items-center justify-between py-4">
            <div className="text-lg font-semibold">Communities</div>
            <Button variant="outline" className="rounded-full px-2.5 py-1.5 h-8 border-2 hover:border-primary/20 transition-colors">
              <Menu className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border" />
      </header>
      {/* Main content */}
      <div className="container mx-auto px-4 mt-[120px] sm:mt-[140px] pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Example Community Card */}
          <Card className="bg-background shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Community Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Web Developers United</h3>
                  <p className="text-xs text-muted-foreground">12,543 Members</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">Technology</Badge>
              </div>
              <p className="text-sm mt-3 text-muted-foreground">
                A community for web developers to share knowledge, resources, and connect with each other.
              </p>
              <Button className="w-full mt-4 justify-center">
                Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Example Community Card */}
          <Card className="bg-background shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Community Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Fitness Fanatics</h3>
                  <p className="text-xs text-muted-foreground">8,902 Members</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">Health & Fitness</Badge>
              </div>
              <p className="text-sm mt-3 text-muted-foreground">
                A group for fitness enthusiasts to share workout routines, nutrition tips, and support each other's goals.
              </p>
              <Button className="w-full mt-4 justify-center">
                Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Example Community Card */}
          <Card className="bg-background shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Community Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Bookworms Corner</h3>
                  <p className="text-xs text-muted-foreground">5,231 Members</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">Books</Badge>
              </div>
              <p className="text-sm mt-3 text-muted-foreground">
                A community for book lovers to discuss their favorite reads, discover new authors, and connect with fellow bookworms.
              </p>
              <Button className="w-full mt-4 justify-center">
                Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Example Community Card */}
          <Card className="bg-background shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Community Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Music Mania</h3>
                  <p className="text-xs text-muted-foreground">9,876 Members</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">Music</Badge>
              </div>
              <p className="text-sm mt-3 text-muted-foreground">
                A community for music lovers to share their favorite songs, discover new artists, and connect with fellow audiophiles.
              </p>
              <Button className="w-full mt-4 justify-center">
                Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Example Community Card */}
          <Card className="bg-background shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Community Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Photography Club</h3>
                  <p className="text-xs text-muted-foreground">6,321 Members</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">Photography</Badge>
              </div>
              <p className="text-sm mt-3 text-muted-foreground">
                A community for photographers to share their best shots, learn new techniques, and connect with fellow shutterbugs.
              </p>
              <Button className="w-full mt-4 justify-center">
                Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Example Community Card */}
          <Card className="bg-background shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Community Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Travel Addicts</h3>
                  <p className="text-xs text-muted-foreground">11,789 Members</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">Travel</Badge>
              </div>
              <p className="text-sm mt-3 text-muted-foreground">
                A community for travel enthusiasts to share their adventures, exchange travel tips, and connect with fellow globetrotters.
              </p>
              <Button className="w-full mt-4 justify-center">
                Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
