
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
        // Check if this is a default variant (no actual variant exists)
        const isDefaultVariant = variantId.startsWith('default-');
        let productUuid = null;
        let variantData = null;
        let variantName = null;
        let productName = null;
        let price = 0;
        
        if (isDefaultVariant) {
          // Extract product UUID from the default variant ID
          productUuid = variantId.replace('default-', '');
          
          // Fetch product data directly
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('name, price_from')
            .eq('product_uuid', productUuid)
            .single();
          
          if (productError || !productData) {
            console.error('Error fetching product data for default variant:', productError);
            return { 
              variantId, 
              productUuid: null, 
              productName: null, 
              variantName: null,
              price: 0
            };
          }
          
          variantName = "Default Option";
          productName = productData.name;
          price = productData.price_from || 0;
          
          console.log('Found default variant data:', { 
            productUuid, 
            productName, 
            price, 
            variantId 
          });
          
          return { 
            variantId, 
            productUuid,
            productName,
            variantName,
            price,
            isDefaultVariant: true
          };
        } else {
          // Regular variant, fetch from variants table
          const { data: variantData, error: variantError } = await supabase
            .from('variants')
            .select('*, products:product_uuid(name)')
            .eq('variant_uuid', variantId)
            .single();
          
          if (variantError || !variantData) {
            console.error('Error fetching variant data:', variantError);
            return { 
              variantId, 
              productUuid: null, 
              productName: null, 
              variantName: null,
              price: 0
            };
          }
          
          return { 
            variantId, 
            productUuid: variantData.product_uuid,
            productName: variantData.products?.name || null,
            variantName: variantData.name,
            price: variantData.price || 0,
            isDefaultVariant: false
          };
        }
      })
    );

    console.log('Additional variants info:', additionalVariantsInfo);

    const isClassroomProduct = !!product.community_product_uuid;

    const validAdditionalVariants = additionalVariantsInfo
      .filter(item => item.productUuid)
      .map(item => ({
        variantId: item.variantId,
        productUuid: item.productUuid,
        variantName: item.variantName,
        productName: item.productName,
        price: item.price,
        isDefaultVariant: item.isDefaultVariant
      }));

    console.log('Valid additional variants:', validAdditionalVariants);

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
        // Find and set additional items from the cart
        const additionalItems = validAdditionalVariants
          .map(additionalVariant => {
            const cartItem = result.updatedCart.items.find(item => {
              // For default variants, we need to check the product_uuid and the variant_uuid pattern
              if (additionalVariant.isDefaultVariant) {
                return item.product_uuid === additionalVariant.productUuid && 
                      (item.variant_uuid === additionalVariant.variantId || 
                       item.variant_uuid.startsWith(`default-${additionalVariant.productUuid}`));
              }
              // For regular variants, just check the variant_uuid
              return item.variant_uuid === additionalVariant.variantId;
            });
            
            if (cartItem) {
              return {
                ...cartItem,
                last_updated: Date.now()
              };
            }
            return null;
          })
          .filter(Boolean) as CartItem[];
          
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
