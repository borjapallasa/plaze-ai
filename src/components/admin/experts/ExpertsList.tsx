
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { User, Calendar, Link as LinkIcon } from "lucide-react";
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
    navigate(`/admin/experts/${expertUuid}`);
  };

  return (
    <div className="space-y-6">
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
              <div className="flex gap-6">
                <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {expert.thumbnail ? (
                    <img
                      src={expert.thumbnail}
                      alt={expert.name || 'Expert'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{expert.name || 'Unnamed Expert'}</h3>
                    <p className="text-lg text-[#8E9196] mb-2">{expert.title || 'No title'}</p>
                    <p className="text-[#8E9196] line-clamp-2">{expert.description || 'No description available'}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Email:</span>
                      <span className="font-medium">{expert.email || 'No email'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Profile:</span>
                      <Link 
                        to={`/expert/${expert.slug || expert.expert_uuid}`}
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Public Profile
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Created:</span>
                      <span className="font-medium">{new Date(expert.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(expert.status)}
                    <div className="flex gap-4 text-sm">
                      <span className="text-[#8E9196]">Templates: <span className="font-medium">{expert.totalTemplates || 0}</span></span>
                      <span className="text-[#8E9196]">Active: <span className="font-medium">{expert.activeTemplates || 0}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
