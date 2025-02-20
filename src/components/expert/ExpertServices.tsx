
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Handshake, DollarSign } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const services = [
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
];

export const ExpertServices = () => {
  return (
    <div className="col-span-4">
      <h2 className="text-2xl font-bold mb-6">Services</h2>
      
      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View with Carousel */}
      <div className="block md:hidden">
        <Card>
          <CardContent className="p-6">
            <Carousel className="w-full">
              <CarouselContent>
                {services.map((service, index) => (
                  <CarouselItem key={index}>
                    <ServiceCard {...service} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                {services.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-primary/20"
                  />
                ))}
              </div>
            </Carousel>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ title, price, description, features }: {
  title: string;
  price: string;
  description: string;
  features: string[];
}) => {
  return (
    <Card className="relative overflow-hidden h-[500px] flex flex-col">
      <div className="absolute inset-x-0 top-0 h-2 bg-blue-100" />
      <CardContent className="p-6 flex flex-col h-full">
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{price}</span>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="space-y-3">
            {features.map((feature, idx) => (
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
  );
};
