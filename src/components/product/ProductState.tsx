
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { Variant } from "./types/variants";

export function useProductState(variants: Variant[]) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [showStickyATC, setShowStickyATC] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<any>(null);
  const [lastAddedAdditionalItems, setLastAddedAdditionalItems] = useState<any[]>([]);
  
  const variantsRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  useEffect(() => {
    const handleScroll = () => {
      if (variantsRef.current) {
        const rect = variantsRef.current.getBoundingClientRect();
        setShowStickyATC(rect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = async (product: any) => {
    if (!selectedVariant) return;

    setIsLoading(true);
    try {
      const cartItem = {
        id: selectedVariant.id,
        name: selectedVariant.name,
        price: selectedVariant.price,
        image: product.thumbnail || "/placeholder.svg",
        quantity: 1,
        productUuid: product.product_uuid,
        variantId: selectedVariant.id,
      };

      addToCart(cartItem);
      setLastAddedItem(cartItem);
      setLastAddedAdditionalItems([]);
      setCartDrawerOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdditionalVariantToggle = (variantId: string, selected: boolean) => {
    console.log("Additional variant toggle:", variantId, selected);
  };

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
  };

  return {
    selectedVariant,
    setSelectedVariant,
    showStickyATC,
    variantsRef,
    handleAddToCart,
    handleAdditionalVariantToggle,
    isLoading,
    cartDrawerOpen,
    setCartDrawerOpen,
    lastAddedItem,
    lastAddedAdditionalItems,
    closeCartDrawer,
  };
}
