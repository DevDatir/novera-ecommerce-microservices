import type { Product } from "./product";

export interface CartResponse {
  cartId: number;
  userId: number;
  items: CartItemResponse[];
}

export interface CartItemResponse {
  subtotal: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface AddItemToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}