
import { CartItem, CartTransaction } from '@/types/cart';

export interface CartOperationResult {
  success: boolean;
  message?: string;
  updatedCart?: CartTransaction;
  cartItem?: CartItem;
}
