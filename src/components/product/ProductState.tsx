
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useProductState(variants: any[]) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [additionalVariants, setAdditionalVariants] = useState<string[]>([]);
  const [showStickyATC, setShowStickyATC] = useState(false);
  const variantsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleAddToCart = () => {
    const mainVariant = variants.find(v => v.id === selectedVariant);
    const additionalItems = variants.filter(v => additionalVariants.includes(v.id));
    
    console.log("Adding to cart:", mainVariant, "with additional items:", additionalItems);
    
    toast({
      title: "Added to cart",
      description: `Your item${additionalItems.length > 0 ? ' and add-ons have' : ' has'} been added to the cart.`,
    });
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
    handleAdditionalVariantToggle
  };
}
