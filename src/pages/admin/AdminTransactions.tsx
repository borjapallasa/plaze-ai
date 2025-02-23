
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
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
}

const transactions: Transaction[] = [
  {
    templateName: "Automated YouTube Script Rewriter",
    createdAt: "2/22/2025, 8:06 PM",
    buyerEmail: "missioncfwf@yahoo.com"
  },
  {
    templateName: "IG Lead Qualification Chatbot With Manychat Poll",
    createdAt: "2/22/2025, 2:23 PM",
    buyerEmail: "manageautomations@gmail.com"
  },
  {
    templateName: "Automated Onboarding (Contract, Payments & Channels) Process to Discord",
    createdAt: "2/16/2025, 3:48 AM",
    buyerEmail: "freekrai@gmail.com"
  },
  {
    templateName: "Automated SEO Article Writer to Shopify And Wordpress With Airtable Interface",
    createdAt: "2/7/2025, 11:02 PM",
    buyerEmail: "mindoftoto@gmail.com"
  },
  {
    templateName: "Automated YouTube Faceless Channel Video Creation",
    createdAt: "1/24/2025, 9:49 AM",
    buyerEmail: "alexrob350@gmail.com"
  },
  {
    templateName: "Automated YouTube Faceless Channel Video Creation",
    createdAt: "1/21/2025, 12:58 PM",
    buyerEmail: "gibneykeith@gmail.com"
  },
  {
    templateName: "Automated YouTube Faceless Channel Video Creation",
    createdAt: "1/8/2025, 2:41 PM",
    buyerEmail: "philryan84@outlook.com"
  },
  {
    templateName: "Find Customer Email List Of Competitors From Social Media Instagram Account",
    createdAt: "1/8/2025, 2:41 PM",
    buyerEmail: "philryan84@outlook.com"
  },
  {
    templateName: "Automated Onboarding (Contract, Payments & Channels) Process to Discord",
    createdAt: "1/4/2025, 2:07 PM",
    buyerEmail: "phil@qelt.io"
  },
  {
    templateName: "Automated Onboarding (Contract, Payments & Channels) Process to Discord",
    createdAt: "1/4/2025, 2:02 PM",
    buyerEmail: "phil@qelt.io"
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

      {/* Transactions Table */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white">
        {/* Header */}
        <div className="grid grid-cols-[2fr,1fr,1fr] gap-4 p-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
          <div className="font-medium text-sm text-[#8E9196]">Template Name</div>
          <div className="font-medium text-sm text-[#8E9196]">Created @</div>
          <div className="font-medium text-sm text-[#8E9196]">Buyer User</div>
        </div>

        {/* Transactions */}
        <div className="divide-y divide-[#E5E7EB]">
          {filteredTransactions.map((transaction, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr,1fr,1fr] gap-4 p-4 hover:bg-[#F8F9FC] cursor-pointer transition-colors duration-200"
            >
              <div className="text-sm text-[#1A1F2C] line-clamp-1">{transaction.templateName}</div>
              <div className="text-sm text-[#8E9196]">{transaction.createdAt}</div>
              <div className="text-sm text-[#8E9196] line-clamp-1">{transaction.buyerEmail}</div>
            </div>
          ))}
        </div>
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
