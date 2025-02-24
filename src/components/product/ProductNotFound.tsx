
import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/MainHeader";
import { useNavigate } from "react-router-dom";

export function ProductNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the product you're looking for. It may have been removed or the URL might be incorrect.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="inline-flex items-center"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
