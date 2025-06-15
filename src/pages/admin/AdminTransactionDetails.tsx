
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { TransactionOverview } from "./components/TransactionOverview";
import { TransactionFinancials } from "./components/TransactionFinancials";
import { TransactionFiles } from "./components/TransactionFiles";
import { TransactionReview } from "./components/TransactionReview";
import { useTransactionDetails } from "@/hooks/use-transaction-details";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for sections not yet connected to database
const mockData = {
  title: "Find Customer Email List Of Competitors From Social Media Instagram Account",
  buyerUser: "adamcic.ziga@gmail.com",
  sellerUser: "info@optimalpath.ai",
  transactionDate: "June 13, 2024, 8:33 PM",
  transactionFees: 15.00,
  affiliateFees: 4.50,
  grossMargin: 7.98,
  stripeFees: 2.52,
  netMargin: 7.98,
  guidesUrl: "https://docs.google.com/document/d/1Tu4aBhms9OvovbPHGj7yVA7DX7r99X3Beupqm77HoNc/edit?usp=sharing",
  review: "Template is amazing! Everything works as it should. Borja is a very friendly. He set everything up and helped me. Highly recommend! :)",
  rating: 5,
  customRequest: "Custom requirements for the template setup"
};

export default function AdminTransactionDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: transaction, isLoading, error } = useTransactionDetails(id || '');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <Skeleton className="h-6 w-48 mb-6" />
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardHeader>
            <CardContent className="space-y-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (error || !transaction) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <Link 
            to="/a/admin/transactions"
            className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
              <p className="text-[#8E9196]">The transaction you're looking for doesn't exist or couldn't be loaded.</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Get the first item's files link for the main files section
  const filesUrl = transaction.items[0]?.files_link || '';

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        {/* Back Button */}
        <Link 
          to="/a/admin/transactions"
          className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <CardTitle className="text-2xl font-semibold">Transaction Details</CardTitle>
              <CardDescription className="text-lg text-[#1A1F2C] break-words">
                {transaction.items[0]?.product_name || mockData.title}
              </CardDescription>
              
              {/* Transaction ID near the top */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                <span className="text-[#8E9196] whitespace-nowrap">Transaction ID:</span>
                <span className="font-medium flex-1 break-all">{transaction.transaction_uuid}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#8E9196] hover:text-[#1A1F2C] ml-auto"
                  onClick={() => copyToClipboard(transaction.transaction_uuid, "Transaction ID")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <TransactionOverview
              buyerUser={mockData.buyerUser}
              sellerUser={mockData.sellerUser}
              transactionDate={new Date(transaction.created_at).toLocaleString()}
            />

            <Separator className="my-8" />

            <TransactionFinancials
              transactionAmount={transaction.total_amount}
              transactionFees={mockData.transactionFees}
              affiliateFees={mockData.affiliateFees}
              stripeFees={mockData.stripeFees}
              grossMargin={mockData.grossMargin}
              netMargin={mockData.netMargin}
            />

            <Separator className="my-8" />

            <TransactionFiles
              filesUrl={filesUrl}
              guidesUrl={mockData.guidesUrl}
              customRequest={mockData.customRequest}
            />

            {mockData.review && (
              <TransactionReview
                rating={mockData.rating}
                review={mockData.review}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
