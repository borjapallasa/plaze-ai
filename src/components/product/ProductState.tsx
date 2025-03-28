
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
        console.log("Processing additional variant:", variantId);
        
        // Check if this variant ID is a default variant (prefixed with 'default-')
        const isDefaultVariant = variantId.startsWith('default-');
        
        try {
          if (isDefaultVariant) {
            // For default variants that represent products without real variants
            const productUuid = variantId.replace('default-', '');
            
            console.log("Processing default variant for product:", productUuid);
            
            const { data: productData, error: productError } = await supabase
              .from('products')
              .select('product_uuid, name, price_from')
              .eq('product_uuid', productUuid)
              .single();
              
            if (productError || !productData) {
              console.error('Error fetching product data:', productError);
              return { variantId, productUuid, productName: 'Unknown Product', variantName: 'Default option' };
            }
            
            console.log("Found product data for default variant:", productData);
            
            return { 
              variantId, 
              productUuid: productData.product_uuid,
              productName: productData.name,
              variantName: 'Default option'
            };
          } else {
            // Regular variants
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
          }
        } catch (error) {
          console.error('Error processing variant:', error);
          return { variantId, productUuid: null };
        }
      })
    );

    console.log("Additional variants info:", additionalVariantsInfo);

    const isClassroomProduct = !!product.community_product_uuid;

    const validAdditionalVariants = additionalVariantsInfo
      .filter(item => item.productUuid)
      .map(item => ({
        variantId: item.variantId,
        productUuid: item.productUuid,
        variantName: item.variantName,
        isDefaultVariant: item.variantId.startsWith('default-')
      }));

    console.log("Valid additional variants:", validAdditionalVariants);

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
        // For default variants, we need to match them differently
        const additionalItems = result.updatedCart.items
          .filter(item => {
            // Check if this item is one of our additional variants
            return additionalVariants.some(variantId => {
              // For default variants, compare product_uuid
              if (variantId.startsWith('default-')) {
                const productUuid = variantId.replace('default-', '');
                return item.product_uuid === productUuid;
              }
              // For regular variants, compare variant_uuid
              return item.variant_uuid === variantId;
            });
          })
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
