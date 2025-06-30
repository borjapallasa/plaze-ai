
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "./tabs/UsersTab";
import { TransactionsTab } from "./tabs/TransactionsTab";
import { PartnershipsTab } from "./tabs/PartnershipsTab";
import { PayoutsTab } from "./tabs/PayoutsTab";

export function AffiliateTabsInterface() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UsersTab />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionsTab />
        </TabsContent>

        <TabsContent value="partnerships" className="mt-6">
          <PartnershipsTab />
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <PayoutsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
