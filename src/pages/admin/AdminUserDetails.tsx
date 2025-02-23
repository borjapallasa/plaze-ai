
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, DollarSign, ShoppingCart, Upload, LayoutGrid, User, Copy } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock data - In a real app, this would come from an API
const userData = {
  id: "1",
  email: "seller@example.com",
  firstName: "John",
  lastName: "Seller",
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
};

export default function AdminUserDetails() {
  const { id } = useParams();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/a/admin" className="text-[#8E9196] hover:text-[#1A1F2C]">
            Home
          </Link>
          <span className="text-[#8E9196]">/</span>
          <Link to="/a/admin/users" className="text-[#8E9196] hover:text-[#1A1F2C]">
            Users
          </Link>
          <span className="text-[#8E9196]">/</span>
          <span className="text-[#1A1F2C]">User Details</span>
        </nav>

        {/* Back Button */}
        <Link 
          to="/a/admin/users"
          className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>

        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4">
                <CardTitle className="text-2xl font-semibold">User Details</CardTitle>
                <CardDescription className="text-lg text-[#1A1F2C] break-words">
                  {userData.email}
                </CardDescription>
                
                {/* User ID with Copy Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                  <span className="text-[#8E9196] whitespace-nowrap">User ID:</span>
                  <span className="font-medium flex-1 break-all">{userData.userId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8E9196] hover:text-[#1A1F2C]"
                    onClick={() => copyToClipboard(userData.userId, "User ID")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <User className="h-4 w-4" />
                      <span>Full Name</span>
                    </div>
                    <div className="font-medium pl-6">{userData.fullName}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <Calendar className="h-4 w-4" />
                      <Clock className="h-4 w-4" />
                      <span>Created @</span>
                    </div>
                    <div className="font-medium pl-6">{userData.createdAt}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Financial & Usage Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Spent Amount</span>
                    </div>
                    <div className="font-medium text-lg">${userData.spentAmount.toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <DollarSign className="h-4 w-4" />
                      <span>Sales Amount</span>
                    </div>
                    <div className="font-medium text-lg text-blue-600">${userData.salesAmount.toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <DollarSign className="h-4 w-4" />
                      <span>Affiliate Fees</span>
                    </div>
                    <div className="font-medium text-lg">${userData.affiliateFeesGenerated.toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <Upload className="h-4 w-4" />
                      <span>Templates Uploaded</span>
                    </div>
                    <div className="font-medium text-lg">{userData.templatesUploaded}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <LayoutGrid className="h-4 w-4" />
                      <span>Active Templates</span>
                    </div>
                    <div className="font-medium text-lg">{userData.activeTemplates}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Number of Transactions</span>
                    </div>
                    <div className="font-medium text-lg">{userData.numberOfTransactions}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Permissions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">User Permissions</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-[#8E9196]">Creator</span>
                      {userData.isCreator ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">No</Badge>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-[#8E9196]">Affiliate</span>
                      {userData.isAffiliate ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">No</Badge>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-[#8E9196]">Admin</span>
                      {userData.isAdmin ? (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">No</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline">
                      Edit Admin Permits
                    </Button>
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
