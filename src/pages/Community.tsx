import React, { useState, useEffect } from "react";
import { Shell } from "@/components/Shell";
import { useAuth } from "@/hooks/use-auth";
import { useCommunity } from "@/hooks/use-community";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddEventDialog } from "@/components/community/AddEventDialog";
import { useUser } from "@/hooks/use-user";
import { CommunityCalendarView } from "@/components/community/CommunityCalendarView";

interface CommunityProps {
  communityId: string;
}

const Community: React.FC<CommunityProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { user: userProfile } = useUser();
  const { community, isLoading, isError } = useCommunity(communityId);
  const [activeTab, setActiveTab] = useState("about");
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching community:", isError);
    }
  }, [isError]);

  if (isLoading) {
    return (
      <Shell>
        <div>Loading community...</div>
      </Shell>
    );
  }

  if (!community) {
    return (
      <Shell>
        <div>Community not found.</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{community.name}</h1>
            <p className="text-muted-foreground">{community.description}</p>
          </div>
          {community?.expert_uuid === user?.user_uuid && (
            <Button onClick={() => alert("Edit community")}>Edit Community</Button>
          )}
        </div>
        <Separator />

        <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            {community?.expert_uuid === user?.user_uuid && (
              <TabsTrigger value="settings">Settings</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="about" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About this Community</h3>
              <p>{community.long_description || "No description provided."}</p>
            </div>
          </TabsContent>
          <TabsContent value="members">
            <div>List of members will go here.</div>
          </TabsContent>
          <TabsContent value="events">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Community Calendar</h3>
                {community?.expert_uuid === user?.user_uuid && (
                  <Button 
                    onClick={() => setShowAddEventDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                )}
              </div>
              
              <CommunityCalendarView 
                events={[]} 
                className="bg-background border border-border rounded-lg p-6"
              />
            </div>
          </TabsContent>
          {community?.expert_uuid === user?.user_uuid && (
            <TabsContent value="settings">
              <div>Community settings will go here.</div>
            </TabsContent>
          )}
        </Tabs>

        <AddEventDialog
          open={showAddEventDialog}
          onOpenChange={setShowAddEventDialog}
          communityId={communityId}
          expertUuid={community.expert_uuid}
        />
      </div>
    </Shell>
  );
};

export default Community;
