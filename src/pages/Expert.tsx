
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users, Mail, Info, BookOpen, MessageCircle, DollarSign, Calendar, MapPin } from "lucide-react";

export default function Expert() {
  return (
    <div className="space-y-8">
      {/* Header with Stats - Full Width */}
      <div className="w-full bg-card border-b">
        <div className="px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex gap-4 items-start w-full">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-2 w-full">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">Expert in UX Design</h1>
                  <div className="flex flex-col md:flex-row md:items-center gap-2.5 w-full">
                    <p className="text-xl text-muted-foreground">John Doe</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Expert since 2020</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Info Section */}
          <Card className="md:col-span-1">
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

          {/* Services Section */}
          <Card className="md:col-span-2">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "UI Design", price: "$100/hr" },
                  { title: "UX Research", price: "$90/hr" },
                  { title: "Consultation", price: "$120/hr" },
                ].map((service) => (
                  <Card key={service.title}>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
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
