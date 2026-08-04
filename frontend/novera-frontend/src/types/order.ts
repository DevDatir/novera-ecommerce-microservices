import type { AddressResponse } from "./address";

export interface PlaceOrderRequest {
  addressId: number;
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  imageUrls: string[];
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;

  shippingAddress: AddressResponse;

  items: OrderItemResponse[];
}

export interface OrderSummaryResponse {
  id: number;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
}

export interface PaymentOrderResponse {
  id: number;
  userId: number;
  totalAmount: number;
  paymentStatus: string;
}