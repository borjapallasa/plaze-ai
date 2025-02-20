
import { ExpertHeader } from "@/components/expert/ExpertHeader";
import { ExpertInfo } from "@/components/expert/ExpertInfo";
import { ExpertSkills } from "@/components/expert/ExpertSkills";
import { ExpertStats } from "@/components/expert/ExpertStats";
import { ExpertServices } from "@/components/expert/ExpertServices";
import { ExpertCommunity } from "@/components/expert/ExpertCommunity";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";

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

          <MoreFromSeller products={moreProducts} />
        </div>
      </div>
    </div>
  );
}
