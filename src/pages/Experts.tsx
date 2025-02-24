
import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { SearchFilters } from "@/components/experts/SearchFilters";

const Experts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: experts, isLoading } = useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <MainHeader />
          <div className="container max-w-6xl mx-auto px-4 py-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <SearchFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Experts List */}
          <div className="space-y-4">
            {experts?.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}

            {experts?.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No experts found. Check back later!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experts;
