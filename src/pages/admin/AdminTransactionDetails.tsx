
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { Calendar, Clock, Copy, FileText, Star, Link as LinkIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock data - In a real app, this would come from an API
const transactionData = {
  title: "Find Customer Email List Of Competitors From Social Media Instagram Account",
  buyerUser: "adamcic.ziga@gmail.com",
  sellerUser: "info@optimalpath.ai",
  transactionDate: "6/13/2024, 8:33 PM",
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
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-2">Transaction Details</CardTitle>
            <CardDescription className="text-lg text-[#1A1F2C]">
              {transactionData.title}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Overview Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                  <User className="h-4 w-4" />
                  <span>Buyer User</span>
                </div>
                <div className="font-medium">{transactionData.buyerUser}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                  <User className="h-4 w-4" />
                  <span>Seller User</span>
                </div>
                <div className="font-medium">{transactionData.sellerUser}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                  <Calendar className="h-4 w-4" />
                  <Clock className="h-4 w-4" />
                  <span>Transaction Date</span>
                </div>
                <div className="font-medium">{transactionData.transactionDate}</div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E9196]">Transaction Amount</span>
                      <span className="font-medium">${transactionData.transactionAmount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E9196]">Transaction Fees</span>
                      <span className="font-medium">${transactionData.transactionFees}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E9196]">Affiliate Fees</span>
                      <span className="font-medium">${transactionData.affiliateFees}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E9196]">Stripe Fees</span>
                      <span className="font-medium">${transactionData.stripeFees}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E9196]">Gross Margin</span>
                      <span className="font-medium">${transactionData.grossMargin}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg text-[#1A1F2C]">Net Margin</span>
                      <span className="font-medium text-lg text-[#9b87f5]">${transactionData.netMargin}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files & Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Files & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#8E9196]" />
                    <span className="font-medium">Files URL</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8E9196] hover:text-[#1A1F2C]"
                    onClick={() => copyToClipboard(transactionData.filesUrl, "Files URL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-[#8E9196]" />
                    <span className="font-medium">Guides URL</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8E9196] hover:text-[#1A1F2C]"
                    onClick={() => copyToClipboard(transactionData.guidesUrl, "Guides URL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {transactionData.customRequest && (
                  <div className="p-4 bg-[#F8F9FC] rounded-lg">
                    <div className="font-medium mb-2">Custom Request</div>
                    <p className="text-[#8E9196]">{transactionData.customRequest}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Review Section */}
            {transactionData.review && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {renderStars(transactionData.rating)}
                    </div>
                    <p className="text-[#1A1F2C] italic">"{transactionData.review}"</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction ID */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#8E9196]">Transaction ID:</span>
                <span className="font-medium">{transactionData.transactionId}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#8E9196] hover:text-[#1A1F2C]"
                onClick={() => copyToClipboard(transactionData.transactionId, "Transaction ID")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
