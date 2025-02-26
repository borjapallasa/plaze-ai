
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
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {sortedServices.map((service, index) => (
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
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-2 bg-blue-100" />
      <div className="grid md:grid-cols-[2fr,1fr,1fr] gap-6">
        {/* Main Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold">{name}</h3>
                <Badge variant="secondary" className="capitalize">
                  {type}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Starting at</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                <DollarSign className="w-5 h-5" />
                {price?.toLocaleString() || '0'}
              </div>
            </div>
          </div>
        </div>

        {/* Features Column */}
        <div className="p-6 border-t md:border-t-0 md:border-l border-border bg-muted/10">
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Features
            </h4>
            <ul className="space-y-2">
              {features?.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Metrics & Actions */}
        <div className="p-6 border-t md:border-t-0 md:border-l border-border bg-muted/5">
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  MRR
                </div>
                <div className="font-medium">
                  ${monthly_recurring_revenue?.toLocaleString() || '0'}/mo
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Revenue
                </div>
                <div className="font-medium">
                  ${revenue_amount?.toLocaleString() || '0'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Users2 className="w-3 h-3" />
                  Active Subs
                </div>
                <div className="font-medium">
                  {active_subscriptions_count || 0}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  Created
                </div>
                <div className="font-medium">
                  {created_at ? format(new Date(created_at), 'MMM d, yyyy') : '-'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full">
                <Handshake className="w-4 h-4 mr-2" />
                Hire Expert
              </Button>
              <Button variant="outline" className="w-full">
                Contact Expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
