import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, User, Copy, MapPin, ExternalLink, X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/admin/useUserDetails";
import { useUserTransactions } from "@/hooks/admin/useUserTransactions";
import { useUserCommunitySubscriptions } from "@/hooks/admin/useUserCommunitySubscriptions";
import { useUpdateCommunitySubscriptionStatus } from "@/hooks/admin/useUpdateCommunitySubscriptionStatus";
import { UpdateSubscriptionStatusDialog } from "@/components/admin/users/UpdateSubscriptionStatusDialog";
import { useState } from "react";
import { toStartCase } from "@/lib/utils";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading, error } = useUserDetails(id || '');
  const { transactions, isLoading: isLoadingTransactions, error: transactionsError } = useUserTransactions(id || '');
  const { data: communitySubscriptions, isLoading: isLoadingCommunities } = useUserCommunitySubscriptions(id || '');
  const updateSubscriptionStatus = useUpdateCommunitySubscriptionStatus();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState<{ id: string; name: string } | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleViewExpertProfile = () => {
    if (user?.expert_uuid) {
      navigate(`/admin/experts/expert/${user.expert_uuid}`);
    }
  };

  const handleViewAffiliateProfile = () => {
    if (user?.affiliate_uuid) {
      navigate(`/admin/affiliates/affiliate/${user.affiliate_uuid}`);
    }
  };

  const handleViewAdminProfile = () => {
    if (user?.admin_uuid) {
      navigate(`/admin/admins/admin/${user.admin_uuid}`);
    }
  };

  const handleDeactivateSubscription = (subscriptionId: string, communityName: string) => {
    setSelectedSubscription({ id: subscriptionId, name: communityName });
  };

  const confirmDeactivation = () => {
    if (selectedSubscription) {
      updateSubscriptionStatus.mutate(
        { subscriptionId: selectedSubscription.id, status: 'inactive' as const },
        {
          onSuccess: () => {
            setSelectedSubscription(null);
          }
        }
      );
    }
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

  const fullName = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name || user.last_name || 'Unnamed User';

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case "products":
        return transactions.filter(t => t.type === "product");
      case "communities":
        return transactions.filter(t => t.type === "community");
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  const tabs = [
    { id: "all", label: "All" },
    { id: "products", label: "Products" },
    { id: "communities", label: "Communities" }
  ];

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
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-16 text-sm pr-8">
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
                      <span className="text-[#8E9196]">Created @:</span>
                      <span className="font-medium">{new Date(user.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial & Usage Statistics */}
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

              {/* User Permissions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">User Permissions</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#8E9196]">Expert</span>
                        {user.is_expert && user.expert_uuid && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleViewExpertProfile}
                            className="text-blue-600 hover:text-blue-800 p-1 h-auto"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {user.is_expert ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">No</Badge>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#8E9196]">Affiliate</span>
                        {user.is_affiliate && user.affiliate_uuid && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleViewAffiliateProfile}
                            className="text-green-600 hover:text-green-800 p-1 h-auto"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {user.is_affiliate ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">No</Badge>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#8E9196]">Admin</span>
                        {user.is_admin && user.admin_uuid && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleViewAdminProfile}
                            className="text-purple-600 hover:text-purple-800 p-1 h-auto"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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

          {/* Financial Activity Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Financial Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Communities Activity */}
              <div>
                <h4 className="text-md font-medium mb-4">Communities Activity</h4>
                {isLoadingCommunities ? (
                  <div className="text-center py-4 text-[#8E9196]">
                    Loading communities...
                  </div>
                ) : communitySubscriptions && communitySubscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {communitySubscriptions.map((subscription) => (
                      <div key={subscription.community_subscription_uuid} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-semibold text-lg text-[#1A1F2C] truncate">
                                {subscription.communities?.name || 'Unknown Community'}
                              </h5>
                              <Badge
                                variant="secondary"
                                className={subscription.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                              >
                                {toStartCase(subscription.status)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm text-[#8E9196]">
                              <div>
                                <span className="block font-medium">Joined:</span>
                                <span>{new Date(subscription.created_at).toLocaleDateString()}</span>
                              </div>
                              {subscription.experts?.name && (
                                <div>
                                  <span className="block font-medium">Expert:</span>
                                  <span>{subscription.experts.name}</span>
                                </div>
                              )}
                              <div>
                                <span className="block font-medium">Price:</span>
                                <span className="font-semibold text-[#1A1F2C]">${(subscription.amount || 0).toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="block font-medium">Spent:</span>
                                <span className="font-semibold text-[#1A1F2C]">${(subscription.total_amount || 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {subscription.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivateSubscription(
                                subscription.community_subscription_uuid,
                                subscription.communities?.name || 'Unknown Community'
                              )}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 ml-4 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#8E9196] border border-gray-200 rounded-lg">
                    No community subscriptions found
                  </div>
                )}
              </div>

              <Separator />

              {/* Transaction History with Custom Styled Tabs */}
              <div>
                <h4 className="text-md font-medium mb-4">Transaction History</h4>
                
                {/* Custom styled tabs */}
                <div className="mb-4">
                  <div className="flex items-center gap-8 border-b border-[#E5E7EB] overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-1 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                            isActive
                              ? 'text-[#1A1F2C] border-[#1A1F2C]'
                              : 'text-[#8E9196] border-transparent hover:text-[#1A1F2C] hover:border-[#8E9196]'
                          }`}
                        >
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isLoadingTransactions ? (
                  <div className="rounded-md border p-8 text-center text-[#8E9196]">
                    Loading transactions...
                  </div>
                ) : transactionsError ? (
                  <div className="rounded-md border p-8 text-center text-red-600">
                    Error loading transactions: {transactionsError.message}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created @</TableHead>
                          <TableHead>Seller</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-[#8E9196] py-8">
                              No transactions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTransactions.map((transaction) => {
                            let linkId = transaction.transaction_uuid;
                            
                            if (transaction.type === 'product' && transaction.products_transactions_uuid) {
                              linkId = transaction.products_transactions_uuid;
                            } else if (transaction.type === 'community' && transaction.community_transaction_uuid) {
                              linkId = transaction.community_transaction_uuid;
                            }
                            
                            return (
                              <TableRow key={transaction.transaction_uuid} className="hover:bg-gray-50">
                                <TableCell className="font-medium max-w-[200px] truncate">
                                  <Link 
                                    to={`/admin/transaction/${linkId}`}
                                    className="text-inherit hover:underline"
                                  >
                                    {transaction.transaction_uuid}
                                  </Link>
                                </TableCell>
                                <TableCell className="font-medium">
                                  <Link 
                                    to={`/admin/transaction/${linkId}`}
                                    className="text-inherit hover:underline"
                                  >
                                    ${transaction.amount.toFixed(2)}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  <Link 
                                    to={`/admin/transaction/${linkId}`}
                                    className="text-inherit hover:underline"
                                  >
                                    <Badge
                                      variant="secondary"
                                      className={transaction.type === 'product' ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}
                                    >
                                      {toStartCase(transaction.type)}
                                    </Badge>
                                  </Link>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <Link 
                                    to={`/admin/transaction/${linkId}`}
                                    className="text-inherit hover:underline"
                                  >
                                    {new Date(transaction.created_at).toLocaleString()}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  <Link 
                                    to={`/admin/transaction/${linkId}`}
                                    className="text-inherit hover:underline"
                                  >
                                    {transaction.seller_name || 'Unknown'}
                                  </Link>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UpdateSubscriptionStatusDialog
        open={!!selectedSubscription}
        onOpenChange={(open) => !open && setSelectedSubscription(null)}
        onConfirm={confirmDeactivation}
        communityName={selectedSubscription?.name || ''}
        isLoading={updateSubscriptionStatus.isPending}
      />
    </>
  );
}
