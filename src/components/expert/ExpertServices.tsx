
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Handshake, 
  DollarSign,
  Users2,
  CalendarDays,
  Sparkles
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import type { ExpertServicesProps } from "./types";
import { format } from "date-fns";

export const ExpertServices = ({ services }: ExpertServicesProps) => {
  // Sort services by price in ascending order
  const sortedServices = [...services].sort((a, b) => 
    (a.price || 0) - (b.price || 0)
  );

  return (
    <div className="col-span-4">
      <h2 className="text-2xl font-bold mb-6">Services</h2>
      
      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedServices.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>

      {/* Mobile View with Carousel */}
      <div className="block md:hidden">
        <Card>
          <CardContent className="p-6">
            <Carousel className="w-full">
              <CarouselContent>
                {sortedServices.map((service, index) => (
                  <CarouselItem key={index}>
                    <ServiceCard {...service} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                {sortedServices.map((_, index) => (
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

const ServiceCard = ({ 
  name, 
  price, 
  description, 
  features,
  type,
  monthly_recurring_revenue,
  revenue_amount,
  active_subscriptions_count,
  created_at
}: {
  name?: string;
  price?: number;
  description?: string;
  features?: string[];
  type?: string;
  monthly_recurring_revenue?: number;
  revenue_amount?: number;
  active_subscriptions_count?: number;
  created_at?: string;
}) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        {/* Service Header */}
        <div className="mb-4 pb-4 border-b">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold leading-tight">{name}</h3>
            <Badge variant="secondary" className="capitalize whitespace-nowrap shrink-0">
              {type}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="text-sm font-medium text-muted-foreground">Starting at</div>
            <div className="text-xl font-bold flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {price?.toLocaleString() || '0'}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </div>

        {/* Features */}
        <div className="mb-4 flex-grow">
          <h4 className="text-sm font-medium flex items-center gap-1.5 mb-3">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Features
          </h4>
          <div className="space-y-2">
            {features?.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
            {features && features.length > 3 && (
              <div className="text-sm text-muted-foreground pt-1">
                +{features.length - 3} more features
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-auto">
          <Button className="w-full">
            <Handshake className="w-4 h-4 mr-2" />
            Hire Expert
          </Button>
          <Button variant="outline" className="w-full">
            Contact Expert
          </Button>
        </div>
      </div>
    </Card>
  );
};
