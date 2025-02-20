
import { Search, ThumbsDown, Heart, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Job {
  id: number;
  title: string;
  postedTime: string;
  rate: string;
  experienceLevel: string;
  duration: string;
  hours: string;
  description: string;
  skills: string[];
  paymentVerified: boolean;
  rating: number;
  spent: string;
  location: string;
  proposals: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Airtable Developer – Appointment Management System",
    postedTime: "3 hours ago",
    rate: "$30-$60",
    experienceLevel: "Expert",
    duration: "1 to 3 months",
    hours: "Less than 30 hrs/week",
    description: "We are currently managing our appointments using Google Sheets but are ready to upgrade to a more robust and scalable solution using Airtable. We're looking for a skilled Airtable Developer who can design, build, and optimize a comprehensive Appointment Management System tailored to our business needs. 🔨 What You'll Do: - Migrate our existing Google Sheets-based system to Airtable...",
    skills: ["Google Sheets", "Make.com", "Google Sheets Automation", "Spreadsheet Automation", "Airtable", "API", "API Integration"],
    paymentVerified: true,
    rating: 5,
    spent: "$200K+",
    location: "Switzerland",
    proposals: "20 to 50"
  },
  {
    id: 2,
    title: "Airtable Automation and Dashboard Expert Needed",
    postedTime: "5 hours ago",
    rate: "$20-$200",
    experienceLevel: "Intermediate",
    duration: "1 to 3 months",
    hours: "Less than 30 hrs/week",
    description: "We are seeking a skilled professional with expertise in Airtable to help us create automations, set up integrations through Zapier, and develop custom reporting dashboards. The ideal candidate should be able to streamline our workflows and enhance data visibility within Airtable. If you have a proven track record in these areas and can deliver efficient solutions, we would love to hear...",
    skills: ["Zapier", "Airtable", "Automation", "Microsoft Excel", "API"],
    paymentVerified: true,
    rating: 5,
    spent: "$10K+",
    location: "United States",
    proposals: "20 to 50"
  }
];

const JobCard = ({ job }: { job: Job }) => (
  <div className="py-6 border-b last:border-b-0 bg-background">
    <div className="mb-1">
      <p className="text-sm text-muted-foreground">Posted {job.postedTime}</p>
    </div>

    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <div className="flex gap-2 ml-4">
        <button className="p-2 hover:bg-accent rounded-full transition-colors">
          <ThumbsDown className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded-full transition-colors">
          <Heart className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
    
    <div className="text-sm text-muted-foreground mb-3">
      Hourly: {job.rate} - {job.experienceLevel} - Est. Time: {job.duration}, {job.hours}
    </div>
    
    <p className="text-sm mb-3 line-clamp-3">{job.description}</p>
    <button className="text-sm text-primary mb-4">more</button>
    
    <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 -mx-4 px-4">
      {job.skills.map((skill, index) => (
        <Badge 
          key={index}
          variant="secondary"
          className="rounded-full whitespace-nowrap py-1.5 bg-[#9b87f5]/10 text-[#6E59A5] hover:bg-[#9b87f5]/20"
        >
          {skill}
        </Badge>
      ))}
    </div>
    
    <div className="space-y-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        {job.paymentVerified && (
          <>
            <span>✓</span>
            <span>Payment verified</span>
            <span className="text-amber-500">{"★".repeat(job.rating)}</span>
            <span>{job.spent} spent</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        <span>{job.location}</span>
      </div>
      <div>Proposals: {job.proposals}</div>
    </div>
  </div>
);

const Jobs = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input 
          placeholder="Search for jobs" 
          className="pl-10 h-12"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">Jobs you might like</h1>

      <Tabs defaultValue="best" className="mb-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="best" className="flex-1">Best Matches</TabsTrigger>
          <TabsTrigger value="recent" className="flex-1">Most Recent</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">Saved Jobs</TabsTrigger>
        </TabsList>
      </Tabs>

      <p className="text-muted-foreground mb-6 text-sm">
        Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.
      </p>

      <div className="divide-y">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
