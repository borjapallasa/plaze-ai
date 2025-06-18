
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, Calendar, Link as LinkIcon } from "lucide-react";
import { Expert } from "../../../types/expert";

interface ExpertsGalleryProps {
  experts: Expert[];
  sortField: keyof Expert;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Expert) => void;
}

export function ExpertsGallery({ experts }: ExpertsGalleryProps) {
  const getStatusBadge = (status: Expert["status"]) => {
    const badges = {
      active: <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>,
      inactive: <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>,
      "in review": <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In review</Badge>,
      suspended: <Badge variant="secondary" className="bg-gray-100 text-gray-800">Suspended</Badge>
    };
    return badges[status || "active"];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {experts.length === 0 ? (
        <div className="col-span-full text-center py-8 text-[#8E9196]">
          No experts found matching your criteria
        </div>
      ) : (
        experts.map((expert) => (
          <Link 
            key={expert.expert_uuid}
            to={`/admin/experts/expert/${expert.expert_uuid}`}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center relative">
                  {expert.thumbnail ? (
                    <img
                      src={expert.thumbnail}
                      alt={expert.name || 'Expert'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(expert.status)}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{expert.name || 'Unnamed Expert'}</h3>
                    <p className="text-sm text-[#8E9196] line-clamp-1">{expert.title || 'No title'}</p>
                    <p className="text-xs text-[#8E9196] line-clamp-2 mt-1">{expert.description || 'No description available'}</p>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Email:</span>
                      <span className="font-medium truncate">{expert.email || 'No email'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-3 w-3 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Profile:</span>
                      <span className="text-blue-600 text-xs">
                        View Public Profile
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Created:</span>
                      <span className="font-medium text-xs">{new Date(expert.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
