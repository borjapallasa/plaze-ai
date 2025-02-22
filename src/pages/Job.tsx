import { MainHeader } from "@/components/MainHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Flag, Heart, ExternalLink, Clock, Calendar, Briefcase, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductReviews } from "@/components/product/ProductReviews";

export default function JobDetails() {
  const job = {
    title: "Automations Expert Needed for Streamlining Processes",
    postedTime: "Posted yesterday",
    location: "Worldwide",
    description: "We are seeking an experienced automations expert to help us streamline our workflows using tools like Zapier and Apify. The ideal candidate will have a proven track record in creating efficient automations that enhance productivity and reduce manual tasks. You will be responsible for analyzing our current processes, identifying areas for automation, and implementing solutions that integrate various platforms seamlessly. I am looking to create a seamless workflow for my onboarding process as well as any other suggestions you might have. Possible some social media management things, reposting, etc. If you have a passion for optimizing workflows and a deep understanding of automation tools, we want to hear from you!",
    workDetails: {
      hours: "Less than 30 hrs/week",
      duration: "1 to 3 months",
      experience: "Intermediate",
      experienceDetails: "I am looking for a mix of experience and value"
    },
    projectType: "Ongoing project",
    skills: ["Microsoft Excel", "Automation", "Data Entry", "Administrative Support"],
    clientInfo: {
      paymentVerified: true,
      rating: 4.7,
      totalReviews: 41,
      location: "United States",
      localTime: "Phoenix 5:07 PM",
      jobsPosted: 108,
      hireRate: "67% hire rate",
      openJobs: 4,
      totalSpent: "$18K",
      totalHires: 82,
      activeHires: 6,
      avgHourlyRate: "$6.07",
      totalHours: "1,860",
      memberSince: "Feb 24, 2020",
      category: "Sales & Marketing",
      type: "Individual client"
    },
    activity: {
      proposals: { range: "5 to 10", text: "Required Connects to submit a proposal: 20" },
      lastViewed: "12 minutes ago",
      availableConnects: 122,
      hires: 1,
      interviewing: 0,
      invitesSent: 0,
      unansweredInvites: 0
    }
  };

  const reviews = [
    { 
      id: 1,
      author: "Client A",
      rating: 5,
      content: "Instagram Reels Manager Project",
      description: "Great work on managing our daily content creation for Instagram Reels. Very organized and efficient in delivering consistent content.",
      projectDetails: {
        duration: "Jan 2025 - Feb 2025",
        rate: "28 hrs @ $4.00/hr",
        billed: "$125.49"
      },
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      date: "Feb 2025",
      itemQuality: 5,
      shipping: 5,
      customerService: 5
    },
    { 
      id: 2,
      author: "Client B",
      rating: 5,
      content: "Pinterest Management",
      description: "Fixed-price project completed successfully. Excellent Pinterest management skills and strategic approach to content.",
      projectDetails: {
        duration: "Mar 2024 - Feb 2025",
        rate: "Fixed-price",
        billed: "$100.00"
      },
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      date: "Feb 2025",
      itemQuality: 5,
      shipping: 5,
      customerService: 5
    },
    {
      id: 3,
      author: "Avery M.",
      rating: 5,
      content: "Social Media Expert Project",
      description: "It is always pleasure working with them! Communication is great and they provided me with all materials I needed! 10+ experience all around.",
      projectDetails: {
        duration: "Feb 2024 - Mar 2024",
        rate: "Fixed-price",
        billed: "$155.00"
      },
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      date: "Mar 2024",
      itemQuality: 5,
      shipping: 5,
      customerService: 5
    },
    {
      id: 4,
      author: "Marketing Agency",
      rating: 5,
      content: "Social Media Management",
      description: "Amazing to work with, delivers quality work every time! I will continue to work with them for as long as I can. I only wish I had more projects to offer!",
      projectDetails: {
        duration: "Mar 2024 - May 2024",
        rate: "5 hrs @ $20.00/hr",
        billed: "$1,094.95"
      },
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      date: "May 2024",
      itemQuality: 5,
      shipping: 5,
      customerService: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/jobs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open job in a new window
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold mb-2">{job.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{job.postedTime}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground whitespace-pre-line mb-6">{job.description}</p>

              <Separator className="mb-6" />

              <div className="flex items-center gap-6 flex-wrap mb-6">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{job.workDetails.hours}</p>
                    <p className="text-sm text-muted-foreground">Hourly</p>
                  </div>
                </div>
                
                <Separator orientation="vertical" className="h-8" />
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{job.workDetails.duration}</p>
                    <p className="text-sm text-muted-foreground">Project Length</p>
                  </div>
                </div>
                
                <Separator orientation="vertical" className="h-8" />
                
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{job.workDetails.experience}</p>
                    <p className="text-sm text-muted-foreground">{job.workDetails.experienceDetails}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Skills and Expertise</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Activity on this job</h2>
                <div className="space-y-2 text-sm">
                  <p>Proposals: {job.activity.proposals.range}</p>
                  <p>Last viewed by client: {job.activity.lastViewed}</p>
                  <p>Interviewing: {job.activity.interviewing}</p>
                  <p>Invites sent: {job.activity.invitesSent}</p>
                  <p>Unanswered invites: {job.activity.unansweredInvites}</p>
                </div>
              </div>
            </Card>

            <ProductReviews reviews={reviews} className="p-6 border rounded-lg" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Button className="w-full">Apply now</Button>
            <Button variant="outline" className="w-full">Save job</Button>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">About the client</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {job.clientInfo.paymentVerified && (
                    <Badge variant="secondary" className="rounded-full">
                      Payment method verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(job.clientInfo.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {job.clientInfo.rating} of {job.clientInfo.totalReviews} reviews
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p>{job.clientInfo.location}</p>
                  <p>{job.clientInfo.localTime}</p>
                  <p>{job.clientInfo.jobsPosted} jobs posted</p>
                  <p>{job.clientInfo.hireRate}, {job.clientInfo.openJobs} open jobs</p>
                  <p>{job.clientInfo.totalSpent} total spent</p>
                  <p>{job.clientInfo.totalHires} hires, {job.clientInfo.activeHires} active</p>
                  <p>{job.clientInfo.avgHourlyRate}/hr avg hourly rate paid</p>
                  <p>{job.clientInfo.totalHours} hours</p>
                  <p>Member since {job.clientInfo.memberSince}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="font-medium">{job.clientInfo.category}</p>
                  <p className="text-sm text-muted-foreground">{job.clientInfo.type}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Job link</h2>
              <div className="p-2 bg-muted rounded text-sm mb-4">
                https://www.plaze.ai/jobs/
              </div>
              <Button variant="outline" className="w-full">
                Copy link
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
