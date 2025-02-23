
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ArrowDown, ArrowUp } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainHeader } from "@/components/MainHeader";
import { Separator } from "@/components/ui/separator";

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Transaction>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transaction.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const multiplier = sortDirection === "asc" ? 1 : -1;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * multiplier;
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * multiplier;
      }
      
      return 0;
    });

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">All Transactions</h1>
          <p className="text-[#8E9196]">Manage and review all your transaction records</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Search by template name or buyer email"
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
          <ScrollArea className="h-[600px] w-full" type="always">
            <div className="min-w-[2400px]"> {/* Increased min-width for better content visibility */}
              {/* Header */}
              <div className="grid grid-cols-[2fr,1.2fr,1.5fr,1.2fr,1fr,1.2fr,1.2fr,1.5fr,1fr,0.8fr,1.2fr,1.2fr,1.2fr,0.8fr,1.5fr] gap-4 p-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
                <button 
                  onClick={() => handleSort("templateName")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Template Name {getSortIcon("templateName")}
                </button>
                <button 
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                >
                  Created @ {getSortIcon("createdAt")}
                </button>
                <button 
                  onClick={() => handleSort("buyerEmail")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                >
                  Buyer User {getSortIcon("buyerEmail")}
                </button>
                <div className="font-medium text-sm text-[#8E9196] whitespace-nowrap">Deliverables</div>
                <button 
                  onClick={() => handleSort("amount")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] justify-end whitespace-nowrap"
                >
                  Amount {getSortIcon("amount")}
                </button>
                <button 
                  onClick={() => handleSort("marketplaceFees")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] justify-end whitespace-nowrap"
                >
                  Marketplace Fees {getSortIcon("marketplaceFees")}
                </button>
                <button 
                  onClick={() => handleSort("sellerReceives")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] justify-end whitespace-nowrap"
                >
                  Seller Receives {getSortIcon("sellerReceives")}
                </button>
                <button 
                  onClick={() => handleSort("sellerUser")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                >
                  Seller User {getSortIcon("sellerUser")}
                </button>
                <button 
                  onClick={() => handleSort("affiliateFees")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] justify-end whitespace-nowrap"
                >
                  Affiliate Fees {getSortIcon("affiliateFees")}
                </button>
                <div className="font-medium text-sm text-[#8E9196]">Status</div>
                <button 
                  onClick={() => handleSort("completedAt")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                >
                  Completed @ {getSortIcon("completedAt")}
                </button>
                <button 
                  onClick={() => handleSort("templateId")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                >
                  Template ID {getSortIcon("templateId")}
                </button>
                <button 
                  onClick={() => handleSort("checkoutId")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                >
                  Checkout ID {getSortIcon("checkoutId")}
                </button>
                <button 
                  onClick={() => handleSort("rating")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] justify-end whitespace-nowrap"
                >
                  Rating {getSortIcon("rating")}
                </button>
                <div className="font-medium text-sm text-[#8E9196]">Review</div>
              </div>

              {/* Scrollable Transactions */}
              <div className="divide-y divide-[#E5E7EB]">
                {filteredTransactions.length === 0 ? (
                  <div className="p-8 text-center text-[#8E9196]">
                    No transactions found matching your criteria
                  </div>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(`/a/admin/transactions/${transaction.checkoutId}`)}
                      className="grid grid-cols-[2fr,1.2fr,1.5fr,1.2fr,1fr,1.2fr,1.2fr,1.5fr,1fr,0.8fr,1.2fr,1.2fr,1.2fr,0.8fr,1.5fr] gap-4 p-4 hover:bg-[#F8F9FC] cursor-pointer transition-colors duration-200 group"
                    >
                      <div className="text-sm text-[#1A1F2C] truncate" title={transaction.templateName}>
                        {transaction.templateName}
                      </div>
                      <div className="text-sm text-[#8E9196] whitespace-nowrap">
                        {transaction.createdAt}
                      </div>
                      <div className="text-sm text-[#8E9196] whitespace-nowrap" title={transaction.buyerEmail}>
                        {transaction.buyerEmail}
                      </div>
                      <div className="text-sm text-[#8E9196] whitespace-nowrap" title={transaction.deliverables}>
                        {transaction.deliverables}
                      </div>
                      <div className="text-sm text-[#8E9196] text-right whitespace-nowrap">
                        ${transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-[#8E9196] text-right whitespace-nowrap">
                        ${transaction.marketplaceFees.toFixed(2)}
                      </div>
                      <div className="text-sm text-[#8E9196] text-right whitespace-nowrap">
                        ${transaction.sellerReceives.toFixed(2)}
                      </div>
                      <div className="text-sm text-[#8E9196] whitespace-nowrap" title={transaction.sellerUser}>
                        {transaction.sellerUser}
                      </div>
                      <div className="text-sm text-[#8E9196] text-right whitespace-nowrap">
                        ${transaction.affiliateFees.toFixed(2)}
                      </div>
                      <div>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(transaction.status)} capitalize whitespace-nowrap`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-[#8E9196] whitespace-nowrap">
                        {transaction.completedAt}
                      </div>
                      <div className="text-sm text-[#8E9196] whitespace-nowrap" title={transaction.templateId}>
                        {transaction.templateId}
                      </div>
                      <div className="text-sm text-[#8E9196] whitespace-nowrap" title={transaction.checkoutId}>
                        {transaction.checkoutId}
                      </div>
                      <div className="text-sm text-[#8E9196] text-right whitespace-nowrap">
                        {transaction.rating > 0 ? transaction.rating : '-'}
                      </div>
                      <div className="text-sm text-[#8E9196] whitespace-nowrap" title={transaction.review}>
                        {transaction.review || '-'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {filteredTransactions.length > 0 && (
          <>
            <Separator className="my-6" />
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                className="gap-2 border-[#E5E7EB] text-[#1A1F2C] hover:bg-[#F8F9FC]"
              >
                See more <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
