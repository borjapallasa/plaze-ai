
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Since services table doesn't exist, redirect back
    toast.error("Service editing is not yet implemented");
    navigate("/");
  }, [navigate]);

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Edit Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Service editing is not yet implemented.</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
