
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, Handshake, DollarSign } from "lucide-react";
import { UsersTab } from "./tabs/UsersTab";
import { TransactionsTab } from "./tabs/TransactionsTab";
import { PartnershipsTab } from "./tabs/PartnershipsTab";
import { PayoutsTab } from "./tabs/PayoutsTab";

export function AffiliateTabsInterface() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="animate-fade-in">
      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="mb-6">
          <div className="max-w-[1400px] mx-auto px-4 border-b border-border">
            <TabsList className="h-auto items-center bg-transparent w-auto justify-start rounded-none p-0 border-0">
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger 
                value="partnerships" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <Handshake className="h-4 w-4 mr-2" />
                Partnerships
              </TabsTrigger>
              <TabsTrigger 
                value="payouts" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Payouts
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="users" className="mt-0">
          <UsersTab />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <TransactionsTab />
        </TabsContent>

        <TabsContent value="partnerships" className="mt-0">
          <PartnershipsTab />
        </TabsContent>

        <TabsContent value="payouts" className="mt-0">
          <PayoutsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
