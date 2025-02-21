
import { MainHeader } from "@/components/MainHeader";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { ProductCard } from "@/components/ProductCard";

const affiliateOffers = [
  {
    title: "AI Marketing Suite",
    price: "$99.99",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    seller: "Marketing AI",
    description: "Split: 70/30 - You earn 30% commission on each sale. Complete suite of AI-powered marketing tools.",
    tags: ["marketing", "ai", "automation"],
    category: "software"
  },
  {
    title: "SEO Optimizer Pro",
    price: "$79.99",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    seller: "SEO Tools Inc",
    description: "Split: 75/25 - You earn 25% commission per sale. Professional SEO optimization toolkit.",
    tags: ["seo", "marketing", "tools"],
    category: "software"
  },
  {
    title: "Content Creator AI",
    price: "$129.99",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    seller: "AI Solutions",
    description: "Split: 65/35 - You earn 35% commission on each sale. AI-powered content creation platform.",
    tags: ["content", "ai", "writing"],
    category: "software"
  }
];

export default function Affiliates() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Your affiliate dashboard</h1>
        <AffiliateDashboard />
        <div className="mt-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Your affiliates</h2>
          <p className="text-muted-foreground mb-8">
            Click on your affiliate to see all transactions.
          </p>
          <AffiliateTable />
        </div>
        <div className="mt-16">
          <h2 className="text-4xl font-bold mb-8 text-foreground">Affiliate offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliateOffers.map((offer, index) => (
              <ProductCard
                key={index}
                title={offer.title}
                price={offer.price}
                image={offer.image}
                seller={offer.seller}
                description={offer.description}
                tags={offer.tags}
                category={offer.category}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
