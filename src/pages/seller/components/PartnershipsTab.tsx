
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Users, DollarSign, Link, MessageSquare, Calendar, Check, X, AlertTriangle, Edit, ChevronDown, HelpCircle } from "lucide-react";
import { useExpertPartnerships } from "@/hooks/expert/useExpertPartnerships";
import { usePartnershipMutations } from "@/hooks/expert/usePartnershipMutations";
import { RevokePartnershipDialog } from "@/components/partnerships/RevokePartnershipDialog";

interface PartnershipsTabProps {
  expertUuid?: string;
}

export function PartnershipsTab({
  expertUuid
}: PartnershipsTabProps) {
  const {
    data: partnerships = [],
    isLoading
  } = useExpertPartnerships(expertUuid);
  const {
    updatePartnershipStatus
  } = usePartnershipMutations();
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<any>(null);

  const handleAcceptPartnership = (partnershipUuid: string) => {
    updatePartnershipStatus.mutate({
      partnershipUuid,
      status: 'active'
    });
  };

  const handleRejectPartnership = (partnershipUuid: string) => {
    updatePartnershipStatus.mutate({
      partnershipUuid,
      status: 'rejected'
    });
  };

  const handleRevokePartnership = (partnership: any) => {
    setSelectedPartnership(partnership);
    setRevokeDialogOpen(true);
  };

  const confirmRevokePartnership = () => {
    if (selectedPartnership) {
      updatePartnershipStatus.mutate({
        partnershipUuid: selectedPartnership.affiliate_partnership_uuid,
        status: 'inactive'
      });
      setRevokeDialogOpen(false);
      setSelectedPartnership(null);
    }
  };

  const renderActionButtons = (partnership: any) => {
    const status = partnership.status?.toLowerCase();
    const isUpdating = updatePartnershipStatus.isPending;

    switch (status) {
      case 'pending':
        return (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={() => handleAcceptPartnership(partnership.affiliate_partnership_uuid)}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white border-0 w-full sm:w-auto"
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRejectPartnership(partnership.affiliate_partnership_uuid)}
              disabled={isUpdating}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        );
      case 'active':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRevokePartnership(partnership)}
            disabled={isUpdating}
            className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 w-full sm:w-auto"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Revoke
          </Button>
        );
      default:
        return null;
    }
  };

  const renderQuestionsAnswers = (questionsAnswered: Array<{question: string; answer: string}>) => {
    if (!questionsAnswered || questionsAnswered.length === 0) {
      return (
        <div className="text-sm text-muted-foreground">
          No questions were answered for this partnership.
        </div>
      );
    }

    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Questions & Answers ({questionsAnswered.length})</span>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="space-y-4">
            {questionsAnswered.map((qa, index) => (
              <div key={index} className="border border-border rounded-lg p-3 sm:p-4 bg-background">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">Q</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-relaxed break-words">
                        {qa.question}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-green-600">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground leading-relaxed break-words">
                        {qa.answer || 'No answer provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border border-border">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (partnerships.length === 0) {
    return (
      <div className="space-y-6">
        {/* Informational Card */}
        <Card className="border-dashed border-2 border-border bg-muted/30">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center py-8 sm:py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Edit className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No partnerships yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm sm:text-base">
                Enable affiliate partnerships on your products or communities to allow others to promote your offerings and earn commissions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'pending':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return <Badge variant="outline" className="capitalize">{type}</Badge>;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Informational Card for when there are partnerships */}
        <Card className="border border-border bg-muted/30">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Edit className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1">Looking for new partnerships?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enable affiliate partnerships through your products or communities edit pages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {partnerships.map(partnership => (
          <Card key={partnership.affiliate_partnership_uuid} className="border border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3 flex-1 min-w-0">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground mb-2 break-words">
                      {partnership.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(partnership.type)}
                      {getStatusBadge(partnership.status)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      Created {new Date(partnership.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {renderActionButtons(partnership)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Revenue and Split Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Revenue</p>
                      <p className="text-lg font-semibold text-foreground break-all">${partnership.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Expert Split</p>
                      <p className="text-lg font-semibold text-blue-600">{Math.round(partnership.expert_split * 100)}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Affiliate Split</p>
                      <p className="text-lg font-semibold text-purple-600">{Math.round(partnership.affiliate_split * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                {/* Partner Message */}
                {partnership.message && (
                  <div className="border border-border rounded-lg p-3 sm:p-4 bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-2">Partner Message</p>
                        <p className="text-sm text-muted-foreground leading-relaxed break-words">{partnership.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Questions & Answers */}
                {(partnership.questions_answered && partnership.questions_answered.length > 0) && (
                  <div className="border border-border rounded-lg p-3 sm:p-4 bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-3">Partnership Application</p>
                        {renderQuestionsAnswers(partnership.questions_answered)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Affiliate Link */}
                {partnership.affiliate_link && (
                  <div className="border border-border rounded-lg p-3 sm:p-4 bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Link className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-2">Affiliate Link</p>
                        <div className="bg-background border border-border rounded px-3 py-2">
                          <code className="text-xs text-muted-foreground break-all font-mono">
                            {partnership.affiliate_link}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RevokePartnershipDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        onConfirm={confirmRevokePartnership}
        partnershipName={selectedPartnership?.name || ''}
        isLoading={updatePartnershipStatus.isPending}
      />
    </>
  );
}
