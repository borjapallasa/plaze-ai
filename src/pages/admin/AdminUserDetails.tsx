
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, User, Copy, Wallet, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/admin/useUserDetails";

export default function AdminUserDetails() {
  const { id } = useParams();
  const { user, isLoading, error } = useUserDetails(id || '');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5] mx-auto mb-4"></div>
              <p className="text-[#8E9196]">Loading user details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading user details</p>
              <p className="text-[#8E9196]">{error?.message || 'User not found'}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const fullName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user.first_name || user.last_name || 'Unnamed User';

  // Mock data for earnings
  const userData = {
    earnings: {
      total: 8500.00,
      pending: 450.00,
      products: 6200.00,
      community: 1850.00,
      mrr: 450.00,
      recentPayouts: [
        {
          id: "1",
          date: "2/15/2025",
          amount: 750.00
        },
        {
          id: "2",
          date: "2/1/2025",
          amount: 450.00
        }
      ]
    }
  };

  // Calculate total paid out
  const totalPaidOut = userData.earnings.recentPayouts.reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/admin" className="text-[#8E9196] hover:text-[#1A1F2C]">
            Home
          </Link>
          <span className="text-[#8E9196]">/</span>
          <Link to="/admin/users" className="text-[#8E9196] hover:text-[#1A1F2C]">
            Users
          </Link>
          <span className="text-[#8E9196]">/</span>
          <span className="text-[#1A1F2C]">User Details</span>
        </nav>

        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4">
                <CardTitle className="text-2xl font-semibold">User Details</CardTitle>
                <CardDescription className="text-lg text-[#1A1F2C] break-words">
                  {user.email}
                </CardDescription>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                  <span className="text-[#8E9196] whitespace-nowrap">User ID:</span>
                  <span className="font-medium flex-1 break-all">{user.user_uuid}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8E9196] hover:text-[#1A1F2C]"
                    onClick={() => copyToClipboard(user.user_uuid, "User ID")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Full Name:</span>
                      <span className="font-medium">{fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Source:</span>
                      <span className="font-medium">{user.source || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#8E9196]" />
                      <Clock className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Created @:</span>
                      <span className="font-medium">{new Date(user.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Financial & Usage Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <DollarSign className="h-4 w-4" />
                      <span>Total Spent</span>
                    </div>
                    <div className="font-medium text-lg">${(user.total_spent || 0).toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <DollarSign className="h-4 w-4" />
                      <span>Transaction Count</span>
                    </div>
                    <div className="font-medium text-lg">{user.transaction_count || 0}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <DollarSign className="h-4 w-4" />
                      <span>Avg Transaction</span>
                    </div>
                    <div className="font-medium text-lg">
                      {user.transaction_count && user.transaction_count > 0 
                        ? `$${((user.total_spent || 0) / user.transaction_count).toFixed(2)}`
                        : '$0.00'
                      }
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">User Permissions</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-[#8E9196]">Expert</span>
                      {user.is_expert ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">No</Badge>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-[#8E9196]">Affiliate</span>
                      {user.is_affiliate ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">No</Badge>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-[#8E9196]">Admin</span>
                      {user.is_admin ? (
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

          {/* Earnings Details Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Earnings Details</CardTitle>
                <Button variant="outline" size="sm">
                  Request Payout
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-[#F8F9FC] rounded-lg border-2 border-[#9b87f5] space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                    <Wallet className="h-4 w-4" />
                    <span>Total</span>
                  </div>
                  <div className="font-medium text-xl text-[#9b87f5]">
                    ${userData.earnings.total.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                    <Clock className="h-4 w-4" />
                    <span>Pending</span>
                  </div>
                  <div className="font-medium text-lg">
                    ${userData.earnings.pending.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                    <DollarSign className="h-4 w-4" />
                    <span>Products</span>
                  </div>
                  <div className="font-medium text-lg">
                    ${userData.earnings.products.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                    <User className="h-4 w-4" />
                    <span>Community</span>
                  </div>
                  <div className="font-medium text-lg">
                    ${userData.earnings.community.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                    <DollarSign className="h-4 w-4" />
                    <span>MRR</span>
                  </div>
                  <div className="font-medium text-lg">
                    ${userData.earnings.mrr.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Recent Payouts</h4>
                <div className="space-y-2">
                  {userData.earnings.recentPayouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                        <Calendar className="h-4 w-4" />
                        {payout.date}
                      </div>
                      <span className="font-medium">${payout.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-[#8E9196]">Total Paid Out</span>
                  <span className="font-medium">${totalPaidOut.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
