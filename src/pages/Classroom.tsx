
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, PlusCircle, Pencil, Trash2, Plus, BookOpen, Users, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainHeader } from "@/components/MainHeader";
import { VariantPicker } from "@/components/product/VariantPicker";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Community } from "@/components/community/CommunityStats";
import { Variant } from "@/components/product/types/variants";
import { ProductGallery } from "@/components/ProductGallery";
import { CommunityProductDialog } from "@/components/community/CommunityProductDialog";

function transformToVariant(data: any[]): Variant[] {
  return data.map((item) => ({
    id: item.community_product_uuid.community_product_uuid,
    name: item.community_product_uuid.name,
    price: item.community_product_uuid.price ?? 0,
    comparePrice: 0,
    label: item.community_product_uuid.name,
    highlight: false,
    tags: [],
    features: [],
    hidden: false,
    createdAt: null,
    filesLink: null
  }));
}

export default function Classroom() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState("basic");
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("classroom");
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [isDeleteLessonOpen, setIsDeleteLessonOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  console.log('Classroom ID from params:', id);

  const { data: classroom, isLoading: isClassroomLoading } = useQuery({
    queryKey: ['classroom', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('No classroom ID provided');
      }

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

  const { data: community, isLoading: isCommunityLoading } = useQuery<Community | null>({
    queryKey: ['classroom-community', classroom?.community_uuid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('community_uuid', classroom.community_uuid)
        .single();

      if (error) {
        console.error("Error fetching community:", error);
        return null;
      }

      return data as Community;
    },
    enabled: !!classroom?.community_uuid
  });

  useEffect(() => {
    const checkOwnership = async () => {
      if (!user || !classroom || !classroom.expert_uuid) {
        setIsOwner(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('experts')
          .select('user_uuid')
          .eq('expert_uuid', classroom.expert_uuid)
          .single();

        if (error) {
          console.error("Error checking expert ownership:", error);
          setIsOwner(false);
          return;
        }

        setIsOwner(data.user_uuid === user.id);
      } catch (error) {
        console.error("Error in ownership check:", error);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [user, classroom]);

  const { data: variants } = useQuery({
    queryKey: ['classroomCommunityProducts', classroom?.community_uuid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_product_relationships')
        .select(`
          community_product_uuid (
            community_product_uuid, 
            name, 
            price 
          )
        `)
        .eq('community_uuid', classroom.community_uuid);

      if (error) {
        console.error("Error fetching community:", error);
        return [];
      }
      return transformToVariant(data)
    },
    enabled: !!classroom?.community_uuid
  });

  const { data: lessons, isLoading: isLessonsLoading } = useQuery({
    queryKey: ['classroom-lessons', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('No classroom ID provided');
      }

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

  // Handle lesson navigation
  const handleLessonSelect = (lesson: any) => {
    setActiveLesson(lesson);
  };

  const handleBackToClassroom = () => {
    setActiveLesson(null);
  };

  // Placeholder functions for lesson management
  const handleOpenEditLesson = (lesson: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit lesson:', lesson);
    // TODO: Implement edit lesson functionality
  };

  const handleOpenDeleteDialog = (lesson: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete lesson:', lesson);
    // TODO: Implement delete lesson functionality
  };

  const tabs = [
    { id: "classroom", label: "Classroom", icon: BookOpen },
    { id: "community", label: "Community", icon: Users },
    { id: "discussions", label: "Discussions", icon: MessageSquare }
  ];

  // Products section component
  const ProductsSection = () => {
    if (!variants || variants.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Products</h3>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProductDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
        <VariantPicker
          variants={variants}
          selectedVariantId={selectedVariant}
          onVariantSelect={setSelectedVariant}
          showPricing={true}
        />
      </div>
    );
  };

  const ClassroomContent = () => (
    <div className="space-y-6">
      {isMobile ? (
        <div className="space-y-6">
          <Card className="w-full">
            <CardContent className="p-6 space-y-6">
              <div>
                <ProductGallery 
                  images={variants}
                  priority
                />
              </div>

              <div className="space-y-4">
                <div>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between text-left text-xl font-semibold py-2"
                  >
                    <span>{classroom?.name ? classroom.name : ''}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                        isExpanded ? "transform rotate-180" : ""
                      )}
                    />
                  </button>

                  <div className={cn(
                    "space-y-2 overflow-hidden transition-all duration-200 pt-2",
                    isExpanded ? "max-h-[500px]" : "max-h-0"
                  )}>
                    {isLessonsLoading ? (
                      Array(2).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="w-full h-10 bg-muted rounded-lg my-1"></div>
                        </div>
                      ))
                    ) : lessons && lessons.length > 0 ? (
                      lessons.map((lesson) => (
                        <div
                          key={lesson.lesson_uuid}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer group relative",
                            activeLesson?.lesson_uuid === lesson.lesson_uuid
                              ? "bg-muted/50"
                              : "hover:bg-muted/30"
                          )}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <span className="text-sm">{lesson.name ? lesson.name : ''}</span>

                          {isOwner && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleOpenEditLesson(lesson, e)}
                                className="p-1 hover:bg-muted rounded-full"
                                aria-label="Edit lesson"
                              >
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                              <button
                                onClick={(e) => handleOpenDeleteDialog(lesson, e)}
                                className="p-1 hover:bg-muted rounded-full"
                                aria-label="Delete lesson"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground p-2">No lessons available yet</p>
                    )}

                    {isOwner && (
                      <Button
                        variant="outline"
                        className="w-full mt-2 bg-primary/5 border-dashed"
                        onClick={() => setIsAddLessonOpen(true)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Lesson
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl">
                      <span className="font-bold text-black">{classroom?.name ? classroom.name : ''}</span>
                      {activeLesson && (
                        <>
                          <span className="mx-2 text-gray-400">/</span>
                          <span className="text-gray-500">{activeLesson.name ? activeLesson.name : ''}</span>
                        </>
                      )}
                    </h2>
                    {activeLesson && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToClassroom}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        ← Back to Classroom
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {getVideoEmbedUrl(activeLesson?.video_url || classroom?.video_url) ? (
                      <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                        <iframe
                          src={getVideoEmbedUrl(activeLesson?.video_url || classroom?.video_url)}
                          title={activeLesson?.name || classroom?.name}
                          className="w-full h-full absolute inset-0"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                        <img
                          src={activeLesson?.thumbnail_url || classroom?.thumbnail || "/lovable-uploads/ecaf60f3-4e1d-4836-ab26-8d0f919503e0.png"}
                          alt="Course thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {(activeLesson?.description || classroom?.description) && (
                      <div className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: activeLesson?.description || classroom?.description
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex gap-6">
          <Card className="w-80 flex-shrink-0 h-fit">
            <CardContent className="p-4">
              <div className="space-y-6">
                <div>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between text-left text-lg font-semibold mb-2"
                  >
                    <span>{classroom?.name ? classroom.name : ''}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                        isExpanded ? "transform rotate-180" : ""
                      )}
                    />
                  </button>

                  <div className={cn(
                    "space-y-2 overflow-hidden transition-all duration-200",
                    isExpanded ? "max-h-[500px]" : "max-h-0"
                  )}>
                    {isLessonsLoading ? (
                      Array(2).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="w-full h-10 bg-muted rounded-lg my-1"></div>
                        </div>
                      ))
                    ) : lessons && lessons.length > 0 ? (
                      lessons.map((lesson) => (
                        <div
                          key={lesson.lesson_uuid}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer group relative",
                            activeLesson?.lesson_uuid === lesson.lesson_uuid
                              ? "bg-muted"
                              : "hover:bg-muted/30"
                          )}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <span className="text-sm">{lesson.name ? lesson.name : ''}</span>

                          {isOwner && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleOpenEditLesson(lesson, e)}
                                className="p-1 hover:bg-muted rounded-full"
                                aria-label="Edit lesson"
                              >
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                              <button
                                onClick={(e) => handleOpenDeleteDialog(lesson, e)}
                                className="p-1 hover:bg-muted rounded-full"
                                aria-label="Delete lesson"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground p-2">No lessons available yet</p>
                    )}

                    {isOwner && (
                      <Button
                        variant="outline"
                        className="w-full mt-3 bg-primary/5 border-dashed"
                        onClick={() => setIsAddLessonOpen(true)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Lesson
                      </Button>
                    )}
                  </div>
                </div>

                <ProductsSection />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl flex flex-wrap items-center">
                  <span className="font-bold text-black">{classroom?.name ? classroom.name : ''}</span>
                  {activeLesson && (
                    <>
                      <span className="mx-2 text-gray-400">/</span>
                      <span className="text-gray-500">{activeLesson.name ? activeLesson.name : ''}</span>
                    </>
                  )}
                </h1>
                {activeLesson && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToClassroom}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Classroom
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {getVideoEmbedUrl(activeLesson?.video_url || classroom?.video_url) ? (
                  <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                    <iframe
                      src={getVideoEmbedUrl(activeLesson?.video_url || classroom?.video_url)}
                      title={activeLesson?.name || classroom?.name}
                      className="w-full h-full absolute inset-0"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                    <img
                      src={activeLesson?.thumbnail_url || classroom?.thumbnail || "/lovable-uploads/ecaf60f3-4e1d-4836-ab26-8d0f919503e0.png"}
                      alt="Course thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {(activeLesson?.description || classroom?.description) && (
                  <div className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: activeLesson?.description || classroom?.description
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  if (isClassroomLoading || isCommunityLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="classroom" className="mt-6">
              <ClassroomContent />
            </TabsContent>

            <TabsContent value="community" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Community</h2>
                <p className="text-muted-foreground">
                  {community ? (
                    <Link to={`/community/${community.community_uuid}`} className="text-primary hover:underline">
                      Visit {community.name} Community
                    </Link>
                  ) : (
                    "This classroom is not associated with a community."
                  )}
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="discussions" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Discussions</h2>
                <p className="text-muted-foreground">
                  Classroom discussions coming soon...
                </p>
              </Card>
            </TabsContent>
          </Tabs>

          <CommunityProductDialog
            open={isProductDialogOpen}
            onOpenChange={setIsProductDialogOpen}
            communityUuid={community?.community_uuid || ""}
            expertUuid={community?.expert_uuid}
            showTemplateSelector={showTemplateSelector}
          />
        </div>
      </div>
    </div>
  );
}
