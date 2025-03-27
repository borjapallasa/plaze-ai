
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart, Loader2, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Cart() {
  const { cart, isLoading, fetchCart, removeFromCart, cleanupCart } = useCart();

  useEffect(() => {
    const refreshCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const guestId = !userId ? localStorage.getItem('guest_session_id') : undefined;
      
      await fetchCart(userId, guestId || undefined);
      
      // Clean up any unavailable items
      await cleanupCart();
    };
    
    refreshCart();
  }, [fetchCart, cleanupCart]);

  const handleRemoveItem = async (variantId: string) => {
    await removeFromCart(variantId);
  };

  const subtotal = cart ? cart.total_amount : 0;
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;
  
  // Check if we have any unavailable items
  const hasUnavailableItems = cart?.items.some(item => item.is_available === false);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <MainHeader />
        <main className="container mx-auto px-4 py-4 pt-24">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading your cart...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <MainHeader />
        <main className="container mx-auto px-4 py-4 pt-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
            
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = '/'}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 py-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
          
          {hasUnavailableItems && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some items in your cart are no longer available. These items will be removed during checkout.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card 
                  key={item.variant_uuid} 
                  className={`overflow-hidden ${!item.is_available ? 'border-red-400 bg-red-50/30' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                        <img
                          src="/lovable-uploads/3cfa57c2-16ef-4ec7-baa5-0f454c33a1b6.png"
                          alt={item.product_name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold leading-tight mb-2 line-clamp-2">
                          {item.product_name || "Product"}
                          {!item.is_available && (
                            <span className="ml-2 text-sm text-red-500 font-normal">
                              (Product unavailable)
                            </span>
                          )}
                        </h2>
                        <div className="inline-block bg-[#F1F0FB] text-primary px-3 py-1 rounded-full text-sm mb-2">
                          {item.variant_name || "Variant"}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="text-lg font-semibold">${item.price * item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(item.variant_uuid)}
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

            <div className="mt-4 lg:mt-0">
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        // Remove unavailable items before checkout
                        if (hasUnavailableItems) {
                          cleanupCart().then(() => {
                            toast({
                              title: "Cart updated",
                              description: "Unavailable items have been removed from your cart."
                            });
                          });
                        } else {
                          toast({
                            title: "Payment processing",
                            description: "This is where the payment processing would begin."
                          });
                        }
                      }}
                    >
                      Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
