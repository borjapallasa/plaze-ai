
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { User, Calendar, Link as LinkIcon, Package, Users } from "lucide-react";
import { Expert } from "../../../types/expert";

interface ExpertsListProps {
  experts: Expert[];
  sortField: keyof Expert;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Expert) => void;
}

export function ExpertsList({ experts }: ExpertsListProps) {
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

  const handleExpertClick = (expertUuid: string) => {
    navigate(`/admin/experts/expert/${expertUuid}`);
  };

  return (
    <div className="space-y-4">
      {experts.length === 0 ? (
        <div className="text-center py-8 text-[#8E9196]">
          No experts found matching your criteria
        </div>
      ) : (
        experts.map((expert) => (
          <Card 
            key={expert.expert_uuid}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleExpertClick(expert.expert_uuid)}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                {/* Avatar and basic info - Fixed width */}
                <div className="flex items-start gap-4 w-80 flex-shrink-0">
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {expert.thumbnail ? (
                      <img
                        src={expert.thumbnail}
                        alt={expert.name || 'Expert'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">{expert.name || 'Unnamed Expert'}</h3>
                    {getStatusBadge(expert.status)}
                    <p className="text-[#8E9196] text-sm mt-2 truncate">{expert.title || 'No title'}</p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-20 mx-6" />

                {/* Contact and profile info - Fixed width */}
                <div className="space-y-3 w-80 flex-shrink-0">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-[#8E9196] flex-shrink-0" />
                    <span className="text-[#8E9196] flex-shrink-0">Email:</span>
                    <span className="font-medium truncate">{expert.email || 'No email'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-[#8E9196] flex-shrink-0" />
                    <span className="text-[#8E9196] flex-shrink-0">Profile:</span>
                    <Link 
                      to={`/expert/${expert.slug || expert.expert_uuid}`}
                      className="text-blue-600 hover:text-blue-800 truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Public Profile
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#8E9196] flex-shrink-0" />
                    <span className="text-[#8E9196] flex-shrink-0">Created:</span>
                    <span className="font-medium">{new Date(expert.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-20 mx-6" />

                {/* Stats and metrics - Fixed width */}
                <div className="space-y-3 w-60 flex-shrink-0">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-[#8E9196] flex-shrink-0" />
                    <span className="text-[#8E9196]">Products:</span>
                    <span className="font-medium">{expert.totalTemplates || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-[#8E9196] flex-shrink-0" />
                    <span className="text-[#8E9196]">Communities:</span>
                    <span className="font-medium">{expert.activeTemplates || 0}</span>
                  </div>
                  
                  {expert.location && (
                    <div className="text-sm text-[#8E9196] truncate">
                      📍 {expert.location}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
