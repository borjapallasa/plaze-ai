
import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  templateName: string;
  deliverables: string[];
  transactionDate: string;
  amount: number;
  rating: number;
}

const transactions: Transaction[] = [
  {
    id: "1",
    templateName: "Find Customer Email List Of Competitors From Social Media Instagram Account",
    deliverables: ["Product"],
    transactionDate: "1/8/2025, 2:41 PM",
    amount: 149.95,
    rating: 0
  },
  {
    id: "2",
    templateName: "Automated YouTube Faceless Channel Video Creation",
    deliverables: ["Product"],
    transactionDate: "1/8/2025, 2:41 PM",
    amount: 399.95,
    rating: 0
  }
];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredTransactions = transactions.filter(transaction =>
    transaction.templateName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (categoryFilter === "all" || transaction.deliverables.includes(categoryFilter))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1000px]">
          <h1 className="text-2xl font-semibold mb-6">All Your Purchases</h1>
          
          {/* Search and Filter Section */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Type here to search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Community Subscription">Community Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card 
                key={transaction.id} 
                className="p-6 hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="grid grid-cols-[2fr,1fr,1fr,auto] items-center gap-8">
                  {/* Name */}
                  <div>
                    <div className="text-sm text-[#888888] mb-1">Name</div>
                    <div className="text-[#333333] font-medium leading-tight">{transaction.templateName}</div>
                  </div>

                  {/* Category */}
                  <div>
                    <div className="text-sm text-[#888888] mb-1">Category</div>
                    <div className="flex flex-wrap gap-2">
                      {transaction.deliverables.map((deliverable, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="bg-[#333333] text-white hover:bg-[#222222] font-normal"
                        >
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <div className="text-sm text-[#888888] mb-1">Date</div>
                    <div className="text-[#333333] font-medium">{transaction.transactionDate}</div>
                  </div>

                  {/* Amount and Review */}
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="text-sm text-[#888888] mb-1">Amount</div>
                      <div className="text-[#333333] font-medium">${transaction.amount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#888888] mb-1">Review</div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= transaction.rating 
                                ? "fill-[#222222] text-[#222222]" 
                                : "fill-[#F1F1F1] text-[#F1F1F1]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
