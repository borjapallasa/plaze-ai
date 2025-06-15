
import { Play, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplateDemoCardProps {
  demo?: string;
}

export function TemplateDemoCard({ demo }: TemplateDemoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Demo & Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Play className="h-5 w-5 text-[#9b87f5]" />
            </div>
            <div>
              <div className="font-medium">Watch Demo</div>
              <div className="text-sm text-[#8E9196]">See the template in action</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#8E9196] hover:text-[#1A1F2C]"
            onClick={() => demo && window.open(demo, '_blank')}
            disabled={!demo}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
