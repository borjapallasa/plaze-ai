import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";

export default function ManageSubscriptions() {
  const activeSubscriptions = [
    {
      id: 1,
      name: "Optimal Path Automations",
      logo: "/lovable-uploads/33beb9c9-595a-456b-91c1-96b8c699f89a.png",
      joinedDate: "February 21, 2025",
      nextPayment: "March 24, 2025",
      amount: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1200px] space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Active subscriptions</h1>
            <p className="text-muted-foreground">
              The list of all your active subscriptions
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions"
              className="pl-9 bg-muted/40"
            />
          </div>

          <div className="space-y-4">
            {activeSubscriptions.map((subscription) => (
              <Card key={subscription.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={subscription.logo}
                        alt={subscription.name}
                        className="w-16 h-16 rounded-lg object-cover border border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg leading-none mb-1">{subscription.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Next payment: {subscription.nextPayment}
                        </p>
                      </div>
                      <div className="text-sm sm:hidden">
                        <p className="text-muted-foreground">Joined: {subscription.joinedDate}</p>
                        <p className="font-medium mt-1">${subscription.amount} per month</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="hidden sm:block space-y-1 text-right">
                      <p className="text-sm text-muted-foreground">Joined: {subscription.joinedDate}</p>
                      <p className="font-medium">${subscription.amount} per month</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto bg-background hover:bg-muted/50 border-muted-foreground/20"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
