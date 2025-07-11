
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClassroomProductsList } from "@/components/classroom/ClassroomProductsList";
import { DeleteClassroomDialog } from "@/components/classroom/DeleteClassroomDialog";
import { useClassroomProducts } from "@/hooks/use-classroom-products";

export default function Classroom() {
  const { id } = useParams<{ id: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch classroom details
  const { data: classroom, isLoading: isLoadingClassroom, error: classroomError } = useQuery({
    queryKey: ['classroom', id],
    queryFn: async () => {
      if (!id) throw new Error('Classroom ID is required');
      
      const { data, error } = await supabase
        .from('classrooms')
        .select(`
          *,
          communities (
            community_uuid,
            name,
            expert_uuid,
            user_uuid
          )
        `)
        .eq('classroom_uuid', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch current user to check ownership
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Use the new classroom products hook
  const { data: variants = [], isLoading: isLoadingProducts } = useClassroomProducts(id || '');

  const isOwner = currentUser && classroom?.communities?.user_uuid === currentUser.id;

  if (isLoadingClassroom) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (classroomError || !classroom) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {classroomError?.message || 'Classroom not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Classroom Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {classroom.name}
            </h1>
            <p className="text-gray-600">
              Part of {classroom.communities?.name}
            </p>
          </div>
          
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
        
        {classroom.description && (
          <p className="text-gray-700 leading-relaxed">
            {classroom.description}
          </p>
        )}
      </div>

      {/* Classroom Products */}
      <div className="bg-white rounded-lg border p-6">
        {isLoadingProducts ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <ClassroomProductsList
            variants={variants}
            isOwner={isOwner}
            classroomId={id}
            communityUuid={classroom.communities?.community_uuid}
          />
        )}
      </div>

      {/* Delete Classroom Dialog */}
      {showDeleteDialog && (
        <DeleteClassroomDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          classroomId={id || ''}
          classroomName={classroom.name || ''}
          communityId={classroom.communities?.community_uuid}
        />
      )}
    </div>
  );
}
