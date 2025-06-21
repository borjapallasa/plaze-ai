
import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ArrowDown, ArrowUp } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserTransaction {
  id: string;
  concept: string;
  type: 'product' | 'community';
  createdAt: string;
  amount: number;
  status: string;
  seller: string;
  itemCount?: number;
  linkId: string;
}

export default function Transactions() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof UserTransaction>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all user's transactions from the transactions table
  const { data: allTransactions = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['user-all-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          created_at,
          amount,
          status,
          type,
          products_transactions_uuid,
          community_subscriptions_transactions_uuid,
          experts!transactions_expert_uuid_fkey(name)
        `)
        .eq('user_uuid', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all transactions:', error);
        return [];
      }

      return data?.map(transaction => ({
        id: transaction.transaction_uuid,
        concept: transaction.transaction_uuid,
        type: transaction.type as 'product' | 'community',
        createdAt: new Date(transaction.created_at).toLocaleDateString(),
        amount: transaction.amount || 0,
        status: transaction.status || 'unknown',
        seller: transaction.experts?.name || 'Unknown',
        linkId: transaction.products_transactions_uuid || transaction.community_subscriptions_transactions_uuid || transaction.transaction_uuid
      })) || [];
    },
    enabled: !!user?.id,
  });

  // Fetch user's product transactions
  const { data: productTransactions = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['user-product-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('products_transactions')
        .select(`
          product_transaction_uuid,
          created_at,
          total_amount,
          status,
          item_count,
          products_transaction_items (
            product_uuid,
            products (
              name,
              experts (
                name
              )
            )
          )
        `)
        .eq('user_uuid', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching product transactions:', error);
        return [];
      }

      return data?.map(transaction => ({
        id: transaction.product_transaction_uuid,
        concept: transaction.product_transaction_uuid,
        type: 'product' as const,
        createdAt: new Date(transaction.created_at).toLocaleDateString(),
        amount: transaction.total_amount || 0,
        status: transaction.status || 'unknown',
        seller: transaction.products_transaction_items?.[0]?.products?.experts?.name || 'Unknown',
        itemCount: transaction.item_count || 0,
        linkId: transaction.product_transaction_uuid
      })) || [];
    },
    enabled: !!user?.id,
  });

  // Fetch user's community transactions from community_subscriptions_transactions table
  const { data: communityTransactions = [], isLoading: isLoadingCommunities } = useQuery({
    queryKey: ['user-community-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('community_subscriptions_transactions')
        .select(`
          community_subscription_transaction_uuid,
          created_at,
          amount,
          community_uuid,
          communities!community_subscriptions_transactions_community_uuid_fkey (
            name
          )
        `)
        .eq('user_uuid', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching community transactions:', error);
        return [];
      }

      return data?.map(transaction => ({
        id: transaction.community_subscription_transaction_uuid,
        concept: transaction.community_subscription_transaction_uuid,
        type: 'community' as const,
        createdAt: new Date(transaction.created_at).toLocaleDateString(),
        amount: transaction.amount || 0,
        status: 'paid', // Community subscription transactions are typically paid
        seller: transaction.communities?.name || 'Unknown Community',
        linkId: transaction.community_subscription_transaction_uuid
      })) || [];
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleSort = (field: keyof UserTransaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-') as [keyof UserTransaction, "asc" | "desc"];
    setSortField(field);
    setSortDirection(direction);
  };

  const getSortIcon = (field: keyof UserTransaction) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const getFilteredTransactions = (type?: 'product' | 'community') => {
    let transactions: UserTransaction[] = [];
    
    if (type === 'product') {
      transactions = productTransactions;
    } else if (type === 'community') {
      transactions = communityTransactions;
    } else {
      transactions = allTransactions;
    }

    return transactions
      .filter(transaction => {
        const matchesSearch = transaction.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            transaction.seller.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const multiplier = sortDirection === "asc" ? 1 : -1;
        
        if (sortField === "createdAt") {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          return (aDate.getTime() - bDate.getTime()) * multiplier;
        }
        
        if (sortField === "amount") {
          return ((aValue as number) - (bValue as number)) * multiplier;
        }
        
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
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
        <Input
          placeholder={activeTab === "communities" ? "Search by ID or community" : "Search by ID or seller"}
          className="pl-10 border-[#E5E7EB] focus-visible:ring-[#1A1F2C]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Select value={`${sortField}-${sortDirection}`} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[200px] border-[#E5E7EB]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Date (Newest First)</SelectItem>
          <SelectItem value="createdAt-asc">Date (Oldest First)</SelectItem>
          <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
          <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px] border-[#E5E7EB]">
          <SelectValue placeholder="Filter By Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderTransactionTable = (filteredTransactions: UserTransaction[], loading: boolean) => {
    if (loading) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-[#8E9196]">
            Loading transactions...
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
        <ScrollArea className="w-full">
          <div className="min-w-[1000px]">
            <table className="w-full">
              <thead className="bg-[#F8F9FC] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                    <button 
                      onClick={() => handleSort("concept")}
                      className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                    >
                      ID {getSortIcon("concept")}
                    </button>
                  </th>
                  {activeTab === "communities" ? (
                    <>
                      <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                        <button 
                          onClick={() => handleSort("seller")}
                          className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                        >
                          Community {getSortIcon("seller")}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left min-w-[150px] w-[150px]">
                        <button 
                          onClick={() => handleSort("createdAt")}
                          className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                        >
                          Created @ {getSortIcon("createdAt")}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                        <button 
                          onClick={() => handleSort("amount")}
                          className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                        >
                          Amount {getSortIcon("amount")}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                        <span className="font-medium text-sm text-[#8E9196] whitespace-nowrap">Status</span>
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                        <button 
                          onClick={() => handleSort("type")}
                          className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                        >
                          Type {getSortIcon("type")}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left min-w-[150px] w-[150px]">
                        <button 
                          onClick={() => handleSort("createdAt")}
                          className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                        >
                          Created @ {getSortIcon("createdAt")}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                        <span className="font-medium text-sm text-[#8E9196] whitespace-nowrap">Status</span>
                      </th>
                      <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                        <button 
                          onClick={() => handleSort("amount")}
                          className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                        >
                          Amount {getSortIcon("amount")}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                        <button 
                          onClick={() => handleSort("seller")}
                          className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                        >
                          Seller {getSortIcon("seller")}
                        </button>
                      </th>
                      {activeTab === "products" && (
                        <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                          <span className="font-medium text-sm text-[#8E9196] whitespace-nowrap">Items</span>
                        </th>
                      )}
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === "communities" ? 5 : (activeTab === "products" ? 7 : 6)} className="px-6 py-8 text-center text-[#8E9196]">
                      No transactions found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#F8F9FC] transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <div className="text-sm text-[#1A1F2C] font-medium truncate">
                          {transaction.concept}
                        </div>
                      </td>
                      {activeTab === "communities" ? (
                        <>
                          <td className="px-6 py-4 min-w-[200px] w-[200px]">
                            <div className="text-sm text-[#8E9196] truncate block" title={transaction.seller}>
                              {transaction.seller}
                            </div>
                          </td>
                          <td className="px-6 py-4 min-w-[150px] w-[150px]">
                            <div className="text-sm text-[#8E9196] whitespace-nowrap">
                              {transaction.createdAt}
                            </div>
                          </td>
                          <td className="px-6 py-4 min-w-[100px] w-[100px]">
                            <div className="text-sm text-[#1A1F2C] font-medium whitespace-nowrap">
                              ${transaction.amount.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 min-w-[100px] w-[100px]">
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusColor(transaction.status)} capitalize whitespace-nowrap`}
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 min-w-[100px] w-[100px]">
                            <div className="text-sm text-[#8E9196] capitalize whitespace-nowrap">
                              {transaction.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 min-w-[150px] w-[150px]">
                            <div className="text-sm text-[#8E9196] whitespace-nowrap">
                              {transaction.createdAt}
                            </div>
                          </td>
                          <td className="px-6 py-4 min-w-[100px] w-[100px]">
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusColor(transaction.status)} capitalize whitespace-nowrap`}
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 min-w-[100px] w-[100px]">
                            <div className="text-sm text-[#1A1F2C] font-medium whitespace-nowrap">
                              ${transaction.amount.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 min-w-[200px] w-[200px]">
                            <div className="text-sm text-[#8E9196] truncate block" title={transaction.seller}>
                              {transaction.seller}
                            </div>
                          </td>
                          {activeTab === "products" && (
                            <td className="px-6 py-4 min-w-[100px] w-[100px]">
                              <div className="text-sm text-[#8E9196] whitespace-nowrap">
                                {transaction.itemCount || 0}
                              </div>
                            </td>
                          )}
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "products":
        return { data: getFilteredTransactions('product'), loading: isLoadingProducts };
      case "communities":
        return { data: getFilteredTransactions('community'), loading: isLoadingCommunities };
      default:
        return { data: getFilteredTransactions(), loading: isLoadingAll };
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="min-h-screen bg-background [perspective:1px] [transform-style:preserve-3d]">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background w-full [backface-visibility:hidden]">
        <MainHeader />
      </div>
      <div className="pt-24 [backface-visibility:hidden]">
        <div className="container mx-auto px-4 py-4 max-w-[1400px]">
          <h1 className="text-2xl font-semibold mb-6">All Your Purchases</h1>

          {/* Custom tabs styling to match the admin design */}
          <div className="w-full mb-6">
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === "all"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === "products"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("communities")}
                className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === "communities"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Communities
              </button>
            </div>
          </div>
          
          <div className="space-y-0">
            {renderSearchAndFilter()}
            {renderTransactionTable(currentData.data, currentData.loading)}
          </div>
        </div>
      </div>
    </div>
  );
}
