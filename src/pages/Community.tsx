import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/lib/subscription";
import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { ThreadCard } from "@/components/community/ThreadCard";
import { ThreadDialog } from "@/components/ThreadDialog";
import { CreateThreadDialog } from "@/components/community/CreateThreadDialog";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { supabase } from "@/integrations/supabase/client";

export default function Community() {
  const { user } = useAuth();
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("threads");
  const [selectedThread, setSelectedThread] = useState<any>(null);

  // Early return if communityId is missing
  if (!communityId) {
    return <div>Error: Community ID is missing.</div>;
  }

  // Subscription check
  const { subscription: userSubscription, isSubscriptionLoading } = useSubscription();
  const isOwner = userSubscription?.community_uuid === communityId;

  // Fetch community details
  const { data: community, isLoading: isCommunityLoading, error: communityError } = useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('community_uuid', communityId)
        .single();

      if (error) {
        console.error('Error fetching community:', error);
        throw error;
      }

      return data;
    },
    enabled: !!communityId,
  });

  // Fetch threads with user names from users table
  const { 
    data: threads, 
    isLoading: isThreadsLoading, 
    error: threadsError,
    refetch: refetchThreads
  } = useQuery({
    queryKey: ['community-threads', communityId, isOwner],
    queryFn: async () => {
      console.log('Fetching threads for community:', communityId, 'isOwner:', isOwner);
      
      let query = supabase
        .from('threads')
        .select(`
          *,
          users!threads_user_uuid_fkey (
            first_name,
            last_name
          )
        `)
        .eq('community_uuid', communityId)
        .order('created_at', { ascending: false });

      // If user is not the owner, only show open threads
      if (!isOwner) {
        query = query.eq('status', 'open');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching threads:', error);
        throw error;
      }

      console.log('Fetched threads:', data);
      return data || [];
    },
    enabled: !!communityId && !!community,
  });

  // Fetch community members
  const { data: members, isLoading: isMembersLoading, error: membersError } = useQuery({
    queryKey: ['community-members', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          *,
          users (
            user_uuid,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('community_uuid', communityId);

      if (error) {
        console.error('Error fetching community members:', error);
        throw error;
      }

      return data;
    },
    enabled: !!communityId,
  });

  useEffect(() => {
    if (!user && !isSubscriptionLoading) {
      navigate('/sign-in');
    }
  }, [user, navigate, isSubscriptionLoading]);

  if (isCommunityLoading) {
    return <div className="text-center py-8">Loading community...</div>;
  }

  if (communityError) {
    return <div className="text-center py-8 text-red-500">Error loading community. Please try again.</div>;
  }

  if (!community) {
    return <div className="text-center py-8">Community not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader community={community} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="col-span-1">
            <CommunityNav community={community} isOwner={isOwner} />

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Community Members</h3>
              {isMembersLoading ? (
                <div>Loading members...</div>
              ) : membersError ? (
                <div>Error loading members.</div>
              ) : (
                <ul className="space-y-3">
                  {members?.map((member) => (
                    <li key={member.user_uuid} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.users?.avatar_url || "https://github.com/shadcn.png"} />
                        <AvatarFallback>{member.users?.first_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{member.users?.first_name} {member.users?.last_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="threads">Threads</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                {isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <h2 className="text-2xl font-bold">About this Community</h2>
                <p>{community.description}</p>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold">Rules</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {community.rules ? (community.rules as string[]).map((rule, index) => (
                      <li key={index}>{rule}</li>
                    )) : (
                      <li>No rules specified.</li>
                    )}
                  </ul>
                </div>
              </TabsContent>

              {isOwner && (
                <TabsContent value="settings">
                  <h2 className="text-2xl font-bold">Community Settings</h2>
                  {/* Implement settings form here */}
                  <p>Settings content will go here.</p>
                </TabsContent>
              )}

              <TabsContent value="threads" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Community Threads</h2>
                  {userSubscription && (
                    <CreateThreadDialog 
                      communityId={communityId} 
                      onThreadCreated={refetchThreads}
                      availableTags={community?.threads_tags as string[] || []}
                    />
                  )}
                </div>

                {isThreadsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading threads...</p>
                  </div>
                ) : threadsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Error loading threads. Please try again.</p>
                  </div>
                ) : threads && threads.length > 0 ? (
                  <div className="space-y-4">
                    {threads.map((thread) => (
                      <ThreadCard
                        key={thread.thread_uuid}
                        thread={{
                          ...thread,
                          user_name: thread.users?.first_name && thread.users?.last_name 
                            ? `${thread.users.first_name} ${thread.users.last_name}`.trim()
                            : thread.users?.first_name || 'Anonymous'
                        }}
                        isOwner={isOwner}
                        onThreadClick={setSelectedThread}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No threads yet. Be the first to start a discussion!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {selectedThread && (
        <ThreadDialog
          isOpen={!!selectedThread}
          onClose={() => setSelectedThread(null)}
          thread={{
            ...selectedThread,
            user_name: selectedThread.users?.first_name && selectedThread.users?.last_name 
              ? `${selectedThread.users.first_name} ${selectedThread.users.last_name}`.trim()
              : selectedThread.users?.first_name || 'Anonymous'
          }}
        />
      )}
    </div>
  );
}
