import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainHeader } from "@/components/MainHeader";
import { Separator } from "@/components/ui/separator";
import { useAdminTransactions, useAdminProductTransactions, useAdminCommunityTransactions, type AdminTransaction } from "@/hooks/use-admin-transactions";

export default function AdminTransactions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof AdminTransaction>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");

  const { data: transactions = [], isLoading, error } = useAdminTransactions();
  const { data: productTransactions = [], isLoading: isLoadingProducts, error: productError } = useAdminProductTransactions();
  const { data: communityTransactions = [], isLoading: isLoadingCommunities, error: communityError } = useAdminCommunityTransactions();

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

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-') as [keyof AdminTransaction, "asc" | "desc"];
    setSortField(field);
    setSortDirection(direction);
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
        
        // Special handling for created_at field - parse dates for proper comparison
        if (sortField === "createdAt") {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          return (aDate.getTime() - bDate.getTime()) * multiplier;
        }
        
        // Handle amount field as numbers
        if (sortField === "amount") {
          return ((aValue as number) - (bValue as number)) * multiplier;
        }
        
        // Handle string fields
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue) * multiplier;
        }
        
        // Handle numeric fields
        if (typeof aValue === "number" && typeof bValue === "number") {
          return (aValue - bValue) * multiplier;
        }
        
        return 0;
      });
  };

  const getFilteredProductTransactions = () => {
    return productTransactions
      .filter(transaction => {
        const matchesSearch = transaction.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            transaction.user.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const multiplier = sortDirection === "asc" ? 1 : -1;
        
        // Special handling for created_at field - parse dates for proper comparison
        if (sortField === "createdAt") {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          return (aDate.getTime() - bDate.getTime()) * multiplier;
        }
        
        // Handle amount field as numbers
        if (sortField === "amount") {
          return ((aValue as number) - (bValue as number)) * multiplier;
        }
        
        // Handle string fields
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue) * multiplier;
        }
        
        // Handle numeric fields
        if (typeof aValue === "number" && typeof bValue === "number") {
          return (aValue - bValue) * multiplier;
        }
        
        return 0;
      });
  };

  const getFilteredCommunityTransactions = () => {
    return communityTransactions
      .filter(transaction => {
        const matchesSearch = transaction.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            transaction.user.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const multiplier = sortDirection === "asc" ? 1 : -1;
        
        // Special handling for created_at field - parse dates for proper comparison
        if (sortField === "createdAt") {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          return (aDate.getTime() - bDate.getTime()) * multiplier;
        }
        
        // Handle amount field as numbers
        if (sortField === "amount") {
          return ((aValue as number) - (bValue as number)) * multiplier;
        }
        
        // Handle string fields
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue) * multiplier;
        }
        
        // Handle numeric fields
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
          placeholder="Search by ID or user"
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
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderTransactionTable = (filteredTransactions: AdminTransaction[], loading: boolean, errorState: any) => {
    if (loading) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-[#8E9196]">
            Loading transactions...
          </div>
        </div>
      );
    }

    if (errorState) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-red-600">
            Error loading transactions: {errorState.message}
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
                  <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                    <button 
                      onClick={() => handleSort("user")}
                      className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
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
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <Link 
                          to={`/admin/transaction/${transaction.linkId}`}
                          className="text-sm text-[#1A1F2C] font-medium truncate hover:underline"
                        >
                          {transaction.concept}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[100px] w-[100px]">
                        <Link 
                          to={`/admin/transaction/${transaction.linkId}`}
                          className="text-sm text-[#8E9196] capitalize whitespace-nowrap hover:underline"
                        >
                          {transaction.type}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[150px] w-[150px]">
                        <Link 
                          to={`/admin/transaction/${transaction.linkId}`}
                          className="text-sm text-[#8E9196] whitespace-nowrap hover:underline"
                        >
                          {transaction.createdAt}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[100px] w-[100px]">
                        <Link 
                          to={`/admin/transaction/${transaction.linkId}`}
                          className="hover:underline"
                        >
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(transaction.status)} capitalize whitespace-nowrap`}
                          >
                            {transaction.status}
                          </Badge>
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[100px] w-[100px]">
                        <Link 
                          to={`/admin/transaction/${transaction.linkId}`}
                          className="text-sm text-[#1A1F2C] font-medium whitespace-nowrap hover:underline"
                        >
                          ${transaction.amount.toFixed(2)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <Link 
                          to={`/admin/transaction/${transaction.linkId}`}
                          className="text-sm text-[#8E9196] truncate block hover:underline"
                          title={transaction.seller}
                        >
                          {transaction.seller}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <Link 
                          to={`/admin/transaction/${transaction.linkId}`}
                          className="text-sm text-[#8E9196] truncate block hover:underline"
                          title={transaction.user}
                        >
                          {transaction.user}
                        </Link>
                      </td>
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

  const renderProductsTable = (filteredTransactions: AdminTransaction[], loading: boolean, errorState: any) => {
    if (loading) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-[#8E9196]">
            Loading transactions...
          </div>
        </div>
      );
    }

    if (errorState) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-red-600">
            Error loading transactions: {errorState.message}
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
                  <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                    <span className="font-medium text-sm text-[#8E9196] whitespace-nowrap">Items</span>
                  </th>
                  <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                    <button 
                      onClick={() => handleSort("amount")}
                      className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                    >
                      Amount {getSortIcon("amount")}
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
                  <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                    <button 
                      onClick={() => handleSort("seller")}
                      className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                    >
                      Seller {getSortIcon("seller")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                    <button 
                      onClick={() => handleSort("user")}
                      className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
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
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#1A1F2C] font-medium truncate hover:underline"
                        >
                          {transaction.concept}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[100px] w-[100px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#8E9196] whitespace-nowrap hover:underline"
                        >
                          {transaction.itemCount || 0}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[100px] w-[100px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#1A1F2C] font-medium whitespace-nowrap hover:underline"
                        >
                          ${transaction.amount.toFixed(2)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[150px] w-[150px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#8E9196] whitespace-nowrap hover:underline"
                        >
                          {transaction.createdAt}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[100px] w-[100px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="hover:underline"
                        >
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(transaction.status)} capitalize whitespace-nowrap`}
                          >
                            {transaction.status}
                          </Badge>
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#8E9196] truncate block hover:underline"
                          title={transaction.seller}
                        >
                          {transaction.seller}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#8E9196] truncate block hover:underline"
                          title={transaction.user}
                        >
                          {transaction.user}
                        </Link>
                      </td>
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

  const renderCommunityTable = (filteredTransactions: AdminTransaction[], loading: boolean, errorState: any) => {
    if (loading) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-[#8E9196]">
            Loading transactions...
          </div>
        </div>
      );
    }

    if (errorState) {
      return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <div className="p-8 text-center text-red-600">
            Error loading transactions: {errorState.message}
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
                  <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                    <button 
                      onClick={() => handleSort("amount")}
                      className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                    >
                      Amount {getSortIcon("amount")}
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
                  <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                    <button 
                      onClick={() => handleSort("seller")}
                      className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                    >
                      Community {getSortIcon("seller")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                    <button 
                      onClick={() => handleSort("user")}
                      className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                    >
                      User {getSortIcon("user")}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#8E9196]">
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
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#1A1F2C] font-medium truncate hover:underline"
                        >
                          {transaction.concept}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[100px] w-[100px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#1A1F2C] font-medium whitespace-nowrap hover:underline"
                        >
                          ${transaction.amount.toFixed(2)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[150px] w-[150px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#8E9196] whitespace-nowrap hover:underline"
                        >
                          {transaction.createdAt}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[100px] w-[100px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="hover:underline"
                        >
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(transaction.status)} capitalize whitespace-nowrap`}
                          >
                            {transaction.status}
                          </Badge>
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#8E9196] truncate block hover:underline"
                          title={transaction.seller}
                        >
                          {transaction.seller}
                        </Link>
                      </td>
                      <td className="px-6 py-4 min-w-[200px] w-[200px]">
                        <Link 
                          to={`/admin/transaction/${transaction.concept}`}
                          className="text-sm text-[#8E9196] truncate block hover:underline"
                          title={transaction.user}
                        >
                          {transaction.user}
                        </Link>
                      </td>
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
        return { data: getFilteredProductTransactions(), loading: isLoadingProducts, error: productError };
      case "communities":
        return { data: getFilteredCommunityTransactions(), loading: isLoadingCommunities, error: communityError };
      default:
        return { data: getFilteredTransactions(), loading: isLoading, error };
    }
  };

  const currentData = getCurrentData();

  const renderCurrentTable = () => {
    switch (activeTab) {
      case "products":
        return renderProductsTable(currentData.data, currentData.loading, currentData.error);
      case "communities":
        return renderCommunityTable(currentData.data, currentData.loading, currentData.error);
      default:
        return renderTransactionTable(currentData.data, currentData.loading, currentData.error);
    }
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">All Transactions</h1>
          <p className="text-[#8E9196]">Manage and review all your transaction records</p>
        </div>

        {/* Custom tabs styling to match the screenshot */}
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
          {renderCurrentTable()}
        </div>

        {currentData.data.length > 0 && (
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
