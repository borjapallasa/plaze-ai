
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  type: string;
}

const initialCartItems: CartItem[] = [
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
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
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
                        <div className="inline-block bg-[#F1F0FB] text-primary px-3 py-1 rounded-full text-sm mb-3">
                          {item.type}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Available immediately after purchase
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <span className="text-xl font-semibold">${item.price}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 transition-colors"
                    >
                      Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {cartItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Your cart is empty</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = '/'}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
