
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Link as LinkIcon, PlusCircle, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommunityMediaUpload } from "@/components/community/CommunityMediaUpload";
import { Button } from "@/components/ui/button";

interface Link {
  name: string;
  url: string;
}

interface CommunityBasicInfoProps {
  communityName: string;
  setCommunityName: (value: string) => void;
  communityIntro: string;
  setCommunityIntro: (value: string) => void;
  communityDescription: string;
  setCommunityDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  pricePeriod: "monthly" | "yearly";
  setPricePeriod: (value: "monthly" | "yearly") => void;
  webhook: string;
  setWebhook: (value: string) => void;
  communityUuid: string;
  communityImages: Array<{
    id: number;
    url: string;
    storage_path: string;
    is_primary: boolean;
    file_name: string;
  }>;
  links: Link[];
  onLinkChange: (index: number, field: keyof Link, value: string) => void;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
}

export function CommunityBasicInfo({
  communityName,
  setCommunityName,
  communityIntro,
  setCommunityIntro,
  communityDescription,
  setCommunityDescription,
  price,
  setPrice,
  pricePeriod,
  setPricePeriod,
  webhook,
  setWebhook,
  communityUuid,
  communityImages,
  links,
  onLinkChange,
  onAddLink,
  onRemoveLink,
}: CommunityBasicInfoProps) {
  return (
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

        <div className="grid grid-cols-2 gap-6">
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
              className="h-11 w-full"
            />
          </div>
          <div>
            <Label htmlFor="price-period" className="text-base font-medium mb-2 block">
              Billing Period
            </Label>
            <Select value={pricePeriod} onValueChange={setPricePeriod}>
              <SelectTrigger id="price-period" className="h-11 w-full">
                <SelectValue placeholder="Select billing period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Links</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddLink}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Link
            </Button>
          </div>
          <div className="space-y-4">
            {links.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-start">
                <div>
                  <Input
                    placeholder="Link name"
                    value={link.name}
                    onChange={(e) => onLinkChange(index, 'name', e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => onLinkChange(index, 'url', e.target.value)}
                    className="h-11"
                  />
                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveLink(index)}
                      className="flex-shrink-0"
                    >
                      <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-2 block">
            Images
          </Label>
          <div className="space-y-4">
            <CommunityMediaUpload
              communityUuid={communityUuid}
              initialImages={communityImages}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
