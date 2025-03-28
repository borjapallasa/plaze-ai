
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { CartItem } from "@/types/cart";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useProductState(variants: any[]) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [additionalVariants, setAdditionalVariants] = useState<string[]>([]);
  const [showStickyATC, setShowStickyATC] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [lastAddedAdditionalItems, setLastAddedAdditionalItems] = useState<CartItem[]>([]);
  const variantsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    console.log('ProductState: handleAddToCart called with variant', selectedVariant);
    
    if (!selectedVariant) {
      toast({
        title: "Please select a variant",
        description: "You need to select a package before adding to cart.",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign up or log in to add items to your cart.",
      });
      navigate("/sign-up");
      return;
    }

    const additionalVariantsInfo = await Promise.all(
      additionalVariants.map(async (variantId) => {
        const { data: variantData, error: variantError } = await supabase
          .from('variants')
          .select('*')
          .eq('variant_uuid', variantId)
          .single();
        
        if (variantError || !variantData) {
          console.error('Error fetching variant data:', variantError);
          return { variantId, productUuid: null };
        }
        
        return { 
          variantId, 
          productUuid: variantData.product_uuid,
          productName: null,
          variantName: variantData.name
        };
      })
    );

    const isClassroomProduct = !!product.community_product_uuid;

    const validAdditionalVariants = additionalVariantsInfo
      .filter(item => item.productUuid)
      .map(item => ({
        variantId: item.variantId,
        productUuid: item.productUuid,
        variantName: item.variantName
      }));

    const result = await addToCart(
      product, 
      selectedVariant, 
      validAdditionalVariants, 
      isClassroomProduct
    );

    if (result?.success) {
      setLastAddedAdditionalItems([]);

      if (result.cartItem) {
        console.log('Setting last added item:', result.cartItem);
        const cartItem: CartItem = {
          ...result.cartItem,
          last_updated: Date.now()
        };
        setLastAddedItem(cartItem);
      } else if (result.updatedCart && result.updatedCart.items.length > 0) {
        const selectedVariantItem = result.updatedCart.items.find(
          item => item.variant_uuid === selectedVariant
        );
        
        const cartItem = selectedVariantItem || result.updatedCart.items[0];
        cartItem.last_updated = Date.now();
        
        console.log('Setting last added item from updated cart:', cartItem);
        setLastAddedItem(cartItem);
      }

      if (result.updatedCart && validAdditionalVariants.length > 0) {
        const additionalItems = result.updatedCart.items
          .filter(item => additionalVariants.includes(item.variant_uuid))
          .map(item => ({
            ...item,
            last_updated: Date.now()
          }));
          
        console.log('Setting additional items:', additionalItems);
        setLastAddedAdditionalItems(additionalItems);
      }

      setCartDrawerOpen(true);
    }
  };

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
    setLastAddedItem(null);
    setLastAddedAdditionalItems([]);
  };

  const handleAdditionalVariantToggle = (variantId: string, selected: boolean) => {
    console.log('Toggle additional variant:', variantId, selected);
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
    lastAddedAdditionalItems,
    closeCartDrawer
  };
}
