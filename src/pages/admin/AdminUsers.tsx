
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
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastActive: string;
  products: number;
  communities: number;
  totalSales: number;
}

const mockUsers: User[] = [
  {
    id: "1",
    email: "seller@example.com",
    name: "John Seller",
    role: "seller",
    status: "active",
    createdAt: "2/22/2025, 8:06 PM",
    lastActive: "2/23/2025, 8:06 PM",
    products: 5,
    communities: 1,
    totalSales: 1299.99
  },
  {
    id: "2",
    email: "community@example.com",
    name: "Alice Community",
    role: "community",
    status: "pending",
    createdAt: "2/22/2025, 2:23 PM",
    lastActive: "2/22/2025, 3:23 PM",
    products: 0,
    communities: 2,
    totalSales: 0
  },
  {
    id: "3",
    email: "admin@example.com",
    name: "Bob Admin",
    role: "admin",
    status: "active",
    createdAt: "2/16/2025, 3:48 AM",
    lastActive: "2/23/2025, 10:48 AM",
    products: 0,
    communities: 0,
    totalSales: 0
  }
];

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof User>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "seller":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "community":
        return "bg-pink-100 text-pink-800 hover:bg-pink-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

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
                          user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();
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
          <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">All Users</h1>
          <p className="text-[#8E9196]">Manage and review all user accounts</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Search by name or email"
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <ScrollArea className="h-[600px] w-full" type="always">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[2fr,2fr,1fr,1fr,1.5fr,1.5fr,1fr,1fr,1.5fr] gap-4 p-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
                <button 
                  onClick={() => handleSort("email")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Email {getSortIcon("email")}
                </button>
                <button 
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Name {getSortIcon("name")}
                </button>
                <div className="font-medium text-sm text-[#8E9196]">Role</div>
                <div className="font-medium text-sm text-[#8E9196]">Status</div>
                <button 
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Created @ {getSortIcon("createdAt")}
                </button>
                <button 
                  onClick={() => handleSort("lastActive")}
                  className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Last Active {getSortIcon("lastActive")}
                </button>
                <button 
                  onClick={() => handleSort("products")}
                  className="flex items-center justify-end gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Products {getSortIcon("products")}
                </button>
                <button 
                  onClick={() => handleSort("communities")}
                  className="flex items-center justify-end gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Communities {getSortIcon("communities")}
                </button>
                <button 
                  onClick={() => handleSort("totalSales")}
                  className="flex items-center justify-end gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Total Sales {getSortIcon("totalSales")}
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
                      className="grid grid-cols-[2fr,2fr,1fr,1fr,1.5fr,1.5fr,1fr,1fr,1.5fr] gap-4 p-4 hover:bg-[#F8F9FC] cursor-pointer transition-colors duration-200 group"
                      onClick={() => navigate(`/a/admin/users/${user.id}`)}
                    >
                      <div className="text-sm text-[#1A1F2C] truncate" title={user.email}>
                        {user.email}
                      </div>
                      <div className="text-sm text-[#1A1F2C] truncate" title={user.name}>
                        {user.name}
                      </div>
                      <div>
                        <Badge 
                          variant="secondary" 
                          className={`${getRoleColor(user.role)} capitalize`}
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <div>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(user.status)} capitalize`}
                        >
                          {user.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-[#8E9196]">
                        {user.createdAt}
                      </div>
                      <div className="text-sm text-[#8E9196]">
                        {user.lastActive}
                      </div>
                      <div className="text-sm text-[#8E9196] text-right">
                        {user.products}
                      </div>
                      <div className="text-sm text-[#8E9196] text-right">
                        {user.communities}
                      </div>
                      <div className="text-sm text-[#8E9196] text-right">
                        ${user.totalSales.toFixed(2)}
                      </div>
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
