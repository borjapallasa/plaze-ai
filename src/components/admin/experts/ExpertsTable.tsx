
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, Link as LinkIcon } from "lucide-react";
import { Expert } from "../../../types/expert";

interface ExpertsTableProps {
  experts: Expert[];
  sortField: keyof Expert;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Expert) => void;
}

export function ExpertsTable({ experts, sortField, sortDirection, onSort }: ExpertsTableProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: Expert["status"]) => {
    const badges = {
      active: <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>,
      inactive: <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>,
      "in review": <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In review</Badge>,
      suspended: <Badge variant="secondary" className="bg-gray-100 text-gray-800">Suspended</Badge>
    };
    return badges[status || "active"];
  };

  const getSortIcon = (field: keyof Expert) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const handleExpertClick = (expertUuid: string) => {
    navigate(`/admin/experts/${expertUuid}`);
  };

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white">
      <ScrollArea className="h-[600px] w-full" type="always">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-[2fr,2fr,1.5fr,1fr,1.5fr,1.5fr,1fr,1fr] px-6 py-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
            <button onClick={() => onSort("name")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Expert Full Name</span> {getSortIcon("name")}
            </button>
            <button onClick={() => onSort("email")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Expert Email</span> {getSortIcon("email")}
            </button>
            <button onClick={() => onSort("slug")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Public Profile</span> {getSortIcon("slug")}
            </button>
            <div className="flex items-center gap-2 font-medium text-sm text-[#8E9196] truncate pr-4">
              <span className="truncate">See Public Profile</span>
            </div>
            <button onClick={() => onSort("status")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Status</span> {getSortIcon("status")}
            </button>
            <button onClick={() => onSort("created_at")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Created @</span> {getSortIcon("created_at")}
            </button>
            <button onClick={() => onSort("activeTemplates")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Active Templates</span> {getSortIcon("activeTemplates")}
            </button>
            <button onClick={() => onSort("totalTemplates")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Templates</span> {getSortIcon("totalTemplates")}
            </button>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {experts.length === 0 ? (
              <div className="p-8 text-center text-[#8E9196]">
                No experts found matching your criteria
              </div>
            ) : (
              experts.map((expert) => (
                <div
                  key={expert.expert_uuid}
                  className="grid grid-cols-[2fr,2fr,1.5fr,1fr,1.5fr,1.5fr,1fr,1fr] px-6 py-4 hover:bg-[#F8F9FC] transition-colors duration-200 cursor-pointer"
                  onClick={() => handleExpertClick(expert.expert_uuid)}
                >
                  <div className="text-sm text-[#1A1F2C] truncate pr-4">{expert.name || 'Unnamed Expert'}</div>
                  <div className="text-sm text-[#1A1F2C] truncate pr-4">{expert.email || 'No email'}</div>
                  <div className="text-sm text-[#8E9196] truncate pr-4">{expert.slug || 'No slug'}</div>
                  <div className="text-sm flex items-center">
                    <Link 
                      to={`/expert/${expert.slug || expert.expert_uuid}`}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="text-sm flex items-center">
                    {getStatusBadge(expert.status)}
                  </div>
                  <div className="text-sm text-[#8E9196] truncate pr-4">
                    {new Date(expert.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm text-[#8E9196] truncate pr-4">{expert.activeTemplates || 0}</div>
                  <div className="text-sm text-[#8E9196] truncate pr-4">{expert.totalTemplates || 0}</div>
                </div>
              ))
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
