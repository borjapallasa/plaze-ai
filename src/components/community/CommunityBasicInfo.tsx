
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Link as LinkIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommunityMediaUpload } from "@/components/community/CommunityMediaUpload";

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
              communityUuid={communityUuid}
              initialImages={communityImages}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
