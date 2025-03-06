
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NotFoundState() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-muted/40">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Community Not Found</h2>
        <p className="text-muted-foreground mb-4">The community you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/communities")}>Browse Communities</Button>
      </div>
    </div>
  );
}
