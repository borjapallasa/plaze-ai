
import { useParams, Link } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Star,
  Briefcase,
  DollarSign,
  CheckCircle,
  Clock,
  Users,
  Mail,
  User,
  Copy,
  Building,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface ExpertDetails {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  expertise: string[];
  rating: number;
  projectsCompleted: number;
  totalEarnings: number;
  activeProjects: number;
  isVerified: boolean;
  responseRate: number;
  averageResponseTime: string;
  availabilityStatus: "available" | "busy" | "unavailable";
  hourlyRate: number;
  userId: string;
  stripeConnectId: string;
  bio: string;
  education: string;
  company: string;
  location: string;
}

const mockExpertDetails: ExpertDetails = {
  id: "1",
  email: "sarah.wilson@example.com",
  fullName: "Sarah Wilson",
  createdAt: "2/22/2025, 8:06 PM",
  expertise: ["UI/UX Design", "Web Development", "Mobile App Design"],
  rating: 4.8,
  projectsCompleted: 45,
  totalEarnings: 25000,
  activeProjects: 3,
  isVerified: true,
  responseRate: 98,
  averageResponseTime: "2 hours",
  availabilityStatus: "available",
  hourlyRate: 85,
  userId: "usr_789",
  stripeConnectId: "connect_789",
  bio: "Senior UX/UI designer with 8+ years of experience in creating user-centered digital products. Passionate about solving complex problems through design thinking.",
  education: "Master's in Human-Computer Interaction, Stanford University",
  company: "Freelance Design Studio",
  location: "San Francisco, CA"
};

export default function AdminExpertDetails() {
  const { id } = useParams();
  const expert = mockExpertDetails; // In a real app, fetch based on id

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getAvailabilityBadge = (status: ExpertDetails["availabilityStatus"]) => {
    const badges = {
      available: <Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge>,
      busy: <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Busy</Badge>,
      unavailable: <Badge variant="secondary" className="bg-red-100 text-red-800">Unavailable</Badge>
    };
    return badges[status];
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] mt-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/a/admin" className="text-[#8E9196] hover:text-[#1A1F2C]">
            Home
          </Link>
          <span className="text-[#8E9196]">/</span>
          <Link to="/a/admin/experts" className="text-[#8E9196] hover:text-[#1A1F2C]">
            Experts
          </Link>
          <span className="text-[#8E9196]">/</span>
          <span className="text-[#1A1F2C]">Expert Details</span>
        </nav>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Expert Information</CardTitle>
              <CardDescription>Basic details about the expert</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C] flex items-center gap-2">
                      {expert.email}
                      <button 
                        onClick={() => copyToClipboard(expert.email, "Email")}
                        className="hover:text-[#1A1F2C] text-[#8E9196]"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-xs text-[#8E9196]">Email</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">{expert.fullName}</div>
                    <div className="text-xs text-[#8E9196]">Full Name</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">{expert.createdAt}</div>
                    <div className="text-xs text-[#8E9196]">Joined Date</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">{expert.company}</div>
                    <div className="text-xs text-[#8E9196]">Company</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">
                      {getAvailabilityBadge(expert.availabilityStatus)}
                    </div>
                    <div className="text-xs text-[#8E9196]">Status</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-[#1A1F2C] mb-2">Expertise</div>
                <div className="flex flex-wrap gap-2">
                  {expert.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-[#1A1F2C] mb-2">Bio</div>
                <div className="text-sm text-[#4B5563]">{expert.bio}</div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Expert's performance and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">{expert.rating}</div>
                    <div className="text-xs text-[#8E9196]">Rating</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">{expert.projectsCompleted}</div>
                    <div className="text-xs text-[#8E9196]">Projects Completed</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">${expert.totalEarnings.toLocaleString()}</div>
                    <div className="text-xs text-[#8E9196]">Total Earnings</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">{expert.averageResponseTime}</div>
                    <div className="text-xs text-[#8E9196]">Average Response Time</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C]">{expert.responseRate}%</div>
                    <div className="text-xs text-[#8E9196]">Response Rate</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-1 text-[#8E9196]" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1F2C] flex items-center gap-2">
                      {expert.isVerified ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Verified</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">Unverified</Badge>
                      )}
                    </div>
                    <div className="text-xs text-[#8E9196]">Verification Status</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
