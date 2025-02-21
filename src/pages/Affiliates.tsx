
import { MainHeader } from "@/components/MainHeader";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";

export default function Affiliates() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Your affiliate dashboard</h1>
        <AffiliateDashboard />
        <div className="mt-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Your affiliates</h2>
          <p className="text-muted-foreground mb-8">
            Click on your affiliate to see all transactions.
          </p>
          <AffiliateTable />
        </div>
      </main>
    </div>
  );
}
