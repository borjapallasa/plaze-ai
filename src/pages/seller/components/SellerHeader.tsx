
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Award, TrendingUp, ArrowLeft } from "lucide-react";
import { EditExpertDialog } from "./EditExpertDialog";
import { EditExpertStatusDialog } from "./EditExpertStatusDialog";
import { useNavigate } from "react-router-dom";

interface SellerHeaderProps {
  seller: any;
  mode?: 'seller' | 'admin';
}

export function SellerHeader({ seller, mode = 'seller' }: SellerHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (mode === 'admin') {
      navigate('/admin/experts');
    } else {
      navigate('/personal-area');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={seller.thumbnail} alt={seller.name} />
              <AvatarFallback className="text-xl">
                {seller.name?.substring(0, 2)?.toUpperCase() || "EX"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
                  <Badge className={getStatusColor(seller.status)}>
                    {seller.status}
                  </Badge>
                </div>
                
                {seller.title && (
                  <p className="text-lg text-gray-600 mb-2">{seller.title}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {seller.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{seller.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>4.9 (127 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackClick}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                
                {mode === 'admin' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowStatusDialog(true)}
                  >
                    Edit Status
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditDialog(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
            
            {seller.description && (
              <p className="text-gray-700 mb-4">{seller.description}</p>
            )}
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {seller.completed_projects || 0}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Projects Completed</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {seller.client_satisfaction || 0}%
                  </span>
                </div>
                <p className="text-sm text-gray-500">Client Satisfaction</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    ${(seller.sales_amount || 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Total Sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditExpertDialog
        expert={seller}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <EditExpertStatusDialog
        expert={seller}
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      />
    </>
  );
}
