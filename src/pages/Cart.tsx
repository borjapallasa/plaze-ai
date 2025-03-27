
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";

export default function Cart() {
  const { cart, isLoading, fetchCart, removeFromCart } = useCart();

  // Refetch cart when component mounts
  useEffect(() => {
    const refreshCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const guestId = !userId ? localStorage.getItem('guest_session_id') : undefined;
      
      fetchCart(userId, guestId || undefined);
    };
    
    refreshCart();
  }, [fetchCart]);

  // Helper function to remove item
  const handleRemoveItem = async (variantId: string) => {
    await removeFromCart(variantId);
  };

  // Calculate totals
  const subtotal = cart ? cart.total_amount : 0;
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;

  // Loading state
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

  // Empty cart state
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

  // Check if there are any unavailable products (product_uuid is null)
  const hasUnavailableProducts = cart.items.some(item => !item.product_uuid);

  return (
    <div className="bg-background min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 py-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
          
          {hasUnavailableProducts && (
            <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Some items in your cart are no longer available
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  These items have been marked as unavailable and should be removed from your cart.
                </p>
              </div>
            </div>
          )}
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card 
                  key={item.variant_uuid} 
                  className={`overflow-hidden ${!item.product_uuid ? 'border-yellow-300 bg-yellow-50' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                        {item.product_uuid ? (
                          <img
                            src="/lovable-uploads/3cfa57c2-16ef-4ec7-baa5-0f454c33a1b6.png"
                            alt={item.product_name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-yellow-100">
                            <AlertCircle className="h-8 w-8 text-yellow-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold leading-tight mb-2 line-clamp-2">
                          {item.product_uuid ? (
                            item.product_name || "Product"
                          ) : (
                            <span className="text-yellow-800">Product unavailable</span>
                          )}
                        </h2>
                        <div className="inline-block bg-[#F1F0FB] text-primary px-3 py-1 rounded-full text-sm mb-2">
                          {item.variant_name || "Variant"}
                        </div>
                        {!item.product_uuid && (
                          <p className="text-sm text-yellow-700 mt-1">
                            This product has been removed from the store
                          </p>
                        )}
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

            {/* Order Summary */}
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
                      disabled={hasUnavailableProducts}
                    >
                      Pay Now
                    </Button>
                    {hasUnavailableProducts && (
                      <p className="text-xs text-yellow-700 mt-1 text-center">
                        Please remove unavailable items before proceeding
                      </p>
                    )}
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
