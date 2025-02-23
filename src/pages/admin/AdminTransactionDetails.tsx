
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { TransactionOverview } from "./components/TransactionOverview";
import { TransactionFinancials } from "./components/TransactionFinancials";
import { TransactionFiles } from "./components/TransactionFiles";
import { TransactionReview } from "./components/TransactionReview";

// Mock data - In a real app, this would come from an API
const transactionData = {
  title: "Find Customer Email List Of Competitors From Social Media Instagram Account",
  buyerUser: "adamcic.ziga@gmail.com",
  sellerUser: "info@optimalpath.ai",
  transactionDate: "June 13, 2024, 8:33 PM",
  transactionAmount: 150.00,
  transactionFees: 15.00,
  affiliateFees: 4.50,
  grossMargin: 7.98,
  stripeFees: 2.52,
  netMargin: 7.98,
  status: "Completed",
  filesUrl: "https://drive.google.com/drive/folders/1LuOl-wgxrdhFBziNCw6EmYOqtJJSirPg?usp=drive_link",
  guidesUrl: "https://docs.google.com/document/d/1Tu4aBhms9OvovbPHGj7yVA7DX7r99X3Beupqm77HoNc/edit?usp=sharing",
  transactionId: "recdaXcdTazB2u5pO_Ziga_Adamcic_13_06_2024_19_13",
  review: "Template is amazing! Everything works as it should. Borja is a very friendly. He set everything up and helped me. Highly recommend! :)",
  rating: 5,
  customRequest: "Custom requirements for the template setup"
};

export default function AdminTransactionDetails() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16">
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
                {transactionData.title}
              </CardDescription>
              
              {/* Transaction ID near the top */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                <span className="text-[#8E9196] whitespace-nowrap">Transaction ID:</span>
                <span className="font-medium flex-1 break-all">{transactionData.transactionId}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#8E9196] hover:text-[#1A1F2C] ml-auto"
                  onClick={() => copyToClipboard(transactionData.transactionId, "Transaction ID")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <TransactionOverview
              buyerUser={transactionData.buyerUser}
              sellerUser={transactionData.sellerUser}
              transactionDate={transactionData.transactionDate}
            />

            <Separator className="my-8" />

            <TransactionFinancials
              transactionAmount={transactionData.transactionAmount}
              transactionFees={transactionData.transactionFees}
              affiliateFees={transactionData.affiliateFees}
              stripeFees={transactionData.stripeFees}
              grossMargin={transactionData.grossMargin}
              netMargin={transactionData.netMargin}
            />

            <Separator className="my-8" />

            <TransactionFiles
              filesUrl={transactionData.filesUrl}
              guidesUrl={transactionData.guidesUrl}
              customRequest={transactionData.customRequest}
            />

            {transactionData.review && (
              <TransactionReview
                rating={transactionData.rating}
                review={transactionData.review}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
