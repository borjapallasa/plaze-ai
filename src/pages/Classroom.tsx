
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainHeader } from "@/components/MainHeader";
import { VariantPicker } from "@/components/product/VariantPicker";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";

export default function Classroom() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState("basic");
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const isMobile = useIsMobile();
  const { id } = useParams();
  
  const { data: classroom, isLoading: isClassroomLoading } = useQuery({
    queryKey: ['classroom', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .eq('classroom_uuid', id)
        .single();

      if (error) {
        console.error("Error fetching classroom:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id
  });

  const { data: community, isLoading: isCommunityLoading } = useQuery({
    queryKey: ['classroom-community', classroom?.community_uuid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('name')
        .eq('community_uuid', classroom?.community_uuid)
        .single();

      if (error) {
        console.error("Error fetching community:", error);
        return null;
      }

      return data;
    },
    enabled: !!classroom?.community_uuid
  });

  const { data: lessons, isLoading: isLessonsLoading } = useQuery({
    queryKey: ['classroom-lessons', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('classroom_uuid', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (lessons && lessons.length > 0 && !activeLesson) {
      setActiveLesson(lessons[0]);
    }
  }, [lessons, activeLesson]);

  const variants = [
    { 
      id: "basic",
      name: "Basic Package",
      price: 99.99,
      comparePrice: 149.99,
      label: "Most Popular",
      features: ["Core Course", "Basic Resources"]
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 149.99,
      comparePrice: 199.99,
      label: "Best Value",
      highlight: true,
      features: ["Core Course", "Premium Resources"]
    },
    {
      id: "pro",
      name: "Professional Package",
      price: 199.99,
      comparePrice: 299.99,
      label: "Most Complete",
      features: ["Core Course", "Premium Resources"]
    }
  ];

  const handleAddToCart = () => {
    // Add to cart logic here
  };

  const videoUrl = activeLesson?.video_url || classroom?.video_url;
  const videoEmbedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null;
  
  useEffect(() => {
    if (videoUrl) {
      console.log("Original video URL:", videoUrl);
      console.log("Embedded video URL:", videoEmbedUrl);
    }
  }, [videoUrl, videoEmbedUrl]);

  const LessonsList = () => (
    <div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-2 hover:bg-muted/50 p-2 rounded-lg transition-colors"
      >
        <h3 className="font-medium">{classroom?.name || "Lessons"}</h3>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isExpanded ? "transform rotate-0" : "transform rotate-180"
          )} 
        />
      </button>
      <div className={cn(
        "space-y-1 overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-[500px]" : "max-h-0"
      )}>
        {isLessonsLoading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="w-full h-10 bg-muted rounded-lg my-1"></div>
            </div>
          ))
        ) : lessons && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <button
              key={lesson.lesson_uuid}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                activeLesson?.lesson_uuid === lesson.lesson_uuid
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
              onClick={() => setActiveLesson(lesson)}
            >
              {lesson.name}
            </button>
          ))
        ) : (
          <p className="text-sm text-muted-foreground p-2">No lessons available yet</p>
        )}
      </div>
    </div>
  );

  const ProductsSection = () => (
    <div className="pt-4 border-t">
      <h3 className="font-semibold mb-4">Products in this class</h3>
      <VariantPicker
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        onAddToCart={handleAddToCart}
        className="space-y-2"
      />
    </div>
  );

  const isLoading = isClassroomLoading || (classroom?.community_uuid && isCommunityLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <MainHeader />
          <div className="container mx-auto px-4 py-8 max-w-[1400px]">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <MainHeader />
          <div className="container mx-auto px-4 py-8 max-w-[1400px]">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-xl font-bold">Classroom not found</h1>
                <p className="text-muted-foreground mt-2">
                  The classroom you are looking for does not exist or you don't have access to it.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/communities">Browse Communities</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const TitleWithCommunity = () => (
    <h1 className="font-bold text-2xl md:text-3xl">
      <span className="text-[#1A1F2C] mr-2">
        {classroom.name}
      </span>
      {activeLesson && (
        <>
          <span className="text-muted-foreground mx-1">/</span>
          <span className="text-muted-foreground">
            {activeLesson.name}
          </span>
        </>
      )}
    </h1>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
          {isMobile ? (
            <div className="space-y-6">
              <Card className="w-full">
                <CardContent className="p-6 space-y-6">
                  <TitleWithCommunity />
                  
                  <div className="space-y-4">
                    {videoEmbedUrl ? (
                      <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                        <iframe
                          src={videoEmbedUrl}
                          title={activeLesson?.name || classroom.name}
                          className="w-full h-full absolute inset-0"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                        <img 
                          src={activeLesson?.thumbnail_url || classroom.thumbnail || "/lovable-uploads/ecaf60f3-4e1d-4836-ab26-8d0f919503e0.png"}
                          alt="Course thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                            <div className="w-6 h-6 border-8 border-transparent border-l-primary ml-1" style={{ transform: 'rotate(-45deg)' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {(activeLesson?.description || classroom.description) && (
                      <div className="prose prose-sm max-w-none" 
                        dangerouslySetInnerHTML={{ 
                          __html: activeLesson?.description || classroom.description 
                        }} 
                      />
                    )}
                  </div>

                  <div className="space-y-3 w-full">
                    <Button variant="outline" className="w-full">Edit Classroom Details</Button>
                    <Button className="w-full">Add New Lesson</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardContent className="p-4">
                  <ProductsSection />
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardContent className="p-4">
                  <LessonsList />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex gap-6">
              <Card className="w-80 flex-shrink-0 h-fit">
                <CardContent className="p-4">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-2 text-left leading-snug">{classroom.name}</h2>
                      <div className="h-2 bg-muted rounded-full mb-2">
                        <div className="h-full w-0 bg-primary rounded-full"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">0% complete</p>
                    </div>

                    <LessonsList />

                    <ProductsSection />
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardContent className="p-6 space-y-6">
                  <TitleWithCommunity />
                  
                  <div className="space-y-4">
                    {videoEmbedUrl ? (
                      <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                        <iframe
                          src={videoEmbedUrl}
                          title={activeLesson?.name || classroom.name}
                          className="w-full h-full absolute inset-0"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                        <img 
                          src={activeLesson?.thumbnail_url || classroom.thumbnail || "/lovable-uploads/ecaf60f3-4e1d-4836-ab26-8d0f919503e0.png"}
                          alt="Course thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                            <div className="w-6 h-6 border-8 border-transparent border-l-primary ml-1" style={{ transform: 'rotate(-45deg)' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {(activeLesson?.description || classroom.description) && (
                      <div className="prose prose-sm max-w-none" 
                        dangerouslySetInnerHTML={{ 
                          __html: activeLesson?.description || classroom.description 
                        }} 
                      />
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline">Edit Classroom Details</Button>
                    <Button>Add New Lesson</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
