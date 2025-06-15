
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TransactionFiles } from "@/pages/admin/components/TransactionFiles";

interface TemplateInfoCardProps {
  expertUuid?: string;
  type?: string;
  createdAt: string;
  projectFiles?: string;
}

export function TemplateInfoCard({ 
  expertUuid, 
  type, 
  createdAt, 
  projectFiles 
}: TemplateInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Template Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-[#8E9196]">Uploaded by</p>
          <p className="text-sm font-medium">{expertUuid || "Unknown"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[#8E9196]">Category</p>
          <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
            {type || "General"}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[#8E9196]">Created @</p>
          <p className="text-sm font-medium">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        <Separator />

        <TransactionFiles
          filesUrl={projectFiles || ""}
          guidesUrl=""
        />

        <div className="pt-4 space-y-3">
          <Button className="w-full gap-2">
            <Play className="h-4 w-4" />
            Activate Template
          </Button>
          <Button variant="outline" className="w-full">
            Edit Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
