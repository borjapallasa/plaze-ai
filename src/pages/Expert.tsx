import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users, Info, Calendar, MapPin, Share2, Save, Check, Handshake, DollarSign } from "lucide-react";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";

export default function Expert() {
  const moreProducts = [
    {
      title: "Advanced UX Research Methods",
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      seller: "John Doe",
      description: "Learn professional UX research techniques and methodologies.",
      tags: ["research", "ux"],
      category: "design"
    },
    {
      title: "UI Animation Masterclass",
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      seller: "John Doe",
      description: "Create engaging interface animations and micro-interactions.",
      tags: ["animation", "ui"],
      category: "design"
    },
    {
      title: "Design Systems Workshop",
      price: "$129.99",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      seller: "John Doe",
      description: "Build and maintain scalable design systems for large applications.",
      tags: ["systems", "workflow"],
      category: "design"
    },
    {
      title: "Figma Advanced Techniques",
      price: "$69.99",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      seller: "John Doe",
      description: "Master advanced Figma features and workflows for professional design.",
      tags: ["figma", "tools"],
      category: "design"
    },
    {
      title: "Design Thinking Workshop",
      price: "$149.99",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
      seller: "John Doe",
      description: "Learn the fundamentals of design thinking and problem-solving methodologies.",
      tags: ["thinking", "workshop"],
      category: "design"
    },
    {
      title: "Mobile UX Patterns",
      price: "$99.99",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
      seller: "John Doe",
      description: "Master essential mobile UX patterns and best practices for app design.",
      tags: ["mobile", "patterns"],
      category: "design"
    },
    {
      title: "Accessibility in Design",
      price: "$119.99",
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f",
      seller: "John Doe",
      description: "Create inclusive designs that work for everyone with accessibility best practices.",
      tags: ["a11y", "inclusive"],
      category: "design"
    },
    {
      title: "Data Visualization Design",
      price: "$139.99",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      seller: "John Doe",
      description: "Learn to create effective and beautiful data visualizations for complex information.",
      tags: ["data", "viz"],
      category: "design"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header with Stats - Full Width */}
      <div className="container mx-auto px-4">
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Mobile: thumbnail and headline row */}
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

              {/* Desktop: thumbnail and headline */}
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

              {/* Mobile: expert information */}
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
      </div>

      <div className="container mx-auto px-4">
        {/* Info and Description Grid */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {/* Info Section */}
          <Card className="col-span-1">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Info</h2>
              </div>
              <p className="text-muted-foreground">
                Expert in UI/UX design with over 10 years of experience. Specialized in creating
                intuitive and beautiful user interfaces for web and mobile applications.
              </p>
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card className="col-span-4">
            <CardContent className="p-6 space-y-6">
              <p className="text-muted-foreground">
                Senior UX Designer with a passion for creating intuitive and engaging digital experiences. 
                Combining analytical thinking with creative design to solve complex user problems.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2 leading-normal">
                  <span className="flex-shrink-0">🎨</span>
                  <span>User Interface Design - Creating beautiful and functional interfaces that delight users</span>
                </li>
                <li className="flex items-center gap-2 leading-normal">
                  <span className="flex-shrink-0">🔍</span>
                  <span>User Research - Conducting in-depth research to understand user needs and behaviors</span>
                </li>
                <li className="flex items-center gap-2 leading-normal">
                  <span className="flex-shrink-0">📊</span>
                  <span>Information Architecture - Organizing content in a clear and logical manner</span>
                </li>
                <li className="flex items-center gap-2 leading-normal">
                  <span className="flex-shrink-0">🤝</span>
                  <span>Stakeholder Management - Collaborating effectively with cross-functional teams</span>
                </li>
                <li className="flex items-center gap-2 leading-normal">
                  <span className="flex-shrink-0">📱</span>
                  <span>Responsive Design - Creating seamless experiences across all devices</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Services and Stats Grid */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {/* Stats Section - Now on the left */}
          <Card className="col-span-1">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                  <p className="text-2xl font-bold">150+</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="col-span-4 space-y-4">
            <h2 className="text-lg font-semibold">Services</h2>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Tier */}
                  <Card className="relative overflow-hidden flex flex-col">
                    <div className="absolute inset-x-0 top-0 h-2 bg-blue-100" />
                    <CardContent className="pt-6 flex-1 flex flex-col">
                      <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">Basic Consultation</h3>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                            <span className="text-2xl font-bold">99</span>
                            <span className="text-muted-foreground">/session</span>
                          </div>
                          <p className="text-muted-foreground">Perfect for startups and small projects needing expert UX guidance.</p>
                        </div>
                        <div className="space-y-3">
                          {["1-hour consultation", "Basic UX review", "Written recommendations", "1 revision round"].map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 pt-6">
                        <Button className="w-full">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Tier */}
                  <Card className="relative overflow-hidden flex flex-col">
                    <div className="absolute inset-x-0 top-0 h-2 bg-purple-100" />
                    <CardContent className="pt-6 flex-1 flex flex-col">
                      <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">Professional Package</h3>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                            <span className="text-2xl font-bold">299</span>
                            <span className="text-muted-foreground">/project</span>
                          </div>
                          <p className="text-muted-foreground">Comprehensive UX design solution for established businesses.</p>
                        </div>
                        <div className="space-y-3">
                          {[
                            "3 consultation sessions",
                            "Detailed UX audit",
                            "Interactive prototypes",
                            "3 revision rounds",
                            "Priority support"
                          ].map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-purple-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 pt-6">
                        <Button className="w-full">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enterprise Tier */}
                  <Card className="relative overflow-hidden flex flex-col">
                    <div className="absolute inset-x-0 top-0 h-2 bg-indigo-100" />
                    <CardContent className="pt-6 flex-1 flex flex-col">
                      <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">Enterprise Solution</h3>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                            <span className="text-2xl font-bold">999</span>
                            <span className="text-muted-foreground">/month</span>
                          </div>
                          <p className="text-muted-foreground">Full-service UX design and consultation for large organizations.</p>
                        </div>
                        <div className="space-y-3">
                          {[
                            "Unlimited consultations",
                            "Complete UX overhaul",
                            "User research & testing",
                            "Custom design system",
                            "Dedicated support team",
                            "Monthly progress reports"
                          ].map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-indigo-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 pt-6">
                        <Button className="w-full">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Community</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Active Members", count: "1,234" },
                { title: "Posts", count: "456" },
                { title: "Resources", count: "89" },
              ].map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* More From Seller Section with added padding */}
        <div className="container mx-auto px-4 pt-[15px]">
          <MoreFromSeller products={moreProducts} />
        </div>
      </div>
    </div>
  );
}
