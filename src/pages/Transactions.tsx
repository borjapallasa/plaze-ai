
import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star } from "lucide-react";

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
    deliverables: ["Template + Installation"],
    transactionDate: "1/8/2025, 2:41 PM",
    amount: 149.95,
    rating: 0
  },
  {
    id: "2",
    templateName: "Automated YouTube Faceless Channel Video Creation",
    deliverables: ["Template + Installation"],
    transactionDate: "1/8/2025, 2:41 PM",
    amount: 399.95,
    rating: 0
  }
];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter(transaction =>
    transaction.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1000px]">
          <h1 className="text-2xl font-semibold mb-6">All Your Purchases</h1>
          
          {/* Search Section */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Type here to search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr,1fr,1fr] gap-4">
                  {/* Template Name */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Template Name</div>
                    <div className="font-medium">{transaction.templateName}</div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Deliverables</div>
                    <div className="flex flex-wrap gap-2">
                      {transaction.deliverables.map((deliverable, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="bg-[#FFF4F1] text-[#333333] font-normal"
                        >
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Transaction Date */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Transaction Date</div>
                    <div className="font-medium">{transaction.transactionDate}</div>
                  </div>

                  {/* Amount and Rating */}
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Amount</div>
                      <div className="font-medium">${transaction.amount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Review</div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= transaction.rating 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "fill-gray-200 text-gray-200"
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
