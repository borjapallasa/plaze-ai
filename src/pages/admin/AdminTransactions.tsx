
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  templateName: string;
  createdAt: string;
  buyerEmail: string;
  deliverables: string;
  amount: number;
  marketplaceFees: number;
  sellerReceives: number;
  sellerUser: string;
  affiliateFees: number;
  status: string;
  completedAt: string;
  templateId: string;
  checkoutId: string;
  rating: number;
  review: string;
}

const transactions: Transaction[] = [
  {
    templateName: "Automated YouTube Script Rewriter",
    createdAt: "2/22/2025, 8:06 PM",
    buyerEmail: "missioncfwf@yahoo.com",
    deliverables: "Script rewriting automation",
    amount: 299,
    marketplaceFees: 29.9,
    sellerReceives: 269.1,
    sellerUser: "seller@example.com",
    affiliateFees: 0,
    status: "completed",
    completedAt: "2/23/2025, 8:06 PM",
    templateId: "TEMP123",
    checkoutId: "CHK456",
    rating: 5,
    review: "Excellent service!"
  },
  {
    templateName: "IG Lead Qualification Chatbot With Manychat Poll",
    createdAt: "2/22/2025, 2:23 PM",
    buyerEmail: "manageautomations@gmail.com",
    deliverables: "Lead qualification chatbot",
    amount: 199,
    marketplaceFees: 19.9,
    sellerReceives: 179.1,
    sellerUser: "seller2@example.com",
    affiliateFees: 10,
    status: "pending",
    completedAt: "",
    templateId: "TEMP456",
    checkoutId: "CHK789",
    rating: 0,
    review: ""
  },
  {
    templateName: "Automated Onboarding (Contract, Payments & Channels) Process to Discord",
    createdAt: "2/16/2025, 3:48 AM",
    buyerEmail: "freekrai@gmail.com",
    deliverables: "Automated onboarding process",
    amount: 399,
    marketplaceFees: 39.9,
    sellerReceives: 359.1,
    sellerUser: "seller3@example.com",
    affiliateFees: 20,
    status: "completed",
    completedAt: "2/17/2025, 3:48 AM",
    templateId: "TEMP789",
    checkoutId: "CHK101",
    rating: 4,
    review: "Good automation!"
  },
  {
    templateName: "Automated SEO Article Writer to Shopify And Wordpress With Airtable Interface",
    createdAt: "2/7/2025, 11:02 PM",
    buyerEmail: "mindoftoto@gmail.com",
    deliverables: "SEO article writer",
    amount: 499,
    marketplaceFees: 49.9,
    sellerReceives: 449.1,
    sellerUser: "seller4@example.com",
    affiliateFees: 30,
    status: "failed",
    completedAt: "",
    templateId: "TEMP101",
    checkoutId: "CHK121",
    rating: 0,
    review: ""
  },
  {
    templateName: "Automated YouTube Faceless Channel Video Creation",
    createdAt: "1/24/2025, 9:49 AM",
    buyerEmail: "alexrob350@gmail.com",
    deliverables: "YouTube video creation",
    amount: 599,
    marketplaceFees: 59.9,
    sellerReceives: 539.1,
    sellerUser: "seller5@example.com",
    affiliateFees: 40,
    status: "completed",
    completedAt: "1/25/2025, 9:49 AM",
    templateId: "TEMP121",
    checkoutId: "CHK131",
    rating: 5,
    review: "Amazing videos!"
  },
  {
    templateName: "Automated YouTube Faceless Channel Video Creation",
    createdAt: "1/21/2025, 12:58 PM",
    buyerEmail: "gibneykeith@gmail.com",
    deliverables: "YouTube video creation",
    amount: 599,
    marketplaceFees: 59.9,
    sellerReceives: 539.1,
    sellerUser: "seller5@example.com",
    affiliateFees: 40,
    status: "completed",
    completedAt: "1/22/2025, 12:58 PM",
    templateId: "TEMP121",
    checkoutId: "CHK132",
    rating: 5,
    review: "Great content!"
  },
  {
    templateName: "Automated YouTube Faceless Channel Video Creation",
    createdAt: "1/8/2025, 2:41 PM",
    buyerEmail: "philryan84@outlook.com",
    deliverables: "YouTube video creation",
    amount: 599,
    marketplaceFees: 59.9,
    sellerReceives: 539.1,
    sellerUser: "seller5@example.com",
    affiliateFees: 40,
    status: "completed",
    completedAt: "1/9/2025, 2:41 PM",
    templateId: "TEMP121",
    checkoutId: "CHK133",
    rating: 4,
    review: "Good videos!"
  },
  {
    templateName: "Find Customer Email List Of Competitors From Social Media Instagram Account",
    createdAt: "1/8/2025, 2:41 PM",
    buyerEmail: "philryan84@outlook.com",
    deliverables: "Email list extraction",
    amount: 299,
    marketplaceFees: 29.9,
    sellerReceives: 269.1,
    sellerUser: "seller6@example.com",
    affiliateFees: 15,
    status: "completed",
    completedAt: "1/9/2025, 2:41 PM",
    templateId: "TEMP131",
    checkoutId: "CHK141",
    rating: 3,
    review: "Useful service!"
  },
  {
    templateName: "Automated Onboarding (Contract, Payments & Channels) Process to Discord",
    createdAt: "1/4/2025, 2:07 PM",
    buyerEmail: "phil@qelt.io",
    deliverables: "Automated onboarding process",
    amount: 399,
    marketplaceFees: 39.9,
    sellerReceives: 359.1,
    sellerUser: "seller3@example.com",
    affiliateFees: 20,
    status: "completed",
    completedAt: "1/5/2025, 2:07 PM",
    templateId: "TEMP789",
    checkoutId: "CHK104",
    rating: 5,
    review: "Excellent automation!"
  },
  {
    templateName: "Automated Onboarding (Contract, Payments & Channels) Process to Discord",
    createdAt: "1/4/2025, 2:02 PM",
    buyerEmail: "phil@qelt.io",
    deliverables: "Automated onboarding process",
    amount: 399,
    marketplaceFees: 39.9,
    sellerReceives: 359.1,
    sellerUser: "seller3@example.com",
    affiliateFees: 20,
    status: "completed",
    completedAt: "1/5/2025, 2:02 PM",
    templateId: "TEMP789",
    checkoutId: "CHK105",
    rating: 5,
    review: "Incredible automation!"
  }
];

