
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ArrowDown, ArrowUp, Link as LinkIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainHeader } from "@/components/MainHeader";
import { Separator } from "@/components/ui/separator";

interface Expert {
  id: string;
  fullName: string;
  email: string;
  publicProfile: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  creatorId: string;
  activeTemplates: number;
  totalTemplates: number;
}

const mockExperts: Expert[] = [
  {
    id: "1",
    fullName: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    publicProfile: "sarah-wilson",
    status: "active",
    createdAt: "2/22/2025, 8:06 PM",
    creatorId: "usr_789",
    activeTemplates: 3,
    totalTemplates: 5
  },
  {
    id: "2",
    fullName: "Michael Chen",
    email: "michael.chen@example.com",
    publicProfile: "michael-chen",
    status: "active",
    createdAt: "2/20/2025, 3:15 PM",
    creatorId: "usr_790",
    activeTemplates: 2,
    totalTemplates: 4
  }
];

export default function AdminExperts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Expert>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Expert) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Expert) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const getStatusBadge = (status: Expert["status"]) => {
    const badges = {
      active: <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>,
      inactive: <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>,
      pending: <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
    };
    return badges[status];
  };

  const filteredExperts = mockExperts
    .filter(expert => {
      const matchesSearch = expert.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          expert.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || expert.status === statusFilter;
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
          <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">All Experts</h1>
          <p className="text-[#8E9196]">Manage and review all expert profiles</p>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-[#E5E7EB]">
              <SelectValue placeholder="Filter By Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <ScrollArea className="h-[600px] w-full" type="always">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[2fr,2fr,1.5fr,1fr,1.5fr,1.5fr,1fr,1fr] px-6 py-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
                <button onClick={() => handleSort("fullName")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Creator Full Name</span> {getSortIcon("fullName")}
                </button>
                <button onClick={() => handleSort("email")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Creator Email</span> {getSortIcon("email")}
                </button>
                <button onClick={() => handleSort("publicProfile")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Public Profile</span> {getSortIcon("publicProfile")}
                </button>
                <div className="flex items-center gap-2 font-medium text-sm text-[#8E9196] truncate pr-4">
                  <span className="truncate">See Public Profile</span>
                </div>
                <button onClick={() => handleSort("status")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Status</span> {getSortIcon("status")}
                </button>
                <button onClick={() => handleSort("createdAt")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Created @</span> {getSortIcon("createdAt")}
                </button>
                <button onClick={() => handleSort("activeTemplates")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Active Templates</span> {getSortIcon("activeTemplates")}
                </button>
                <button onClick={() => handleSort("totalTemplates")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Templates</span> {getSortIcon("totalTemplates")}
                </button>
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                {filteredExperts.length === 0 ? (
                  <div className="p-8 text-center text-[#8E9196]">
                    No experts found matching your criteria
                  </div>
                ) : (
                  filteredExperts.map((expert, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[2fr,2fr,1.5fr,1fr,1.5fr,1.5fr,1fr,1fr] px-6 py-4 hover:bg-[#F8F9FC] transition-colors duration-200"
                    >
                      <div className="text-sm text-[#1A1F2C] truncate pr-4">{expert.fullName}</div>
                      <div className="text-sm text-[#1A1F2C] truncate pr-4">{expert.email}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.publicProfile}</div>
                      <div className="text-sm flex items-center">
                        <Link 
                          to={`/expert/${expert.publicProfile}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="text-sm flex items-center">
                        {getStatusBadge(expert.status)}
                      </div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.createdAt}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.activeTemplates}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.totalTemplates}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {filteredExperts.length > 0 && (
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
