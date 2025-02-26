
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

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
  const [thumbnail, setThumbnail] = useState("");

  // Query to fetch community details
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
        setThumbnail(data.thumbnail || "");
      }

      return data;
    },
    enabled: !!id
  });

  // Query to fetch current thumbnail for display in ProductMediaUpload
  const { data: currentImages } = useQuery({
    queryKey: ['communityImage', id],
    queryFn: async () => {
      if (!thumbnail) return [];
      return [{
        id: 1,
        url: thumbnail,
        storage_path: thumbnail.split('/').pop() || '',
        is_primary: true,
        file_name: thumbnail.split('/').pop() || ''
      }];
    },
    enabled: !!thumbnail
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('communities')
        .update({
          name: communityName,
          description: communityDescription,
          intro: communityIntro,
          price: parseFloat(price) || 0,
          webhook: webhook,
          thumbnail: thumbnail
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

  const handleThumbnailUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('community_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('community_images')
        .getPublicUrl(filePath);

      // Update the thumbnail URL in state and database
      setThumbnail(publicUrl);
      const { error: updateError } = await supabase
        .from('communities')
        .update({ thumbnail: publicUrl })
        .eq('community_uuid', id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast({
        title: "Error",
        description: "Failed to upload thumbnail",
        variant: "destructive",
      });
    }
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
                  <Label htmlFor="payment-link" className="text-base font-medium mb-2 block">
                    Payment Link
                  </Label>
                  <Input
                    id="payment-link"
                    value={paymentLink}
                    readOnly
                    disabled
                    className="h-11 bg-muted"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Thumbnail
                  </Label>
                  <div className="space-y-4">
                    {thumbnail && (
                      <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={thumbnail} 
                          alt="Community thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <ProductMediaUpload
                      productUuid={id || ''}
                      onFileSelect={handleThumbnailUpload}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
              <h2 className="text-lg font-semibold tracking-tight mb-4">Community Settings</h2>
              <div className="space-y-4">
                {/* Add additional community settings here */}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
