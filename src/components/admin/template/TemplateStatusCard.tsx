
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateStatusCardProps {
  status: string;
  isMobile?: boolean;
}

export function TemplateStatusCard({ status, isMobile = false }: TemplateStatusCardProps) {
  const cardClass = isMobile ? "md:hidden" : "hidden md:block";
  
  return (
    <div className={cardClass}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select defaultValue={status || "active"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
