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
import { Edit, Trash2, Plus, Info, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [nextQuestionId, setNextQuestionId] = useState(1);

  const { data: affiliateCommunities = [], refetch: refetchAffiliateCommunities } = useAffiliateCommunities(communityUuid);

  // Check if community is already in affiliate program
  const isAlreadyAffiliate = affiliateCommunities.length > 0;

  // Load existing split and questions if community is already in affiliate program
  useEffect(() => {
    if (affiliateCommunities.length > 0) {
      const existingCommunity = affiliateCommunities[0];
      setSplit([Math.round(existingCommunity.expert_share * 100)]);
      
      // Parse questions from JSONB with stable IDs
      if (existingCommunity.questions) {
        const questionsArray = Array.isArray(existingCommunity.questions) 
          ? existingCommunity.questions.map((q: any, index: number) => ({
              id: q.id || `existing_question_${index + 1}`,
              question: typeof q.question === 'string' ? q.question : String(q.question || q)
            }))
          : Object.entries(existingCommunity.questions || {}).map(([key, question], index) => ({
              id: `existing_question_${index + 1}`,
              question: typeof question === 'string' ? question : String(question)
            }));
        setQuestions(questionsArray);
        setNextQuestionId(questionsArray.length + 1);
      }
    }
  }, [affiliateCommunities]);

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
    
    // Parse questions for editing with stable IDs
    if (affiliateCommunity.questions) {
      const questionsArray = Array.isArray(affiliateCommunity.questions) 
        ? affiliateCommunity.questions.map((q: any, index: number) => ({
            id: q.id || `edit_question_${index + 1}`,
            question: typeof q.question === 'string' ? q.question : String(q.question || q)
          }))
        : Object.entries(affiliateCommunity.questions || {}).map(([key, question], index) => ({
            id: `edit_question_${index + 1}`,
            question: typeof question === 'string' ? question : String(question)
          }));
      setQuestions(questionsArray);
      setNextQuestionId(questionsArray.length + 1);
    }
    setShowEditDialog(true);
  };

  const handleDelete = (affiliateCommunity: any) => {
    setEditingCommunity(affiliateCommunity);
    setShowDeleteDialog(true);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `new_question_${nextQuestionId}_${Date.now()}`, // More unique ID
      question: ""
    };
    setQuestions(prev => [...prev, newQuestion]);
    setNextQuestionId(prev => prev + 1);
  };

  const updateQuestion = (id: string, question: string) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => q.id === id ? { ...q, question } : q)
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
  };

  const formatQuestionsForStorage = (questionsArray: Question[]) => {
    // Store as array to preserve IDs and order
    return questionsArray
      .filter(q => q.question.trim())
      .map(q => ({
        id: q.id,
        question: q.question.trim()
      }));
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

      // Insert into affiliate_products table
      const { error: affiliateError } = await supabase
        .from('affiliate_products')
        .insert({
          community_uuid: communityUuid,
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

      // Update the communities table to set affiliate_program = true
      const { error: communityError } = await supabase
        .from('communities')
        .update({ affiliate_program: true })
        .eq('community_uuid', communityUuid);

      if (communityError) {
        console.error('Error updating community affiliate flag:', communityError);
        toast.error("Failed to update community settings");
        return;
      }

      toast.success("Affiliate program enabled successfully");
      setShowConfirmDialog(false);
      setIsAffiliateProgram(false);
      setQuestions([]);
      setNextQuestionId(1);
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
      setNextQuestionId(1);
      refetchAffiliateCommunities();

    } catch (error) {
      console.error('Error updating affiliate program:', error);
      toast.error("Failed to update affiliate program");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!editingCommunity || !communityUuid) return;

    try {
      setIsLoading(true);

      // Update status to inactive instead of deleting
      const { error: affiliateError } = await supabase
        .from('affiliate_products')
        .update({ status: 'inactive' })
        .eq('affiliate_products_uuid', editingCommunity.affiliate_products_uuid);

      if (affiliateError) {
        console.error('Error deactivating affiliate community:', affiliateError);
        toast.error("Failed to remove community from affiliate program");
        return;
      }

      // Update the communities table to set affiliate_program = false
      const { error: communityError } = await supabase
        .from('communities')
        .update({ affiliate_program: false })
        .eq('community_uuid', communityUuid);

      if (communityError) {
        console.error('Error updating community affiliate flag:', communityError);
        toast.error("Failed to update community settings");
        return;
      }

      toast.success("Community removed from affiliate program successfully");
      setShowDeleteDialog(false);
      setEditingCommunity(null);
      setQuestions([]);
      setNextQuestionId(1);
      refetchAffiliateCommunities();

    } catch (error) {
      console.error('Error removing community from affiliate program:', error);
      toast.error("Failed to remove community from affiliate program");
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
          {/* Display existing affiliate communities */}
          {affiliateCommunities.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Affiliate program enabled:</Label>
              <div className="space-y-2">
                {affiliateCommunities.map((ac) => (
                  <div key={ac.affiliate_products_uuid} className="p-3 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">Status: {ac.status}</p>
                        <p className="text-sm text-muted-foreground">
                          Expert: {Math.round(ac.expert_share * 100)}% | Affiliate: {Math.round(ac.affiliate_share * 100)}%
                        </p>
                        {ac.questions && Object.keys(ac.questions).length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Questions configured: {Array.isArray(ac.questions) ? ac.questions.length : Object.keys(ac.questions).length}
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

          {/* Show toggle only if not already in affiliate program */}
          {!isAlreadyAffiliate && (
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

          {/* Show message if already in affiliate program */}
          {isAlreadyAffiliate && !isAffiliateProgram && (
            <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
              This community is already part of the affiliate program. Use the edit button to modify settings.
            </div>
          )}
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Affiliate Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Changes to the revenue split and questions will only apply to new partnership requests. Existing partnerships and pending requests will not be affected.
              </AlertDescription>
            </Alert>

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

      {/* Improved Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {/* Header Section */}
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-gray-900 mb-2">
              Remove from Affiliate Program?
            </DialogTitle>
            <p className="text-gray-600 text-base leading-relaxed">
              This will remove your community from the affiliate marketplace and stop new partnership requests.
            </p>
          </div>
          
          {/* Content Section */}
          <div className="px-6 space-y-6">
            {/* Fair Play Policy Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 text-lg mb-3">Fair Play Policy</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-blue-800 text-base leading-relaxed">Partners will still receive commissions for sales in the next 90 days</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-blue-800 text-base leading-relaxed">Your community won't appear in affiliate deals anymore</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Revenue Split Section */}
            {editingCommunity && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="text-center">
                  <p className="text-gray-700 font-medium text-base mb-2">Current Revenue Split</p>
                  <p className="text-2xl font-bold text-gray-900">
                    You: {Math.round(editingCommunity.expert_share * 100)}% • Partners: {Math.round(editingCommunity.affiliate_share * 100)}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 h-12 text-base font-medium border-gray-300 hover:bg-gray-50"
            >
              Keep in Program
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm} 
              disabled={isLoading}
              className="flex-1 h-12 text-base font-medium bg-red-600 hover:bg-red-700 shadow-sm"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Removing...
                </div>
              ) : (
                "Remove from Program"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Affiliate Program?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50/50 border-blue-200">
              <p className="font-medium text-blue-900 mb-2">Are you sure?</p>
              <p className="text-sm text-blue-800">
                This will add your community to the affiliate program and affiliates will be able to request partnerships.
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">Configuration:</p>
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="text-sm">
                  <span className="font-medium">Revenue Split:</span> {sellerPercentage}% (You) / {affiliatePercentage}% (Affiliate)
                </p>
                {questions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Questions for affiliates:</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {questions.filter(q => q.question.trim()).map((q) => (
                        <li key={q.id}>• {q.question}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} disabled={isLoading}>
              {isLoading ? "Enabling..." : "Yes, Enable Affiliate Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
