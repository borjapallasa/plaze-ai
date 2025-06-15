
import { Play, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useExpertQuery } from "@/hooks/expert/useExpertQuery";

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
  const { data: expert, isLoading: isLoadingExpert } = useExpertQuery(expertUuid);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Template Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-[#8E9196]">Uploaded by</p>
          <div className="flex items-center gap-2">
            {isLoadingExpert ? (
              <p className="text-sm font-medium">Loading...</p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {expert?.name || "Unknown"}
                </p>
                {expert?.email && (
                  <a
                    href={`mailto:${expert.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title={`Send email to ${expert.email}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </>
            )}
          </div>
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

        {projectFiles && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm text-[#8E9196]">Project Files</p>
              <p className="text-sm font-medium break-all">{projectFiles}</p>
            </div>
          </>
        )}

        <Separator />

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
