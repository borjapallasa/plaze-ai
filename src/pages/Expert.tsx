import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users, Info, Calendar, MapPin, Share2, Save, Check, Handshake, DollarSign, Globe } from "lucide-react";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext,
  type CarouselApi
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

export default function Expert() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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
      image: "https://images.unsplash.com/photo-1518770660439-440f080d1e12",
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
      title: "UX Writing Fundamentals",
      price: "$69.99",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      seller: "John Doe",
      description: "Master the art of writing clear and effective UX copy.",
      tags: ["writing", "content"],
      category: "design"
    },
    {
      title: "Mobile UX Design",
      price: "$94.99",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
      seller: "John Doe",
      description: "Create seamless mobile experiences that users love.",
      tags: ["mobile", "ux"],
      category: "design"
    },
    {
      title: "User Testing Mastery",
      price: "$109.99",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
      seller: "John Doe",
      description: "Learn effective user testing methods and analysis techniques.",
      tags: ["testing", "research"],
      category: "design"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="container mx-auto px-4">
        <Card className="mt-8">
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
      </div>

      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden lg:block space-y-8">
          <div className="grid grid-cols-5 gap-6">
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

          <div className="grid grid-cols-5 gap-6">
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

          <div className="col-span-4">
            <h2 className="text-2xl font-bold mb-6">Services</h2>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="relative overflow-hidden h-[500px] flex flex-col">
                    <div className="absolute inset-x-0 top-0 h-2 bg-blue-100" />
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">Basic Consultation</h3>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                            <span className="text-2xl font-bold">$99</span>
                          </div>
                          <p className="text-muted-foreground">Perfect for startups and small projects needing expert UX guidance.</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">1-hour consultation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Basic UX review</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Written recommendations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">1 revision round</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto space-y-2">
                        <Button className="w-full">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="w-full">
                          Contact Expert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden h-[500px] flex flex-col">
                    <div className="absolute inset-x-0 top-0 h-2 bg-blue-100" />
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">Professional Package</h3>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                            <span className="text-2xl font-bold">$299</span>
                          </div>
                          <p className="text-muted-foreground">Comprehensive UX design solution for established businesses.</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">3 consultation sessions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Detailed UX audit</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Interactive prototypes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">3 revision rounds</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Priority support</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto space-y-2">
                        <Button className="w-full">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="w-full">
                          Contact Expert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden h-[500px] flex flex-col">
                    <div className="absolute inset-x-0 top-0 h-2 bg-blue-100" />
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">Enterprise Solution</h3>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                            <span className="text-2xl font-bold">$999</span>
                          </div>
                          <p className="text-muted-foreground">Full-service UX design and consultation for large organizations.</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Unlimited consultations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Complete UX overhaul</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">User research & testing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Custom design system</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Dedicated support team</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Monthly progress reports</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto space-y-2">
                        <Button className="w-full">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="w-full">
                          Contact Expert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-4 col-start-2">
              <h2 className="text-2xl font-bold mb-6">Community</h2>
              <Card>
                <CardContent className="p-4">
                  {/* Hero Image */}
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden relative mb-6">
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

                  {/* Title and Labels */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-xl font-semibold">UX Design Community</h3>
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
                  <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                    Join our vibrant community of UX designers where we share insights, 
                    collaborate on projects, and help each other grow. Get access to exclusive 
                    resources, participate in discussions, and connect with fellow designers 
                    from around the world.
                  </p>

                  {/* Stats */}
                  <div className="space-y-6 mb-6">
                    {/* Community Size */}
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

                    {/* Activity */}
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
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-4 col-start-2">
              <MoreFromSeller products={moreProducts} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Senior UX Designer with a passion for creating intuitive and engaging digital experiences. 
                  Combining analytical thinking with creative design to solve complex user problems.
                </p>
                <ul className="space-y-2 text-muted-foreground mt-4">
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

          <div className="mb-8">
            <Card>
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
          </div>

          <div className="mb-8">
            <Card>
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
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Services</h2>
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {[
                  {
                    title: "Basic Consultation",
                    price: "$99",
                    description: "Perfect for startups and small projects needing expert UX guidance.",
                    features: ["1-hour consultation", "Basic UX review", "Written recommendations", "1 revision round"]
                  },
                  {
                    title: "Professional Package",
                    price: "$299",
                    description: "Comprehensive UX design solution for established businesses.",
                    features: ["3 consultation sessions", "Detailed UX audit", "Interactive prototypes", "3 revision rounds", "Priority support"]
                  },
                  {
                    title: "Enterprise Solution",
                    price: "$999",
                    description: "Full-service UX design and consultation for large organizations.",
                    features: ["Unlimited consultations", "Complete UX overhaul", "User research & testing", "Custom design system", "Dedicated support team", "Monthly progress reports"]
                  }
                ].map((service, index) => (
                  <CarouselItem key={index}>
                    <Card className="relative overflow-hidden h-[500px] flex flex-col">
                      <div className="absolute inset-x-0 top-0 h-2 bg-blue-100" />
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="space-y-4 flex-1">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{service.title}</h3>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-5 h-5 text-muted-foreground" />
                              <span className="text-2xl font-bold">{service.price}</span>
                            </div>
                            <p className="text-muted-foreground">{service.description}</p>
                          </div>
                          <div className="space-y-3">
                            {service.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-500" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-auto space-y-2">
                          <Button className="w-full">
                            <Handshake className="w-4 h-4 mr-2" />
                            Hire Expert
                          </Button>
                          <Button variant="outline" className="w-full">
                            Contact Expert
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
              <div className="mt-5 text-center flex justify-center gap-1">
                {Array.from({ length: count }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                      index === current ? "bg-primary" : "bg-muted/60"
                    }`}
                  />
                ))}
              </div>
            </Carousel>
          </div>

          <div className="mb-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Community</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Active Members", count: "1,234" },
                    { title: "Posts", count: "456" },
                    { title: "Resources", count: "89" },
                  ].map((stat) => (
                    <div key={stat.title} className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <MoreFromSeller products={moreProducts} />
        </div>
      </div>
    </div>
  );
}
