
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/ui/use-toast";
import { CartItem } from "@/types/cart";
import { Sheet } from "@/components/ui/sheet";

export function useProductState(variants: any[]) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [additionalVariants, setAdditionalVariants] = useState<string[]>([]);
  const [showStickyATC, setShowStickyATC] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const variantsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addToCart, isLoading } = useCart();

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

    // Add main variant to cart
    const result = await addToCart(product, selectedVariant);
    
    if (result?.updatedCart) {
      // Find the latest added item
      const addedItem = result.updatedCart.items.find(
        item => item.product_uuid === product.product_uuid && item.variant_uuid === selectedVariant
      );
      
      if (addedItem) {
        setLastAddedItem(addedItem);
        setCartDrawerOpen(true);
      }
    }

    // Add additional variants if selected
    if (additionalVariants.length > 0) {
      for (const variantId of additionalVariants) {
        await addToCart(product, variantId);
      }
    }
  };

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
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
