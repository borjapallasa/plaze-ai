import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProductEditor } from "@/components/product/ProductEditor";
import { CommunityMediaUpload } from "@/components/community/CommunityMediaUpload";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Copy, Check } from "lucide-react";

export default function EditCommunity() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityIntro, setCommunityIntro] = useState("");
  const [price, setPrice] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [webhook, setWebhook] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('community_uuid', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setCommunityName(data.name || "");
        setCommunityDescription(data.description || "");
        setCommunityIntro(data.intro || "");
        setPrice(data.price?.toString() || "");
        setPaymentLink(data.payment_link || "");
        setWebhook(data.webhook || "");
      }

      return data;
    },
    enabled: !!id
  });

  const { data: communityImages = [] } = useQuery({
    queryKey: ['communityImages', id],
    queryFn: async () => {
      if (!id) return [];

      const { data: images, error } = await supabase
        .from('community_images')
        .select('*')
        .eq('community_uuid', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return images.map(img => ({
        id: img.id,
        url: supabase.storage.from('community_images').getPublicUrl(img.storage_path).data.publicUrl,
        storage_path: img.storage_path,
        is_primary: img.is_primary,
        file_name: img.file_name
      }));
    },
    enabled: !!id
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const primaryImage = communityImages.find(img => img.is_primary);
      
      const { error } = await supabase
        .from('communities')
        .update({
          name: communityName,
          description: communityDescription,
          intro: communityIntro,
          price: parseFloat(price) || 0,
          webhook: webhook,
          thumbnail: primaryImage?.url || null
        })
        .eq('community_uuid', id);

      if (error) throw error;

      toast({
        title: "Changes saved",
        description: "Your community has been updated successfully",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error updating community:', error);
      toast({
        title: "Error",
        description: "Failed to update community",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyPaymentLink = async () => {
    if (!paymentLink) return;
    
    try {
      await navigator.clipboard.writeText(paymentLink);
      setHasCopied(true);
      toast({
        description: "Payment link copied to clipboard",
      });
      
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mt-16 p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/communities" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Communities
          </Link>
          <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <Card className="p-4 sm:p-6">
              <div className="space-y-8">
                <div>
                  <Label htmlFor="name" className="text-base font-medium mb-2 block">
                    Community Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your community name"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    className="h-11"
                  />
                </div>
                
                <div>
                  <Label htmlFor="intro" className="text-base font-medium mb-2 flex items-center gap-2">
                    Introduction Link <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <Input
                    id="intro"
                    placeholder="Enter introduction link"
                    value={communityIntro}
                    onChange={(e) => setCommunityIntro(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-medium mb-2 block">
                    Description
                  </Label>
                  <ProductEditor 
                    value={communityDescription}
                    onChange={setCommunityDescription}
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-base font-medium mb-2 block">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter community price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-11 w-full max-w-[200px]"
                  />
                </div>

                <div>
                  <Label htmlFor="webhook" className="text-base font-medium mb-2 block">
                    Webhook URL
                  </Label>
                  <Input
                    id="webhook"
                    placeholder="Enter webhook URL"
                    value={webhook}
                    onChange={(e) => setWebhook(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Images
                  </Label>
                  <div className="space-y-4">
                    <CommunityMediaUpload
                      communityUuid={id || ''}
                      initialImages={communityImages}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
              <h2 className="text-lg font-semibold tracking-tight mb-4">Community Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Link</p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={paymentLink}
                      readOnly
                      className="h-9 text-sm font-medium bg-muted"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      onClick={handleCopyPaymentLink}
                    >
                      {hasCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-xl font-semibold">{formatNumber(community?.product_count)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Classrooms</p>
                    <p className="text-xl font-semibold">{formatNumber(community?.classroom_count)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posts</p>
                    <p className="text-xl font-semibold">{formatNumber(community?.post_count)}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="text-xl font-semibold">
                        {formatCurrency(community?.monthly_recurring_revenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-xl font-semibold">
                        {formatCurrency(community?.total_revenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Paid Members</p>
                      <p className="text-xl font-semibold">{formatNumber(community?.paid_member_count)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-xl font-semibold">{formatNumber(community?.member_count)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
