
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, DollarSign, Percent, User, Handshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface AffiliateOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  commissionRate: number;
  commissionType: "percentage" | "fixed";
  rating: number;
  totalAffiliates: number;
  monthlyEarnings: number;
  thumbnail: string;
  status: "active" | "pending" | "paused";
  partnerName: string;
  type?: string;
}

interface RequestPartnershipDialogProps {
  offer: AffiliateOffer;
  children: React.ReactNode;
}

export function RequestPartnershipDialog({ offer, children }: RequestPartnershipDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request partnerships.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First, get the affiliate UUID for the current user
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('affiliate_uuid')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (affiliateError) {
        throw affiliateError;
      }

      if (!affiliateData) {
        toast({
          title: "Affiliate Profile Required",
          description: "Please complete your affiliate profile first.",
          variant: "destructive",
        });
        return;
      }

      // Create the partnership request
      const { error } = await supabase
        .from('affiliate_partnerships')
        .insert({
          affiliate_uuid: affiliateData.affiliate_uuid,
          affiliate_product_uuid: offer.id,
          name: `Partnership Request - ${offer.title}`,
          type: offer.type || 'product',
          status: 'pending',
          message: message.trim() || null,
          affiliate_split: offer.commissionRate / 100, // Convert percentage to decimal
          expert_split: (100 - offer.commissionRate) / 100,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Partnership Request Sent",
        description: `Your partnership request for "${offer.title}" has been submitted for review.`,
      });

      setMessage("");
      setIsOpen(false);
    } catch (error) {
      console.error('Error requesting partnership:', error);
      toast({
        title: "Request Failed",
        description: "Failed to send partnership request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5" />
            Request Partnership
          </DialogTitle>
          <DialogDescription>
            Send a partnership request to promote this product and earn commissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {offer.thumbnail ? (
                    <img
                      src={offer.thumbnail}
                      alt={offer.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight">{offer.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <User className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{offer.partnerName}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Percent className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {offer.commissionRate}% commission
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{offer.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message (Optional)
            </label>
            <Textarea
              id="message"
              placeholder="Tell the product owner why you'd like to partner with them and how you plan to promote their product..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              A personalized message can help increase your chances of approval.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
