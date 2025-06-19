import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, ShoppingCart, Upload, LayoutGrid, User, Copy, Users, Wallet } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

  // Mock products data for now - will be updated later
  const userProducts = [
    {
      title: "E-commerce Dashboard Template",
      price: "$49.99",
      image: "/placeholder.svg",
      seller: fullName,
      description: "A comprehensive dashboard template for e-commerce applications with React and TypeScript.",
      tags: ["React", "TypeScript", "Dashboard"],
      category: "template",
      split: "70%",
      id: "1",
      slug: "ecommerce-dashboard"
    },
    {
      title: "Mobile App UI Kit",
      price: "$29.99",
      image: "/placeholder.svg",
      seller: fullName,
      description: "Complete UI kit for mobile applications with modern design patterns.",
      tags: ["Mobile", "UI Kit", "Design"],
      category: "design",
      split: "70%",
      id: "2",
      slug: "mobile-ui-kit"
    },
    {
      title: "API Integration Package",
      price: "$79.99",
      image: "/placeholder.svg",
      seller: fullName,
      description: "Ready-to-use API integration package with authentication and error handling.",
      tags: ["API", "Integration", "Backend"],
      category: "package",
      split: "70%",
      id: "3",
      slug: "api-integration"
    },
    {
      title: "Analytics Dashboard",
      price: "$39.99",
      image: "/placeholder.svg",
      seller: fullName,
      description: "Beautiful analytics dashboard with charts and real-time data visualization.",
      tags: ["Analytics", "Charts", "Dashboard"],
      category: "template",
      split: "70%",
      id: "4",
      slug: "analytics-dashboard"
    }
  ];

  // Mock data for communities and earnings
  const userData = {
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
      },
      {
        id: "3",
        name: "UI/UX Professionals",
        role: "Member",
        joinDate: "11/20/2024",
        activityLevel: "High",
        posts: 89
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <User className="h-4 w-4" />
                      <span>Full Name</span>
                    </div>
                    <div className="font-medium pl-6">{fullName}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <Calendar className="h-4 w-4" />
                      <Clock className="h-4 w-4" />
                      <span>Created @</span>
                    </div>
                    <div className="font-medium pl-6">
                      {new Date(user.created_at).toLocaleString()}
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
                      <ShoppingCart className="h-4 w-4" />
                      <span>Spent Amount</span>
                    </div>
                    <div className="font-medium text-lg">${(user.total_spent || 0).toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <DollarSign className="h-4 w-4" />
                      <span>Sales Amount</span>
                    </div>
                    <div className="font-medium text-lg text-blue-600">${(user.total_sales_amount || 0).toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <DollarSign className="h-4 w-4" />
                      <span>Affiliate Fees</span>
                    </div>
                    <div className="font-medium text-lg">${(user.affiliate_fees_amount || 0).toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <Upload className="h-4 w-4" />
                      <span>Total Products</span>
                    </div>
                    <div className="font-medium text-lg">{user.product_count || 0}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <LayoutGrid className="h-4 w-4" />
                      <span>Active Products</span>
                    </div>
                    <div className="font-medium text-lg">{user.active_product_count || 0}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Number of Transactions</span>
                    </div>
                    <div className="font-medium text-lg">{user.transaction_count || 0}</div>
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

          {/* Products Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Products</CardTitle>
                <Button variant="outline" size="sm">
                  Add New Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {userProducts.length > 0 ? (
                <ScrollArea className="w-full">
                  <div className="flex gap-4 pb-4">
                    {userProducts.map((product) => (
                      <div key={product.id} className="w-[300px] flex-shrink-0">
                        <ProductCard
                          title={product.title}
                          price={product.price}
                          image={product.image}
                          seller={product.seller}
                          description={product.description}
                          tags={product.tags}
                          category={product.category}
                          split={product.split}
                          id={product.id}
                          slug={product.slug}
                        />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <p className="text-sm text-[#8E9196] text-center py-8">No products found</p>
              )}
            </CardContent>
          </Card>

          {/* Communities Card */}
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
                  <ScrollArea className="w-full">
                    <div className="flex gap-4 pb-4">
                      {userData.joinedCommunities.map((community) => (
                        <div key={community.id} className="w-[280px] flex-shrink-0">
                          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
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
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-[#8E9196]">No joined communities</p>
                )}
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
