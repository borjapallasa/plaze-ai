
import { FileText, Link as LinkIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface TransactionFilesProps {
  filesUrl: string;
  guidesUrl: string;
  customRequest?: string;
}

export function TransactionFiles({ filesUrl, guidesUrl, customRequest }: TransactionFilesProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleFileClick = () => {
    if (filesUrl) {
      copyToClipboard(filesUrl, "Project files URL");
    } else {
      toast.error("No project files URL available");
    }
  };

  const handleGuideClick = () => {
    if (guidesUrl) {
      copyToClipboard(guidesUrl, "Project guides URL");
    } else {
      toast.error("No project guides URL available");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Files & Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4 cursor-pointer"
          onClick={handleFileClick}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full shrink-0">
              <FileText className="h-5 w-5 text-[#9b87f5]" />
            </div>
            <div className="min-w-0">
              <div className="font-medium">View Project Files</div>
              <div className="text-sm text-[#8E9196]">Access all project deliverables</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#8E9196] hover:text-[#1A1F2C] shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleFileClick();
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4 cursor-pointer"
          onClick={handleGuideClick}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full shrink-0">
              <LinkIcon className="h-5 w-5 text-[#9b87f5]" />
            </div>
            <div className="min-w-0">
              <div className="font-medium">View Project Guide</div>
              <div className="text-sm text-[#8E9196]">Access setup instructions</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#8E9196] hover:text-[#1A1F2C] shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleGuideClick();
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {customRequest && (
          <div className="mt-6">
            <div className="font-medium mb-3">Custom Requirements</div>
            <div className="p-4 bg-[#F8F9FC] rounded-lg text-[#1A1F2C] break-words">
              {customRequest}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
