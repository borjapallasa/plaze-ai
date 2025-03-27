
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/ui/use-toast";
import { CartItem } from "@/types/cart";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

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

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign up or log in to add items to your cart.",
      });
      navigate("/sign-up");
      return;
    }

    // Determine if this is a classroom product (community product) by checking for special properties
    const isClassroomProduct = !!product.community_product_uuid;

    const result = await addToCart(product, selectedVariant, additionalVariants, isClassroomProduct);

    if (result?.success) {
      // Clear previous added items
      setLastAddedAdditionalItems([]);

      // If successfully added to cart, get the cart item and show the cart drawer
      if (result.cartItem) {
        console.log('Setting last added item:', result.cartItem);
        setLastAddedItem(result.cartItem);
      } else if (result.updatedCart && result.updatedCart.items.length > 0) {
        // If no specific cart item is returned but we have an updated cart, use the first item
        const selectedVariantItem = result.updatedCart.items.find(
          item => item.variant_uuid === selectedVariant
        );
        console.log('Setting last added item from updated cart:', selectedVariantItem || result.updatedCart.items[0]);
        setLastAddedItem(selectedVariantItem || result.updatedCart.items[0]);
      }

      // Find and set the additional variant items
      if (result.updatedCart && additionalVariants.length > 0) {
        const additionalItems = result.updatedCart.items.filter(
          item => additionalVariants.includes(item.variant_uuid)
        );
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
