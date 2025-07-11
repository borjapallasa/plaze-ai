import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Thread } from "@/components/community/Thread";
import { CreateThreadDialog } from "@/components/community/CreateThreadDialog";
import { MemberManagementDialog } from "@/components/community/MemberManagementDialog";

import { useCommunity } from "@/hooks/use-community";
import { useCommunityThreads } from "@/hooks/use-community-threads";
import { useCommunityMembers } from "@/hooks/use-community-members";

import { cn } from "@/lib/utils";
import { Shield, Users } from "lucide-react";

interface Params {
  communityId: string;
}

export default function Community() {
  const { communityId } = useParams<Params>();
  const [createThreadOpen, setCreateThreadOpen] = useState(false);
  const [memberManagementOpen, setMemberManagementOpen] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const { 
    data: community, 
    isLoading: isLoadingCommunity, 
    isError: isErrorCommunity 
  } = useCommunity(communityId);
  const { 
    data: threads = [], 
    isLoading: isLoadingThreads, 
    isError: isErrorThreads 
  } = useCommunityThreads(communityId);
  const { 
    data: members = [], 
    isLoading: isLoadingMembers, 
    isError: isErrorMembers 
  } = useCommunityMembers(communityId);

  if (isErrorCommunity) return <div>Failed to load community</div>
  if (isErrorThreads) return <div>Failed to load threads</div>
  if (isErrorMembers) return <div>Failed to load members</div>

  const isOwner = community?.is_owner;

  return (
    <div className="min-h-screen bg-background">
      {isLoadingCommunity ? (
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
          <Skeleton className="h-4 w-1/2 mt-1" />
          <div className="mt-8 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{community?.name}</h2>
              <p className="text-muted-foreground">{community?.description}</p>
            </div>

            <Tabs defaultValue="threads" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="threads">Threads</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>

              <TabsContent value="threads" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setCreateThreadOpen(true)}>Create Thread</Button>
                </div>
                <Separator />
                {isLoadingThreads ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : threads.length === 0 ? (
                  <div className="text-center py-8">
                    No threads yet. Be the first to create one!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {threads.map((thread) => (
                      <Thread key={thread.thread_uuid} thread={thread} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                {isOwner && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setMemberManagementOpen(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Manage Members
                    </Button>
                  </div>
                )}
                
                <Card>
                  <CardContent className="p-4">
                    {isLoadingMembers ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : members.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No members yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {members.map((member) => (
                          <div
                            key={member.community_subscription_uuid}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage 
                                  src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                                  alt={`${member.users.first_name} ${member.users.last_name}`}
                                />
                                <AvatarFallback>
                                  {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {member.users.first_name} {member.users.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Member since {new Date(member.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {member.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <Card>
                  <CardContent className="grid gap-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium tracking-tight">Calendar</h4>
                      <p className="text-sm text-muted-foreground">
                        Here is a calendar to see the events of the community.
                      </p>
                    </div>
                    <CalendarDemo date={date} setDate={setDate} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      )}

      <CreateThreadDialog 
        open={createThreadOpen}
        onOpenChange={setCreateThreadOpen}
        communityId={communityId!}
      />

      <MemberManagementDialog
        open={memberManagementOpen}
        onOpenChange={setMemberManagementOpen}
        communityId={communityId!}
        isOwner={isOwner!}
      />
    </div>
  );
}

function CalendarDemo({ date, setDate }: { date: Date | undefined, setDate: (date: Date | undefined) => void }) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
