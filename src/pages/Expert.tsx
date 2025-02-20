
import { ExpertHeader } from "@/components/expert/ExpertHeader";
import { ExpertInfo } from "@/components/expert/ExpertInfo";
import { ExpertSkills } from "@/components/expert/ExpertSkills";
import { ExpertStats } from "@/components/expert/ExpertStats";
import { ExpertServices } from "@/components/expert/ExpertServices";
import { ExpertCommunity } from "@/components/expert/ExpertCommunity";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";
import { ProductReviews } from "@/components/product/ProductReviews";

export default function Expert() {
  const moreProducts = [
    {
      title: "Advanced UX Research Methods",
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      seller: "John Doe",
      description: "Learn professional UX research techniques and methodologies.",
      tags: ["research", "ux"],
      category: "design"
    },
    {
      title: "UI Animation Masterclass",
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1518770660439-440f080d1e12",
      seller: "John Doe",
      description: "Create engaging interface animations and micro-interactions.",
      tags: ["animation", "ui"],
      category: "design"
    },
    {
      title: "Design Systems Workshop",
      price: "$129.99",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      seller: "John Doe",
      description: "Build and maintain scalable design systems for large applications.",
      tags: ["systems", "workflow"],
      category: "design"
    },
    {
      title: "UX Writing Fundamentals",
      price: "$69.99",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      seller: "John Doe",
      description: "Master the art of writing clear and effective UX copy.",
      tags: ["writing", "content"],
      category: "design"
    },
    {
      title: "Mobile UX Design",
      price: "$94.99",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
      seller: "John Doe",
      description: "Create seamless mobile experiences that users love.",
      tags: ["mobile", "ux"],
      category: "design"
    },
    {
      title: "User Testing Mastery",
      price: "$109.99",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
      seller: "John Doe",
      description: "Learn effective user testing methods and analysis techniques.",
      tags: ["testing", "research"],
      category: "design"
    }
  ];

  const reviews = [
    { 
      id: 1, 
      author: "Sarah Johnson", 
      rating: 5, 
      content: "Outstanding UX expertise!",
      description: "Worked with this expert on our app redesign. Their insights and attention to detail transformed our user experience completely.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      date: "2 days ago",
      itemQuality: 5,
      shipping: 5,
      customerService: 5
    },
    { 
      id: 2, 
      author: "Michael Chen", 
      rating: 5, 
      content: "Exceptional design thinking",
      description: "The expert provided invaluable feedback on our product's UX. Their systematic approach to problem-solving was impressive.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      date: "1 week ago",
      itemQuality: 5,
      shipping: 4,
      customerService: 5
    },
    { 
      id: 3, 
      author: "Emily Rodriguez", 
      rating: 4, 
      content: "Great collaboration experience",
      description: "Very professional and knowledgeable. They helped us identify key pain points in our user journey and provided actionable solutions.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      date: "2 weeks ago",
      itemQuality: 4,
      shipping: 5,
      customerService: 4
    },
    { 
      id: 4, 
      author: "David Kim", 
      rating: 5, 
      content: "Top-notch UX consultant",
      description: "Their expertise in user research and prototyping helped us create a much more intuitive interface. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      date: "3 weeks ago",
      itemQuality: 5,
      shipping: 5,
      customerService: 5
    }
  ];

  return (
    <div className="space-y-8">
      <div className="container mx-auto px-4">
        <ExpertHeader />
      </div>

      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden lg:block space-y-8">
          <div className="grid grid-cols-5 gap-6">
            <ExpertInfo />
            <ExpertSkills />
          </div>

          <div className="grid grid-cols-5 gap-6">
            <ExpertStats />
            <ExpertServices />
          </div>

          <div className="grid grid-cols-5 gap-6">
            <ExpertCommunity />
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-4 col-start-2">
              <MoreFromSeller products={moreProducts} />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-4 col-start-2">
              <ProductReviews reviews={reviews} />
            </div>
          </div>
        </div>

        {/* Mobile Layout - Reordered */}
        <div className="lg:hidden">
          <div className="mb-8">
            <ExpertSkills />
          </div>

          <div className="mb-8">
            <ExpertInfo />
          </div>

          <div className="mb-8">
            <ExpertServices />
          </div>

          <div className="mb-8">
            <ExpertStats />
          </div>

          <div className="mb-8">
            <ExpertCommunity />
          </div>

          <div className="mb-8">
            <MoreFromSeller products={moreProducts} />
          </div>

          <ProductReviews reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
