
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  CalendarDays, 
  Users2,
  Loader2
} from "lucide-react";
import type { Service } from "@/components/expert/types";

interface ServicesTabProps {
  services: Service[];
  isLoading?: boolean;
}

export function ServicesTab({ services, isLoading = false }: ServicesTabProps) {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}/edit`);
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search services..." 
            className="pl-9"
          />
        </div>
        <Button asChild className="sm:w-auto">
          <Link to="/seller/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Add service
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <Card className="p-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/70 mb-2" />
            <p className="text-muted-foreground">Loading services...</p>
          </Card>
        ) : services.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No services found
          </Card>
        ) : (
          services.map((service) => (
            <Card 
              key={service.service_uuid} 
              className="overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleServiceClick(service.service_uuid)}
            >
              <div className="grid lg:grid-cols-[2fr,1fr,1fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                        {service.name}
                      </h3>
                      <UIBadge 
                        variant={service.status === 'active' ? 'default' : 'secondary'}
                        className="capitalize whitespace-nowrap shrink-0"
                      >
                        {service.status}
                      </UIBadge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap items-baseline gap-x-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Starting at</span>
                      <span className="text-2xl font-semibold tracking-tight">
                        ${service.price?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="text-lg font-medium capitalize">
                        {service.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-muted/5">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      Features
                    </h4>
                    <ul className="space-y-2">
                      {service.features?.map((feature, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <ArrowRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 bg-muted/5">
                  <div className="h-full flex flex-col">
                    <div className="space-y-4 flex-grow">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            MRR
                          </div>
                          <div className="font-medium whitespace-nowrap">
                            ${service.monthly_recurring_revenue?.toLocaleString() || '0'}/mo
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Revenue
                          </div>
                          <div className="font-medium whitespace-nowrap">
                            ${service.revenue_amount?.toLocaleString() || '0'}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Users2 className="w-3 h-3" />
                            Active Subs
                          </div>
                          <div className="font-medium">
                            {service.active_subscriptions_count || 0}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            Created
                          </div>
                          <div className="font-medium whitespace-nowrap">
                            {format(new Date(service.created_at), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(service.service_uuid);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
