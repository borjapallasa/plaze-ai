import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, ShoppingCart, Upload, LayoutGrid, User, Copy, Users, Wallet } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

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
  stripeConnectId: "connect_123",
  ownedCommunities: [
    {
      id: "1",
      name: "Dev Masters",
      revenueMRR: 300,
      members: 120,
      posts: 45,
      price: 15,
      status: "active"
    },
    {
      id: "2",
      name: "Web Dev Hub",
      revenueMRR: 150,
      members: 80,
      posts: 20,
      price: 10,
      status: "active"
    }
  ],
  joinedCommunities: [
    {
      id: "1",
      name: "Design Masters",
      role: "Moderator",
      joinDate: "12/1/2024",
      activityLevel: "High",
      posts: 156
    },
    {
      id: "2",
      name: "Web Dev Hub",
      role: "Member",
      joinDate: "1/15/2025",
      activityLevel: "Medium",
      posts: 45
    }
  ],
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

export default function AdminUserDetails() {
  const { id } = useParams();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Calculate total paid out
  const totalPaidOut = userData.earnings.recentPayouts.reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
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

        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4">
                <CardTitle className="text-2xl font-semibold">User Details</CardTitle>
                <CardDescription className="text-lg text-[#1A1F2C] break-words">
                  {userData.email}
                </CardDescription>
                
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

          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Communities</CardTitle>
                <Button variant="outline" size="sm">
                  Add New Community
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h4 className="text-sm font-medium mb-4">Owned Communities</h4>
                {userData.ownedCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {userData.ownedCommunities.map((community) => (
                      <div key={community.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#8E9196]" />
                            <h4 className="font-medium">{community.name}</h4>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="bg-blue-100 text-blue-800 self-start sm:self-center"
                          >
                            Owner
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                          <div className="space-y-1">
                            <span className="text-xs text-[#8E9196]">Revenue MRR</span>
                            <p className="font-medium text-[#9b87f5]">${community.revenueMRR}/mo</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-[#8E9196]">Members</span>
                            <p className="font-medium">{community.members}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-[#8E9196]">Posts</span>
                            <p className="font-medium">{community.posts}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-[#8E9196]">Price</span>
                            <p className="font-medium">${community.price}/mo</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            Manage Community
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit Price
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#8E9196]">No owned communities</p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Joined Communities</h4>
                {userData.joinedCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userData.joinedCommunities.map((community) => (
                      <div key={community.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#8E9196]" />
                            <h4 className="font-medium">{community.name}</h4>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {community.role}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#8E9196]">Activity Level:</span>
                          <span className="font-medium">{community.activityLevel}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#8E9196]">Total Posts:</span>
                          <span className="font-medium">{community.posts}</span>
                        </div>
                        <div className="text-xs text-[#8E9196] flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined: {community.joinDate}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#8E9196]">No joined communities</p>
                )}
              </div>
            </CardContent>
          </Card>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
                    <DollarSign className="h-4 w-4" />
                    <span>Total</span>
                  </div>
                  <div className="font-medium text-lg">
                    ${totalPaidOut.toFixed(2)}
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
                    <LayoutGrid className="h-4 w-4" />
                    <span>Products</span>
                  </div>
                  <div className="font-medium text-lg">
                    ${userData.earnings.products.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                    <Users className="h-4 w-4" />
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
