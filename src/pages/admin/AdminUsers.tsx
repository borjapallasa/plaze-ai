
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

interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  isCreator: boolean;
  isAffiliate: boolean;
  isAdmin: boolean;
  spentAmount: number;
  salesAmount: number;
  affiliateFeesGenerated: number;
  templatesUploaded: number;
  activeTemplates: number;
  numberOfTransactions: number;
  referredBy: string;
  userId: string;
  stripeConnectId: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    email: "seller@example.com",
    fullName: "John Seller",
    createdAt: "2/22/2025, 8:06 PM",
    isCreator: true,
    isAffiliate: false,
    isAdmin: false,
    spentAmount: 0,
    salesAmount: 1299.99,
    affiliateFeesGenerated: 0,
    templatesUploaded: 5,
    activeTemplates: 3,
    numberOfTransactions: 12,
    referredBy: "admin@example.com",
    userId: "usr_123",
    stripeConnectId: "connect_123"
  },
  {
    id: "2",
    email: "affiliate@example.com",
    fullName: "Alice Affiliate",
    createdAt: "2/22/2025, 2:23 PM",
    isCreator: false,
    isAffiliate: true,
    isAdmin: false,
    spentAmount: 299.99,
    salesAmount: 0,
    affiliateFeesGenerated: 150.50,
    templatesUploaded: 0,
    activeTemplates: 0,
    numberOfTransactions: 5,
    referredBy: "",
    userId: "usr_456",
    stripeConnectId: "connect_456"
  }
];

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof User>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof User) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const filteredUsers = mockUsers
    .filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || 
        (roleFilter === "creator" && user.isCreator) ||
        (roleFilter === "affiliate" && user.isAffiliate) ||
        (roleFilter === "admin" && user.isAdmin);
      return matchesSearch && matchesRole;
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
      
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return (aValue === bValue ? 0 : aValue ? 1 : -1) * multiplier;
      }
      
      return 0;
    });

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">All Users</h1>
          <p className="text-[#8E9196]">Manage and review all user accounts</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Search by email or name"
              className="pl-10 border-[#E5E7EB] focus-visible:ring-[#1A1F2C]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] border-[#E5E7EB]">
              <SelectValue placeholder="Filter By Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="creator">Creators</SelectItem>
              <SelectItem value="affiliate">Affiliates</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <ScrollArea className="h-[600px] w-full" type="always">
            <div className="min-w-[2400px]">
              <div className="grid grid-cols-[2fr,2fr,1.5fr,1fr,1fr,1fr,1.5fr,1.5fr,1.5fr,1fr,1fr,1.5fr,2fr,1.5fr,2fr] px-6 py-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
                <button onClick={() => handleSort("email")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">User Email</span> {getSortIcon("email")}
                </button>
                <button onClick={() => handleSort("fullName")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Full Name</span> {getSortIcon("fullName")}
                </button>
                <button onClick={() => handleSort("createdAt")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Created @</span> {getSortIcon("createdAt")}
                </button>
                <button onClick={() => handleSort("isCreator")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Creator</span> {getSortIcon("isCreator")}
                </button>
                <button onClick={() => handleSort("isAffiliate")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Affiliate</span> {getSortIcon("isAffiliate")}
                </button>
                <button onClick={() => handleSort("isAdmin")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Admin</span> {getSortIcon("isAdmin")}
                </button>
                <button onClick={() => handleSort("spentAmount")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Spent Amount</span> {getSortIcon("spentAmount")}
                </button>
                <button onClick={() => handleSort("salesAmount")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Sales Amount</span> {getSortIcon("salesAmount")}
                </button>
                <button onClick={() => handleSort("affiliateFeesGenerated")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Affiliate Fees</span> {getSortIcon("affiliateFeesGenerated")}
                </button>
                <button onClick={() => handleSort("templatesUploaded")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Templates Uploaded</span> {getSortIcon("templatesUploaded")}
                </button>
                <button onClick={() => handleSort("activeTemplates")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Active Templates</span> {getSortIcon("activeTemplates")}
                </button>
                <button onClick={() => handleSort("numberOfTransactions")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Number of Transactions</span> {getSortIcon("numberOfTransactions")}
                </button>
                <button onClick={() => handleSort("referredBy")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Referred By</span> {getSortIcon("referredBy")}
                </button>
                <button onClick={() => handleSort("userId")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">User Id</span> {getSortIcon("userId")}
                </button>
                <button onClick={() => handleSort("stripeConnectId")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Stripe Connect Id</span> {getSortIcon("stripeConnectId")}
                </button>
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-[#8E9196]">
                    No users found matching your criteria
                  </div>
                ) : (
                  filteredUsers.map((user, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[2fr,2fr,1.5fr,1fr,1fr,1fr,1.5fr,1.5fr,1.5fr,1fr,1fr,1.5fr,2fr,1.5fr,2fr] px-6 py-4 hover:bg-[#F8F9FC] cursor-pointer transition-colors duration-200"
                      onClick={() => navigate(`/a/admin/users/${user.id}`)}
                    >
                      <div className="text-sm text-[#1A1F2C] truncate pr-4">{user.email}</div>
                      <div className="text-sm text-[#1A1F2C] truncate pr-4">{user.fullName}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{user.createdAt}</div>
                      <div className="text-sm flex items-center">
                        {user.isCreator && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Yes</Badge>}
                      </div>
                      <div className="text-sm flex items-center">
                        {user.isAffiliate && <Badge variant="secondary" className="bg-green-100 text-green-800">Yes</Badge>}
                      </div>
                      <div className="text-sm flex items-center">
                        {user.isAdmin && <Badge variant="secondary" className="bg-purple-100 text-purple-800">Yes</Badge>}
                      </div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">${user.spentAmount.toFixed(2)}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">${user.salesAmount.toFixed(2)}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">${user.affiliateFeesGenerated.toFixed(2)}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{user.templatesUploaded}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{user.activeTemplates}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{user.numberOfTransactions}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{user.referredBy || '-'}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{user.userId}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{user.stripeConnectId}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {filteredUsers.length > 0 && (
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