export default function AdminTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = transactions.filter(transaction =>
    transaction.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">All Transactions</h1>
      <p className="text-[#8E9196] mb-8">Click on the transaction to see all details</p>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
          <Input
            placeholder="Type here to search"
            className="pl-10 border-[#E5E7EB] focus-visible:ring-[#1A1F2C]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-[#E5E7EB]">
            <SelectValue placeholder="Filter By Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table with ScrollArea */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white">
        <ScrollArea className="h-[500px] w-full" type="always">
          <div className="min-w-[2400px]">
            {/* Header */}
            <div className="grid grid-cols-[300px,150px,200px,200px,100px,150px,150px,200px,120px,100px,150px,120px,120px,80px,200px] gap-4 p-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
              <div className="font-medium text-sm text-[#8E9196]">Template Name</div>
              <div className="font-medium text-sm text-[#8E9196]">Created @</div>
              <div className="font-medium text-sm text-[#8E9196]">Buyer User</div>
              <div className="font-medium text-sm text-[#8E9196]">Deliverables</div>
              <div className="font-medium text-sm text-[#8E9196]">Amount</div>
              <div className="font-medium text-sm text-[#8E9196]">Marketplace Fees</div>
              <div className="font-medium text-sm text-[#8E9196]">Seller Receives</div>
              <div className="font-medium text-sm text-[#8E9196]">Seller User</div>
              <div className="font-medium text-sm text-[#8E9196]">Affiliate Fees</div>
              <div className="font-medium text-sm text-[#8E9196]">Status</div>
              <div className="font-medium text-sm text-[#8E9196]">Completed @</div>
              <div className="font-medium text-sm text-[#8E9196]">Template Id</div>
              <div className="font-medium text-sm text-[#8E9196]">Checkout Id</div>
              <div className="font-medium text-sm text-[#8E9196]">Rating</div>
              <div className="font-medium text-sm text-[#8E9196]">Review</div>
            </div>

            {/* Scrollable Transactions */}
            <div className="divide-y divide-[#E5E7EB]">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[300px,150px,200px,200px,100px,150px,150px,200px,120px,100px,150px,120px,120px,80px,200px] gap-4 p-4 hover:bg-[#F8F9FC] cursor-pointer transition-colors duration-200"
                >
                  <div className="text-sm text-[#1A1F2C]">{transaction.templateName}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.createdAt}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.buyerEmail}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.deliverables}</div>
                  <div className="text-sm text-[#8E9196]">${transaction.amount}</div>
                  <div className="text-sm text-[#8E9196]">${transaction.marketplaceFees}</div>
                  <div className="text-sm text-[#8E9196]">${transaction.sellerReceives}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.sellerUser}</div>
                  <div className="text-sm text-[#8E9196]">${transaction.affiliateFees}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.status}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.completedAt}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.templateId}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.checkoutId}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.rating}</div>
                  <div className="text-sm text-[#8E9196]">{transaction.review}</div>
                </div>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* See More Button */}
      <div className="flex justify-center mt-6">
        <Button 
          variant="outline" 
          className="gap-2 border-[#E5E7EB] text-[#1A1F2C] hover:bg-[#F8F9FC]"
        >
          See more <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
