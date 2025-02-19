import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users, Mail, Info, BookOpen, MessageCircle, DollarSign, Calendar, MapPin, Share2, Save, Check, Handshake } from "lucide-react";

export default function Expert() {
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
            {/* Services Heading */}
            <h2 className="text-lg font-semibold">Services</h2>
            
            {/* Services Section */}
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
                      <div className="flex gap-2 pt-6">
                        <Button className="flex-1">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="flex-1">
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
                      <div className="flex gap-2 pt-6">
                        <Button className="flex-1">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="flex-1">
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
                      <div className="flex gap-2 pt-6">
                        <Button className="flex-1">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire Expert
                        </Button>
                        <Button variant="outline" className="flex-1">
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

        {/* Products Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((product) => (
              <Card key={product} className="overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + product}?auto=format&fit=crop&w=300&q=80`}
                  alt={`Product ${product}`}
                  className="w-full aspect-video object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-medium">Product {product}</h3>
                  <p className="text-sm text-muted-foreground">$99.99</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Contact</h2>
            </div>
            <div className="flex gap-4">
              <Button className="w-full sm:w-auto">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <BookOpen className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
