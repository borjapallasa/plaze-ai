
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { Calendar, Clock, Copy, FileText, Star, Link as LinkIcon, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

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

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-5 w-5 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ));
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
            {/* Overview Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Buyer Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                  <div className="bg-[#F8F9FC] p-2 rounded-full shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <span>Buyer User</span>
                </div>
                <div className="font-medium pl-10 break-all">{transactionData.buyerUser}</div>
              </div>

              {/* Seller Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                  <div className="bg-[#F8F9FC] p-2 rounded-full shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <span>Seller User</span>
                </div>
                <div className="font-medium pl-10 break-all">{transactionData.sellerUser}</div>
              </div>

              {/* Date/Time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                  <div className="bg-[#F8F9FC] p-2 rounded-full shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span>Transaction Date</span>
                </div>
                <div className="font-medium pl-10">{transactionData.transactionDate}</div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Financial Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-[#8E9196] mr-2">Transaction Amount</span>
                      <span className="font-medium shrink-0">${transactionData.transactionAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-[#8E9196] mr-2">Transaction Fees</span>
                      <span className="font-medium shrink-0">${transactionData.transactionFees.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-[#8E9196] mr-2">Affiliate Fees</span>
                      <span className="font-medium shrink-0">${transactionData.affiliateFees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-[#8E9196] mr-2">Stripe Fees</span>
                      <span className="font-medium shrink-0">${transactionData.stripeFees.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-[#8E9196] mr-2">Gross Margin</span>
                      <span className="font-medium shrink-0">${transactionData.grossMargin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#F8F9FC] rounded-lg border-2 border-[#9b87f5]">
                      <span className="font-medium text-lg text-[#1A1F2C] mr-2">Net Margin</span>
                      <span className="font-medium text-lg text-[#9b87f5] shrink-0">${transactionData.netMargin.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Files & Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Files & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shrink-0">
                      <FileText className="h-5 w-5 text-[#9b87f5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium">View Project Files</div>
                      <div className="text-sm text-[#8E9196]">Access all project deliverables</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8E9196] hover:text-[#1A1F2C] shrink-0"
                    onClick={() => copyToClipboard(transactionData.filesUrl, "Files URL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shrink-0">
                      <LinkIcon className="h-5 w-5 text-[#9b87f5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium">View Project Guide</div>
                      <div className="text-sm text-[#8E9196]">Access setup instructions</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8E9196] hover:text-[#1A1F2C] shrink-0"
                    onClick={() => copyToClipboard(transactionData.guidesUrl, "Guides URL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {transactionData.customRequest && (
                  <div className="mt-6">
                    <div className="font-medium mb-3">Custom Requirements</div>
                    <div className="p-4 bg-[#F8F9FC] rounded-lg text-[#1A1F2C] break-words">
                      {transactionData.customRequest}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Review Section */}
            {transactionData.review && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {renderStars(transactionData.rating)}
                      </div>
                      <span className="text-[#8E9196]">({transactionData.rating}/5)</span>
                    </div>
                    <blockquote className="text-[#1A1F2C] italic border-l-4 border-[#9b87f5] pl-4 py-2 break-words">
                      "{transactionData.review}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
