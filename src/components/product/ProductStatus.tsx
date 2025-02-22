
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link2, Globe, Mail } from "lucide-react";

export function ProductStatus() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-lg font-medium">Status</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
            Active
          </Badge>
        </div>
        <Button>Save</Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Publishing</h3>
          <Select defaultValue="active">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Sales channels</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>Online Store</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span>Google & YouTube</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>Email Marketing & SMS</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
