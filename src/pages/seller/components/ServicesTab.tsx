
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ServicesTab() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
        <Button onClick={() => navigate("/seller/service/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Service
        </Button>
      </div>

      <Card className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No services yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first service to start offering consultations or ongoing work.
          </p>
          <Button onClick={() => navigate("/seller/service/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Button>
        </div>
      </Card>
    </div>
  );
}
