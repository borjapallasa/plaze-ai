
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

interface Expert {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  expertise: string[];
  rating: number;
  projectsCompleted: number;
  totalEarnings: number;
  activeProjects: number;
  isVerified: boolean;
  responseRate: number;
  averageResponseTime: string;
  availabilityStatus: "available" | "busy" | "unavailable";
  hourlyRate: number;
  userId: string;
  stripeConnectId: string;
}

const mockExperts: Expert[] = [
  {
    id: "1",
    email: "expert1@example.com",
    fullName: "Sarah Wilson",
    createdAt: "2/22/2025, 8:06 PM",
    expertise: ["UI/UX Design", "Web Development"],
    rating: 4.8,
    projectsCompleted: 45,
    totalEarnings: 25000,
    activeProjects: 3,
    isVerified: true,
    responseRate: 98,
    averageResponseTime: "2 hours",
    availabilityStatus: "available",
    hourlyRate: 85,
    userId: "usr_789",
    stripeConnectId: "connect_789"
  },
  {
    id: "2",
    email: "expert2@example.com",
    fullName: "Michael Chen",
    createdAt: "2/20/2025, 3:15 PM",
    expertise: ["Mobile Development", "Cloud Architecture"],
    rating: 4.9,
    projectsCompleted: 32,
    totalEarnings: 18500,
    activeProjects: 2,
    isVerified: true,
    responseRate: 95,
    averageResponseTime: "1 hour",
    availabilityStatus: "busy",
    hourlyRate: 95,
    userId: "usr_790",
    stripeConnectId: "connect_790"
  }
];

export default function AdminExperts() {
  const navigate = useNavigate();
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

  const getAvailabilityBadge = (status: Expert["availabilityStatus"]) => {
    const badges = {
      available: <Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge>,
      busy: <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Busy</Badge>,
      unavailable: <Badge variant="secondary" className="bg-red-100 text-red-800">Unavailable</Badge>
    };
    return badges[status];
  };

  const filteredExperts = mockExperts
    .filter(expert => {
      const matchesSearch = expert.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          expert.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || expert.availabilityStatus === statusFilter;
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
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-[#E5E7EB] bg-white">
          <ScrollArea className="h-[600px] w-full" type="always">
            <div className="min-w-[2400px]">
              <div className="grid grid-cols-[2fr,2fr,1.5fr,2fr,1fr,1.5fr,1.5fr,1fr,1fr,1fr,1fr,1.5fr,1fr,1.5fr,2fr] px-6 py-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
                <button onClick={() => handleSort("email")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Email</span> {getSortIcon("email")}
                </button>
                <button onClick={() => handleSort("fullName")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Full Name</span> {getSortIcon("fullName")}
                </button>
                <button onClick={() => handleSort("createdAt")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Created @</span> {getSortIcon("createdAt")}
                </button>
                <div className="flex items-center gap-2 font-medium text-sm text-[#8E9196] truncate pr-4">
                  <span className="truncate">Expertise</span>
                </div>
                <button onClick={() => handleSort("rating")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Rating</span> {getSortIcon("rating")}
                </button>
                <button onClick={() => handleSort("projectsCompleted")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Projects</span> {getSortIcon("projectsCompleted")}
                </button>
                <button onClick={() => handleSort("totalEarnings")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Total Earnings</span> {getSortIcon("totalEarnings")}
                </button>
                <button onClick={() => handleSort("activeProjects")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Active</span> {getSortIcon("activeProjects")}
                </button>
                <button onClick={() => handleSort("isVerified")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Verified</span> {getSortIcon("isVerified")}
                </button>
                <button onClick={() => handleSort("responseRate")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Response Rate</span> {getSortIcon("responseRate")}
                </button>
                <button onClick={() => handleSort("hourlyRate")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Hourly Rate</span> {getSortIcon("hourlyRate")}
                </button>
                <div className="flex items-center gap-2 font-medium text-sm text-[#8E9196] truncate pr-4">
                  <span className="truncate">Response Time</span>
                </div>
                <button onClick={() => handleSort("availabilityStatus")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Status</span> {getSortIcon("availabilityStatus")}
                </button>
                <button onClick={() => handleSort("userId")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">User Id</span> {getSortIcon("userId")}
                </button>
                <button onClick={() => handleSort("stripeConnectId")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                  <span className="truncate">Stripe Connect Id</span> {getSortIcon("stripeConnectId")}
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
                      className="grid grid-cols-[2fr,2fr,1.5fr,2fr,1fr,1.5fr,1.5fr,1fr,1fr,1fr,1fr,1.5fr,1fr,1.5fr,2fr] px-6 py-4 hover:bg-[#F8F9FC] cursor-pointer transition-colors duration-200"
                      onClick={() => navigate(`/a/admin/experts/${expert.id}`)}
                    >
                      <div className="text-sm text-[#1A1F2C] truncate pr-4">{expert.email}</div>
                      <div className="text-sm text-[#1A1F2C] truncate pr-4">{expert.fullName}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.createdAt}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">
                        {expert.expertise.join(", ")}
                      </div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.rating}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.projectsCompleted}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">${expert.totalEarnings.toFixed(2)}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.activeProjects}</div>
                      <div className="text-sm flex items-center">
                        {expert.isVerified && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Yes</Badge>}
                      </div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.responseRate}%</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">${expert.hourlyRate}/hr</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.averageResponseTime}</div>
                      <div className="text-sm flex items-center">
                        {getAvailabilityBadge(expert.availabilityStatus)}
                      </div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.userId}</div>
                      <div className="text-sm text-[#8E9196] truncate pr-4">{expert.stripeConnectId}</div>
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
