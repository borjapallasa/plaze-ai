
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
          placeholder="Search community"
          className="pl-9 bg-muted/40"
        />
      </div>

      <div className="space-y-4">
        {activeSubscriptions.map((subscription) => (
          <Card key={subscription.id} className="p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <img
                  src={subscription.logo}
                  alt={subscription.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{subscription.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Next payment: {subscription.nextPayment}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 ml-auto">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Joined: {subscription.joinedDate}</p>
                  <p className="font-medium">${subscription.amount} per month</p>
                </div>
                <Button variant="outline" className="bg-background hover:bg-muted/50">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
