
import { MainHeader } from "@/components/MainHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Flag, Heart, ExternalLink, Clock, Calendar, Briefcase, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

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
            <div className="flex justify-between items-start">
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

            <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{job.workDetails.hours}</p>
                    <p className="text-sm text-muted-foreground">Hourly</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{job.workDetails.duration}</p>
                    <p className="text-sm text-muted-foreground">Project Length</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{job.workDetails.experience}</p>
                    <p className="text-sm text-muted-foreground">{job.workDetails.experienceDetails}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Skills and Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Activity on this job</h2>
              <div className="space-y-2 text-sm">
                <p>Proposals: {job.activity.proposals.range}</p>
                <p>Last viewed by client: {job.activity.lastViewed}</p>
                <p>Interviewing: {job.activity.interviewing}</p>
                <p>Invites sent: {job.activity.invitesSent}</p>
                <p>Unanswered invites: {job.activity.unansweredInvites}</p>
              </div>
            </div>
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
                https://www.upwork.com/jobs/
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
