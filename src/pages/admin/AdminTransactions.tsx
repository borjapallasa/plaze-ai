
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainHeader } from "@/components/MainHeader";
import { Separator } from "@/components/ui/separator";
import { useAdminTransactions, type AdminTransaction } from "@/hooks/use-admin-transactions";

export default function AdminTransactions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof AdminTransaction>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");

  const { data: transactions = [], isLoading, error } = useAdminTransactions();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleSort = (field: keyof AdminTransaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof AdminTransaction) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const getFilteredTransactions = (type?: 'product' | 'community') => {
    return transactions
      .filter(transaction => {
        const matchesSearch = transaction.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            transaction.user.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesType = !type || transaction.type === type;
        return matchesSearch && matchesStatus && matchesType;
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
  };

  const renderSearchAndFilter = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
        <Input
          placeholder="Search by ID or user"
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
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderTransactionTable = (filteredTransactions: AdminTransaction[]) => {
    if (isLoading) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-[#8E9196]">
            Loading transactions...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-red-600">
            Error loading transactions: {error.message}
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => handleSort("concept")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                  >
                    ID {getSortIcon("concept")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => handleSort("type")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                  >
                    Type {getSortIcon("type")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                  >
                    Created @ {getSortIcon("createdAt")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="font-medium text-sm text-[#8E9196]">Status</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                  >
                    Amount {getSortIcon("amount")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => handleSort("seller")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                  >
                    Seller {getSortIcon("seller")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => handleSort("user")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                  >
                    User {getSortIcon("user")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#8E9196]">
                    No transactions found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#F8F9FC] transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#1A1F2C] font-medium">
                          {transaction.concept}
                        </span>
                        <button
                          onClick={() => navigate(`/admin/transactions/${transaction.transactionUuid}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-3 w-3 text-[#8E9196] hover:text-[#1A1F2C]" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#8E9196] capitalize">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#8E9196]">
                        {transaction.createdAt}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(transaction.status)} capitalize`}
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#1A1F2C] font-medium">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#8E9196]" title={transaction.seller}>
                        {transaction.seller}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#8E9196]" title={transaction.user}>
                        {transaction.user}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">All Transactions</h1>
          <p className="text-[#8E9196]">Manage and review all your transaction records</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-0">
            {renderSearchAndFilter()}
            {renderTransactionTable(getFilteredTransactions())}
          </TabsContent>
          
          <TabsContent value="products" className="space-y-0">
            {renderSearchAndFilter()}
            {renderTransactionTable(getFilteredTransactions('product'))}
          </TabsContent>
          
          <TabsContent value="communities" className="space-y-0">
            {renderSearchAndFilter()}
            {renderTransactionTable(getFilteredTransactions('community'))}
          </TabsContent>
        </Tabs>

        {getFilteredTransactions().length > 0 && (
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
