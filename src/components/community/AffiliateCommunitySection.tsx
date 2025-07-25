
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useAffiliateCommunities } from "@/hooks/use-affiliate-communities";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Info } from "lucide-react";

interface AffiliateCommunityProps {
  communityUuid?: string;
}

interface Question {
  id: string;
  question: string;
}

export function AffiliateCommunitySection({ communityUuid }: AffiliateCommunityProps) {
  const [isAffiliateProgram, setIsAffiliateProgram] = useState(false);
  const [split, setSplit] = useState([70]); // Default 70% seller, 30% affiliate
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: affiliateCommunities = [], refetch: refetchAffiliateCommunities } = useAffiliateCommunities(communityUuid);

  // Filter to only show active affiliate programs
  const activeAffiliateCommunities = affiliateCommunities.filter(ac => ac.status === 'active');
  
  // Check if community has any active affiliate program
  const hasActiveAffiliateProgram = activeAffiliateCommunities.length > 0;

  // Load existing split and questions if community has active affiliate program
  useEffect(() => {
    if (activeAffiliateCommunities.length > 0) {
      const existingCommunity = activeAffiliateCommunities[0];
      setSplit([Math.round(existingCommunity.expert_share * 100)]);
      
      // Parse questions from JSONB
      if (existingCommunity.questions) {
        const questionsArray = Array.isArray(existingCommunity.questions) 
          ? existingCommunity.questions 
          : Object.entries(existingCommunity.questions || {}).map(([id, question]) => ({
              id,
              question: typeof question === 'string' ? question : String(question)
            }));
        setQuestions(questionsArray);
      }
    }
  }, [activeAffiliateCommunities]);

  // Check if all required fields are filled
  const isFormValid = () => {
    if (!isAffiliateProgram) return false;
    return true;
  };

  const handleConfirm = () => {
    setShowConfirmDialog(true);
  };

  const handleEdit = (affiliateCommunity: any) => {
    setEditingCommunity(affiliateCommunity);
    setSplit([Math.round(affiliateCommunity.expert_share * 100)]);
    
    // Parse questions for editing
    if (affiliateCommunity.questions) {
      const questionsArray = Array.isArray(affiliateCommunity.questions) 
        ? affiliateCommunity.questions 
        : Object.entries(affiliateCommunity.questions || {}).map(([id, question]) => ({
            id,
            question: typeof question === 'string' ? question : String(question)
          }));
      setQuestions(questionsArray);
    }
    setShowEditDialog(true);
  };

  const handleDelete = (affiliateCommunity: any) => {
    setEditingCommunity(affiliateCommunity);
    setShowDeleteDialog(true);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      question: ""
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, question: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, question } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const formatQuestionsForStorage = (questionsArray: Question[]) => {
    const questionsObj: Record<string, string> = {};
    questionsArray.forEach(q => {
      if (q.question.trim()) {
        questionsObj[q.id] = q.question.trim();
      }
    });
    return questionsObj;
  };

  const handleDialogConfirm = async () => {
    if (!communityUuid) {
      toast.error("Missing community information");
      return;
    }

    try {
      setIsLoading(true);

      const expertShare = split[0] / 100;
      const affiliateShare = (100 - split[0]) / 100;
      const formattedQuestions = formatQuestionsForStorage(questions);

      // First, get the community data to extract the expert_uuid
      const { data: communityData, error: communityFetchError } = await supabase
        .from('communities')
        .select('expert_uuid')
        .eq('community_uuid', communityUuid)
        .single();

      if (communityFetchError) {
        console.error('Error fetching community data:', communityFetchError);
        toast.error("Failed to fetch community information");
        return;
      }

      if (!communityData?.expert_uuid) {
        toast.error("Community expert information not found");
        return;
      }

      // Insert into affiliate_products table with community_uuid and expert_uuid
      const { error: affiliateError } = await supabase
        .from('affiliate_products')
        .insert({
          community_uuid: communityUuid,
          expert_uuid: communityData.expert_uuid,
          expert_share: expertShare,
          affiliate_share: affiliateShare,
          status: 'active',
          type: 'community',
          questions: formattedQuestions
        });

      if (affiliateError) {
        console.error('Error creating affiliate community:', affiliateError);
        toast.error("Failed to enable affiliate program");
        return;
      }

      // Update the community to set affiliate_program = true
      const { error: communityError } = await supabase
        .from('communities')
        .update({ affiliate_program: true })
        .eq('community_uuid', communityUuid);

      if (communityError) {
        console.error('Error updating community affiliate program status:', communityError);
        toast.error("Failed to update community affiliate program status");
        return;
      }

      toast.success("Affiliate program enabled successfully");
      setShowConfirmDialog(false);
      setIsAffiliateProgram(false);
      setQuestions([]);
      refetchAffiliateCommunities();

    } catch (error) {
      console.error('Error enabling affiliate program:', error);
      toast.error("Failed to enable affiliate program");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditConfirm = async () => {
    if (!editingCommunity) return;

    try {
      setIsLoading(true);

      const expertShare = split[0] / 100;
      const affiliateShare = (100 - split[0]) / 100;
      const formattedQuestions = formatQuestionsForStorage(questions);

      const { error } = await supabase
        .from('affiliate_products')
        .update({
          expert_share: expertShare,
          affiliate_share: affiliateShare,
          questions: formattedQuestions
        })
        .eq('affiliate_products_uuid', editingCommunity.affiliate_products_uuid);

      if (error) {
        console.error('Error updating affiliate community:', error);
        toast.error("Failed to update affiliate program");
        return;
      }

      toast.success("Affiliate program updated successfully");
      setShowEditDialog(false);
      setEditingCommunity(null);
      setQuestions([]);
      refetchAffiliateCommunities();

    } catch (error) {
      console.error('Error updating affiliate program:', error);
      toast.error("Failed to update affiliate program");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!editingCommunity) return;

    try {
      setIsLoading(true);

      // Set affiliate product status to inactive instead of deleting
      const { error: affiliateError } = await supabase
        .from('affiliate_products')
        .update({ status: 'inactive' })
        .eq('affiliate_products_uuid', editingCommunity.affiliate_products_uuid);

      if (affiliateError) {
        console.error('Error deactivating affiliate community:', affiliateError);
        toast.error("Failed to disable affiliate program");
        return;
      }

      // Update community to set affiliate_program = false
      const { error: communityError } = await supabase
        .from('communities')
        .update({ affiliate_program: false })
        .eq('community_uuid', communityUuid);

      if (communityError) {
        console.error('Error updating community affiliate program status:', communityError);
        toast.error("Failed to update community affiliate program status");
        return;
      }

      toast.success("Affiliate program disabled successfully");
      setShowDeleteDialog(false);
      setEditingCommunity(null);
      setQuestions([]);
      refetchAffiliateCommunities();

    } catch (error) {
      console.error('Error disabling affiliate program:', error);
      toast.error("Failed to disable affiliate program");
    } finally {
      setIsLoading(false);
    }
  };

  const sellerPercentage = split[0];
  const affiliatePercentage = 100 - split[0];

  const QuestionsSection = ({ questions, onUpdate, onAdd, onRemove }: {
    questions: Question[];
    onUpdate: (id: string, question: string) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Questions for Affiliates</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </div>
      <div className="space-y-2">
        {questions.map((q) => (
          <div key={q.id} className="flex gap-2">
            <Input
              value={q.question}
              onChange={(e) => onUpdate(q.id, e.target.value)}
              placeholder="Enter question for affiliates"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemove(q.id)}
              className="h-10 w-10 flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Add questions that affiliates must answer when applying to promote this community.
      </p>
    </div>
  );

  return (
    <>
      <Card className="p-3 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4">Affiliate program</h2>
        
        <div className="space-y-4">
          {/* Display existing active affiliate communities */}
          {activeAffiliateCommunities.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Affiliate program enabled:</Label>
              <div className="space-y-2">
                {activeAffiliateCommunities.map((ac) => (
                  <div key={ac.affiliate_products_uuid} className="p-3 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">Status: {ac.status}</p>
                        <p className="text-sm text-muted-foreground">
                          Expert: {Math.round(ac.expert_share * 100)}% | Affiliate: {Math.round(ac.affiliate_share * 100)}%
                        </p>
                        {ac.questions && Object.keys(ac.questions).length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Questions configured: {Object.keys(ac.questions).length}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(ac)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(ac)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
            </div>
          )}

          {/* Show toggle only if no active affiliate program */}
          {!hasActiveAffiliateProgram && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="affiliate-program-toggle" className="text-base font-medium">
                  Include in affiliate program
                </Label>
                <Switch
                  id="affiliate-program-toggle"
                  checked={isAffiliateProgram}
                  onCheckedChange={setIsAffiliateProgram}
                />
              </div>

              {isAffiliateProgram && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-3">
                    <Label>Split</Label>
                    <div className="space-y-3">
                      <Slider
                        value={split}
                        onValueChange={setSplit}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Seller: {sellerPercentage}%</span>
                        <span>Affiliate: {affiliatePercentage}%</span>
                      </div>
                    </div>
                  </div>

                  <QuestionsSection
                    questions={questions}
                    onUpdate={updateQuestion}
                    onAdd={addQuestion}
                    onRemove={removeQuestion}
                  />

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={handleConfirm} 
                      className="w-full"
                      disabled={!isFormValid()}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Show message if has active affiliate program */}
          {hasActiveAffiliateProgram && !isAffiliateProgram && (
            <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
              This community is already part of the affiliate program. Use the edit button to modify settings.
            </div>
          )}
        </div>
      </Card>

      {/* Edit Dialog - Updated with partnership notice */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Affiliate Program</DialogTitle>
          </DialogHeader>
          
          {/* Add notice about existing partnerships */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Notice</p>
                <p>Changes to the affiliate program settings won't update existing partnerships or partnership requests.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Split</Label>
              <div className="space-y-3">
                <Slider
                  value={split}
                  onValueChange={setSplit}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Seller: {split[0]}%</span>
                  <span>Affiliate: {100 - split[0]}%</span>
                </div>
              </div>
            </div>

            <QuestionsSection
              questions={questions}
              onUpdate={updateQuestion}
              onAdd={addQuestion}
              onRemove={removeQuestion}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditConfirm} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog - Updated with Fair Play Policy */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove from Affiliate Program?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-left">This will remove your community from the affiliate marketplace and stop new partnership requests.</p>
            
            {/* Fair Play Policy Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2 mb-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <h4 className="font-medium text-blue-900">Fair Play Policy</h4>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Partners will still receive commissions for sales in the next 90 days</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Your community won't appear in affiliate deals anymore</span>
                </div>
              </div>
            </div>

            {editingCommunity && (
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="font-medium text-center">Current Revenue Split</p>
                <p className="text-sm text-muted-foreground text-center">
                  You: {Math.round(editingCommunity.expert_share * 100)}% • Partners: {Math.round(editingCommunity.affiliate_share * 100)}%
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="w-full sm:w-auto">
              Keep in Program
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Removing..." : "Remove from Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Adding to Affiliate Program */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Affiliate Program?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-left mb-4">
              Are you sure? This will add your community to the affiliate program and affiliates will be able to request partnerships.
            </p>
            
            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="font-medium mb-2">Revenue Split:</p>
                <p className="text-sm text-muted-foreground">
                  Expert: {sellerPercentage}% | Affiliate: {affiliatePercentage}%
                </p>
              </div>
              
              {questions.length > 0 && (
                <div className="p-3 border rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Questions for affiliates:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {questions.filter(q => q.question.trim()).map((q) => (
                      <li key={q.id}>• {q.question}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} disabled={isLoading}>
              {isLoading ? "Adding..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
