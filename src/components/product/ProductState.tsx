
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/ui/use-toast";
import { CartItem } from "@/types/cart";

export function useProductState(variants: any[]) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [additionalVariants, setAdditionalVariants] = useState<string[]>([]);
  const [showStickyATC, setShowStickyATC] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const variantsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addToCart, isLoading, fetchCart } = useCart();

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      const highlightedVariant = variants.find(v => v.highlight);
      setSelectedVariant(highlightedVariant ? highlightedVariant.id : variants[0].id);
    }
  }, [variants, selectedVariant]);

  useEffect(() => {
    const handleScroll = () => {
      if (variantsRef.current) {
        const variantsRect = variantsRef.current.getBoundingClientRect();
        setShowStickyATC(variantsRect.bottom < -100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async (product: any) => {
    if (!selectedVariant) {
      toast({
        title: "Please select a variant",
        description: "You need to select a package before adding to cart.",
      });
      return;
    }

    console.log("Adding main product variant to cart:", selectedVariant);
    const result = await addToCart(product, selectedVariant);
    
    if (result?.success) {
      // If successfully added to cart, show the cart drawer
      if (result.cartItem) {
        setLastAddedItem(result.cartItem);
        setCartDrawerOpen(true);
      }
      
      // Add additional variants if selected
      if (additionalVariants.length > 0) {
        console.log("Adding additional variants to cart:", additionalVariants);
        for (const variantId of additionalVariants) {
          await addToCart(product, variantId);
        }
      }
      
      return result;
    } else {
      return null;
    }
  };

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
    setLastAddedItem(null);
  };

  const handleAdditionalVariantToggle = (variantId: string, selected: boolean) => {
    setAdditionalVariants(prev =>
      selected
        ? [...prev, variantId]
        : prev.filter(id => id !== variantId)
    );
  };

  return {
    selectedVariant,
    setSelectedVariant,
    additionalVariants,
    showStickyATC,
    variantsRef,
    handleAddToCart,
    handleAdditionalVariantToggle,
    isLoading,
    cartDrawerOpen,
    setCartDrawerOpen,
    lastAddedItem,
    closeCartDrawer
  };
}
