
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  type: string;
}

const cartItems: CartItem[] = [
  {
    id: "1",
    title: "IG Lead Qualification Chatbot With Manychat Poll",
    price: 59.95,
    image: "/lovable-uploads/3cfa57c2-16ef-4ec7-baa5-0f454c33a1b6.png",
    type: "Template + Instructions"
  },
  {
    id: "2",
    title: "Automated YouTube Script Rewriter",
    price: 49.95,
    image: "/lovable-uploads/3cfa57c2-16ef-4ec7-baa5-0f454c33a1b6.png",
    type: "Template + Instructions"
  }
];

export default function Cart() {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        <div className="space-y-6">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold leading-tight mb-2 line-clamp-2">
                      {item.title}
                    </h2>
                    <div className="inline-block bg-[#F1F0FB] text-primary px-3 py-1 rounded-full text-sm">
                      {item.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-semibold">${item.price}</span>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mt-8">
            <div className="text-right space-y-1 order-2 sm:order-1 sm:mr-6">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
            </div>
            <Button size="lg" className="order-1 sm:order-2">
              Pay Now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
