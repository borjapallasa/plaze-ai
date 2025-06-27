import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, PlusCircle, Pencil, Trash2, Loader2, Plus, ArrowLeft, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainHeader } from "@/components/MainHeader";
import { VariantPicker } from "@/components/product/VariantPicker";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductEditor } from "@/components/product/ProductEditor";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { CommunityProduct } from "@/components/community/EditCommunityRelatedProduts";
import { Community } from "@/components/community/CommunityStats";
import { Variant } from "@/components/product/types/variants";
import { Sheet } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/context/CartContext";
import { CommunityProductDialog } from "@/components/community/CommunityProductDialog";
import { ClassroomProductsList } from "@/components/classroom/ClassroomProductsList";

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
    filesLink: null,
    relationshipUuid: item.community_product_relationship_uuid // Make sure this maps correctly
  }));
}

export default function Classroom() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState("basic");
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'classroom' | 'lesson'>('classroom');
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [isDeleteLessonOpen, setIsDeleteLessonOpen] = useState(false);
  const [isEditClassroomOpen, setIsEditClassroomOpen] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const navigate = useNavigate();
  const [newLessonData, setNewLessonData] = useState({
    name: '',
    description: '',
    video_url: ''
  });
  const [editLessonData, setEditLessonData] = useState({
    name: '',
    description: '',
    video_url: ''
  });
  const [editClassroomData, setEditClassroomData] = useState({
    name: '',
    description: '',
    video_url: ''
  });
  const isMobile = useIsMobile();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { toast } = useToast();

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

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

  const { data: community, isLoading: isCommunityLoading } = useQuery<Community | null>({
    queryKey: ['classroom-community', classroom?.community_uuid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('community_uuid', classroom.community_uuid)
        .single();

      console.log('data', data)

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
    queryKey: ['classroomProducts', id],
    queryFn: async () => {
      if (!id) {
        console.error("Classroom ID is missing");
        return [];
      }

      console.log("Fetching classroom products for ID:", id);
      
      const { data, error } = await supabase
        .from('community_product_relationships')
        .select(`
          community_product_relationship_uuid,
          community_product_uuid (
            community_product_uuid, 
            name, 
            price 
          )
        `)
        .eq('classroom_uuid', id);

      if (error) {
        console.error("Error fetching classroom products:", error);
        return [];
      }

      console.log("Raw classroom products data:", data);
      
      // Add debug logging to see what we're actually getting
      data?.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          relationship_uuid: item.community_product_relationship_uuid,
          product_data: item.community_product_uuid
        });
      });
      
      const transformedData = transformToVariant(data);
      console.log("Transformed variants:", transformedData);
      
      return transformedData;
    },
    enabled: !!id
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

  const addLessonMutation = useMutation({
    mutationFn: async (newLesson: any) => {
      const { data, error } = await supabase
        .from('lessons')
        .insert([newLesson])
        .select();

      if (error) {
        console.error("Error adding lesson:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      setNewLessonData({
        name: '',
        description: '',
        video_url: ''
      });
      setIsAddLessonOpen(false);

      queryClient.invalidateQueries({ queryKey: ['classroom-lessons', id] });
      toast({
        title: "Success",
        description: "Lesson added successfully",
      });
    },
    onError: (error) => {
      console.error("Error adding lesson:", error);
      toast({
        title: "Error",
        description: "Failed to add lesson. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ lessonId, lessonData }: { lessonId: string, lessonData: any }) => {
      const { data, error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('lesson_uuid', lessonId)
        .select();

      if (error) {
        console.error("Error updating lesson:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      setIsEditLessonOpen(false);

      if (activeLesson && activeLesson.lesson_uuid === data[0]?.lesson_uuid) {
        setActiveLesson(data[0]);
      }

      queryClient.invalidateQueries({ queryKey: ['classroom-lessons', id] });
      toast({
        title: "Success",
        description: "Lesson updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to update lesson. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('lesson_uuid', lessonId);

      if (error) {
        console.error("Error deleting lesson:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setIsDeleteLessonOpen(false);

      if (activeLesson && lessons && lessons.length > 1) {
        const newActiveLesson = lessons.find(
          lesson => lesson.lesson_uuid !== activeLesson.lesson_uuid
        );
        setActiveLesson(newActiveLesson || null);
      } else {
        setActiveLesson(null);
      }

      setViewMode('classroom');
      queryClient.invalidateQueries({ queryKey: ['classroom-lessons', id] });
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Error",
        description: "Failed to delete lesson. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateClassroomMutation = useMutation({
    mutationFn: async (classroomData: any) => {
      const { data, error } = await supabase
        .from('classrooms')
        .update(classroomData)
        .eq('classroom_uuid', id)
        .select();

      if (error) {
        console.error("Error updating classroom:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      setIsEditClassroomOpen(false);
      queryClient.invalidateQueries({ queryKey: ['classroom', id] });
      toast({
        title: "Success",
        description: "Classroom updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating classroom:", error);
      toast({
        title: "Error",
        description: "Failed to update classroom. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAddLesson = async () => {
    if (!newLessonData.name.trim()) {
      toast({
        title: "Error",
        description: "Lesson name is required",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You need to be logged in to add a lesson",
        variant: "destructive"
      });
      return;
    }

    const newLesson = {
      ...newLessonData,
      classroom_uuid: id,
      user_uuid: user.id
    };

    addLessonMutation.mutate(newLesson);
  };

  const handleEditLesson = () => {
    if (!editLessonData.name.trim()) {
      toast({
        title: "Error",
        description: "Lesson name is required",
        variant: "destructive"
      });
      return;
    }

    if (!activeLesson?.lesson_uuid) {
      toast({
        title: "Error",
        description: "No lesson selected",
        variant: "destructive"
      });
      return;
    }

    updateLessonMutation.mutate({
      lessonId: activeLesson.lesson_uuid,
      lessonData: editLessonData
    });
  };

  const handleDeleteLesson = () => {
    if (!activeLesson?.lesson_uuid) {
      toast({
        title: "Error",
        description: "No lesson selected",
        variant: "destructive"
      });
      return;
    }

    deleteLessonMutation.mutate(activeLesson.lesson_uuid);
  };

  const handleOpenEditClassroom = () => {
    setEditClassroomData({
      name: classroom?.name || '',
      description: classroom?.description || '',
      video_url: classroom?.video_url || ''
    });
    setIsEditClassroomOpen(true);
  };

  const handleEditClassroom = () => {
    if (!editClassroomData.name.trim()) {
      toast({
        title: "Error",
        description: "Classroom name is required",
        variant: "destructive"
      });
      return;
    }

    updateClassroomMutation.mutate(editClassroomData);
  };

  const handleOpenEditLesson = (lesson: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setEditLessonData({
      name: lesson.name || '',
      description: lesson.description || '',
      video_url: lesson.video_url || ''
    });

    setActiveLesson(lesson);
    setIsEditLessonOpen(true);
  };

  const handleOpenDeleteDialog = (lesson: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setActiveLesson(lesson);
    setIsDeleteLessonOpen(true);
  };

  const handleLessonClick = (lesson: any) => {
    setActiveLesson(lesson);
    setViewMode('lesson');
  };

  const handleBackToClassroom = () => {
    setViewMode('classroom');
    setActiveLesson(null);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast({
        title: "Please select a product",
        description: "You need to select a product before adding to cart.",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign up or log in to add items to your cart.",
      });
      navigate("/sign-up");
      return;
    }

    const selectedProduct = variants?.find(v => v.id === selectedVariant);
    if (!selectedProduct) {
      toast({
        title: "Product not found",
        description: "The selected product could not be found.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessingPurchase(true);

      const { data: productData, error: productError } = await supabase
        .from('community_products')
        .select('*')
        .eq('community_product_uuid', selectedProduct.id)
        .single();

      if (productError) {
        throw new Error("Could not retrieve product information");
      }

      if (productData.product_type === 'free' && productData.files_link) {
        console.log('Free product - redirecting to files link:', productData.files_link);
        window.location.href = productData.files_link;
        setIsProcessingPurchase(false);
        return;
      }

      const product = {
        product_uuid: selectedProduct.id,
        name: selectedProduct.name,
        community_product_uuid: selectedProduct.id
      };

      const result = await addToCart(product, selectedProduct.id, [], true);

      if (result?.success && result.payment_link) {
        window.location.href = result.payment_link;
        return;
      } else {
        toast({
          title: "Success",
          description: "Product added to your account."
        });
      }
    } catch (error) {
      console.error('Error processing classroom purchase:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const videoUrl = viewMode === 'lesson' ? activeLesson?.video_url : classroom?.video_url;
  const videoEmbedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null;

  useEffect(() => {
    if (videoUrl) {
      console.log("Original video URL:", videoUrl);
      console.log("Embedded video URL:", videoEmbedUrl);
    }
  }, [videoUrl, videoEmbedUrl]);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const ProductsSection = () => (
    <div className="pt-4 border-t">
      <ClassroomProductsList
        variants={variants}
        className="space-y-2"
        isOwner={isOwner}
        classroomId={id}
        communityUuid={classroom?.community_uuid}
      />
    </div>
  );

  const LessonsList = () => (
    <div className="space-y-2">
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
              viewMode === 'lesson' && activeLesson?.lesson_uuid === lesson.lesson_uuid
                ? "bg-muted"
                : "hover:bg-muted/30"
            )}
            onClick={() => handleLessonClick(lesson)}
          >
            <span className="text-sm pr-16">{lesson.name ? capitalizeFirstLetter(lesson.name) : ''}</span>

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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <MainHeader />
          <div className="container mx-auto px-4 py-8 max-w-[1400px]">
            {isMobile ? (
              <div className="space-y-6">
                <Card className="w-full">
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center text-left text-xl font-semibold py-2"
                          >
                            <span>{classroom?.name ? capitalizeFirstLetter(classroom.name) : ''}</span>
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 text-muted-foreground transition-transform duration-200 ml-2",
                                isExpanded ? "transform rotate-180" : ""
                              )}
                            />
                          </button>
                          <div className="flex items-center gap-2">
                            {isOwner && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleOpenEditClassroom}
                                    className="text-muted-foreground"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit classroom</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {!isExpanded && lessons && lessons.length > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBackToClassroom}
                                    className="text-muted-foreground"
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to view classroom overview</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>

                        <div className={cn(
                          "space-y-2 overflow-hidden transition-all duration-200",
                          isExpanded ? "max-h-[500px]" : "max-h-0"
                        )}>
                          <LessonsList />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-xl flex items-center">
                        {viewMode === 'lesson' && activeLesson && (
                          <Button
                            variant="ghost"
                            onClick={handleBackToClassroom}
                            className="mr-2 p-1 h-auto text-muted-foreground hover:text-foreground"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        )}
                        <span className="font-bold text-black">{classroom?.name ? capitalizeFirstLetter(classroom.name) : ''}</span>
                        {viewMode === 'lesson' && activeLesson && (
                          <>
                            <span className="mx-2 text-gray-400">/</span>
                            <span className="text-gray-500">{activeLesson.name ? capitalizeFirstLetter(activeLesson.name) : ''}</span>
                          </>
                        )}
                      </h2>

                      {videoEmbedUrl ? (
                        <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                          <iframe
                            src={videoEmbedUrl}
                            title={viewMode === 'lesson' ? activeLesson?.name : classroom?.name}
                            className="w-full h-full absolute inset-0"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                          <img
                            src={(viewMode === 'lesson' ? activeLesson?.thumbnail_url : null) || classroom?.thumbnail || "/lovable-uploads/ecaf60f3-4e1d-4836-ab26-8d0f919503e0.png"}
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
                      {((viewMode === 'lesson' && activeLesson?.description) || (viewMode === 'classroom' && classroom?.description)) && (
                        <div className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: viewMode === 'lesson' ? activeLesson?.description : classroom?.description
                          }}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardContent className="p-4">
                    <ProductsSection />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex gap-6">
                <Card className="w-80 flex-shrink-0 h-fit">
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center text-left text-lg font-semibold"
                          >
                            <span>{classroom?.name ? capitalizeFirstLetter(classroom.name) : ''}</span>
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 text-muted-foreground transition-transform duration-200 ml-2",
                                isExpanded ? "transform rotate-180" : ""
                              )}
                            />
                          </button>
                          <div className="flex items-center gap-1">
                            {isOwner && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleOpenEditClassroom}
                                    className="text-muted-foreground"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit classroom</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {!isExpanded && lessons && lessons.length > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBackToClassroom}
                                    className="text-muted-foreground"
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to view classroom overview</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>

                        <div className={cn(
                          "space-y-2 overflow-hidden transition-all duration-200",
                          isExpanded ? "max-h-[500px]" : "max-h-0"
                        )}>
                          <LessonsList />
                        </div>
                      </div>

                      <ProductsSection />
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardContent className="p-6 space-y-6">
                    <h1 className="text-2xl flex items-center">
                      {viewMode === 'lesson' && activeLesson && (
                        <Button
                          variant="ghost"
                          onClick={handleBackToClassroom}
                          className="mr-2 p-1 h-auto text-muted-foreground hover:text-foreground"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      )}
                      <span className="font-bold text-black">{classroom?.name ? capitalizeFirstLetter(classroom.name) : ''}</span>
                      {viewMode === 'lesson' && activeLesson && (
                        <>
                          <span className="mx-2 text-gray-400">/</span>
                          <span className="text-gray-500">{activeLesson.name ? capitalizeFirstLetter(activeLesson.name) : ''}</span>
                        </>
                      )}
                    </h1>

                    <div className="space-y-4">
                      {videoEmbedUrl ? (
                        <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                          <iframe
                            src={videoEmbedUrl}
                            title={viewMode === 'lesson' ? activeLesson?.name : classroom?.name}
                            className="w-full h-full absolute inset-0"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                          <img
                            src={(viewMode === 'lesson' ? activeLesson?.thumbnail_url : null) || classroom?.thumbnail || "/lovable-uploads/ecaf60f3-4e1d-4836-ab26-8d0f919503e0.png"}
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
                      {((viewMode === 'lesson' && activeLesson?.description) || (viewMode === 'classroom' && classroom?.description)) && (
                        <div className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: viewMode === 'lesson' ? activeLesson?.description : classroom?.description
                          }}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Add Lesson Dialog */}
            <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Lesson</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter lesson name"
                      value={newLessonData.name}
                      onChange={(e) => setNewLessonData({ ...newLessonData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <ProductEditor
                      value={newLessonData.description}
                      onChange={(value) => setNewLessonData({ ...newLessonData, description: value })}
                      placeholder="Enter lesson description"
                      minHeight="150px"
                      maxHeight="250px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      placeholder="Enter video URL"
                      value={newLessonData.video_url}
                      onChange={(e) => setNewLessonData({ ...newLessonData, video_url: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleAddLesson}
                    disabled={addLessonMutation.isPending}
                  >
                    {addLessonMutation.isPending ? "Adding..." : "Add Lesson"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Lesson Dialog */}
            <Dialog open={isEditLessonOpen} onOpenChange={setIsEditLessonOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Lesson</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      placeholder="Enter lesson name"
                      value={editLessonData.name}
                      onChange={(e) => setEditLessonData({ ...editLessonData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <ProductEditor
                      value={editLessonData.description}
                      onChange={(value) => setEditLessonData({ ...editLessonData, description: value })}
                      placeholder="Enter lesson description"
                      minHeight="150px"
                      maxHeight="250px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-video_url">Video URL</Label>
                    <Input
                      id="edit-video_url"
                      placeholder="Enter video URL"
                      value={editLessonData.video_url}
                      onChange={(e) => setEditLessonData({ ...editLessonData, video_url: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleEditLesson}
                    disabled={updateLessonMutation.isPending}
                  >
                    {updateLessonMutation.isPending ? "Updating..." : "Update Lesson"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Lesson Confirmation Dialog */}
            <Dialog open={isDeleteLessonOpen} onOpenChange={setIsDeleteLessonOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Lesson</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this lesson? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteLesson}
                    disabled={deleteLessonMutation.isPending}
                  >
                    {deleteLessonMutation.isPending ? "Deleting..." : "Delete Lesson"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Classroom Dialog */}
            <Dialog open={isEditClassroomOpen} onOpenChange={setIsEditClassroomOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Classroom</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="classroom-name">Name</Label>
                    <Input
                      id="classroom-name"
                      placeholder="Enter classroom name"
                      value={editClassroomData.name}
                      onChange={(e) => setEditClassroomData({ ...editClassroomData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classroom-description">Description</Label>
                    <ProductEditor
                      value={editClassroomData.description}
                      onChange={(value) => setEditClassroomData({ ...editClassroomData, description: value })}
                      placeholder="Enter classroom description"
                      minHeight="150px"
                      maxHeight="250px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classroom-video_url">Video URL</Label>
                    <Input
                      id="classroom-video_url"
                      placeholder="Enter video URL"
                      value={editClassroomData.video_url}
                      onChange={(e) => setEditClassroomData({ ...editClassroomData, video_url: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleEditClassroom}
                    disabled={updateClassroomMutation.isPending}
                  >
                    {updateClassroomMutation.isPending ? "Updating..." : "Update Classroom"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Product Creation Dialog */}
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
    </TooltipProvider>
  );
}
