import React, { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, DollarSign, Users, TrendingUp, Copy, Check } from "lucide-react";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { PaymentSettingsDialog } from "@/components/affiliates/PaymentSettingsDialog";
import { useAffiliateData } from "@/hooks/use-affiliate-data";
import { useAffiliateProducts } from "@/hooks/use-affiliate-products";
import { useUsers } from "@/hooks/admin/useUsers";

export default function Affiliates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaymentSettingsOpen, setIsPaymentSettingsOpen] = useState(false);
  const { 
    users, 
    isLoading: isUsersLoading, 
    searchQuery: usersSearchQuery,
    setSearchQuery: setUsersSearchQuery,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort
  } = useUsers(1, 50, 'created_at' as keyof import("@/hooks/admin/useUsers").UserData, 'desc');
  
  const { data: affiliateData, isLoading: isAffiliateLoading } = useAffiliateData();
  const { data: products, isLoading: isProductsLoading } = useAffiliateProducts();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const userAffiliate = users?.find((user) => user.is_affiliate);

  const calculateTotalEarnings = () => {
    if (!products || !affiliateData) return 0;
  
    return products.reduce((total, product) => {
      const commissionRate = affiliateData?.commission_rate || 0.1;
      const earnings = (product.price_from || 0) * commissionRate;
      return total + earnings;
    }, 0);
  };

  const totalEarnings = calculateTotalEarnings();

  return (
    <>
      <MainHeader />
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Affiliate Program</CardTitle>
            <Button onClick={() => setIsPaymentSettingsOpen(true)}>
              Payment Settings
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dashboard" className="space-y-4">
              <TabsList>
                <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="affiliates" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Affiliates</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard" className="space-y-4">
                <AffiliateDashboard 
                  totalEarnings={totalEarnings}
                  isAffiliateLoading={isAffiliateLoading}
                />
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle>Your Affiliate Code</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <Input
                      value={affiliateData?.code || "No code generated"}
                      readOnly
                      className="max-w-[300px]"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(affiliateData?.code || "")}
                      disabled={!affiliateData?.code}
                    >
                      {copiedCode === affiliateData?.code ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copiedCode === affiliateData?.code ? "Copied!" : "Copy Code"}
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle>Your Affiliate Link</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <Input
                      value={`${window.location.origin}/?affiliate=${affiliateData?.code}` || "No link generated"}
                      readOnly
                      className="max-w-[500px]"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(`${window.location.origin}/?affiliate=${affiliateData?.code}`)}
                      disabled={!affiliateData?.code}
                    >
                      {copiedCode === `${window.location.origin}/?affiliate=${affiliateData?.code}` ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copiedCode === `${window.location.origin}/?affiliate=${affiliateData?.code}` ? "Copied!" : "Copy Link"}
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle>Available Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isProductsLoading ? (
                      <p>Loading products...</p>
                    ) : products && products.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                          <Card key={product.product_uuid}>
                            <CardHeader>
                              <CardTitle>{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>Price: ${product.price_from}</p>
                              <p>
                                Commission: $
                                {(
                                  product.price_from *
                                  (affiliateData?.commission_rate || 0.1)
                                ).toFixed(2)}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p>No products available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="affiliates" className="space-y-4">
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search affiliates..."
                      className="pl-9"
                      value={usersSearchQuery}
                      onChange={(e) => setUsersSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button>Export</Button>
                </div>
                <AffiliateTable
                  users={users}
                  isLoading={isUsersLoading}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  roleFilter={roleFilter}
                  setRoleFilter={setRoleFilter}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <PaymentSettingsDialog
          open={isPaymentSettingsOpen}
          onOpenChange={setIsPaymentSettingsOpen}
        />
      </div>
    </>
  );
}
