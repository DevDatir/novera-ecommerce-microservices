import axiosInstance from "../api/axios";
import type {
  AddItemToCartRequest,
  CartResponse,
  UpdateCartItemRequest,
} from "../types/cart";

const CART_BASE_URL = `${import.meta.env.VITE_CART_API || ""}/api/cart`;

const getCart = async (): Promise<CartResponse> => {
  const { data } = await axiosInstance.get<CartResponse>(CART_BASE_URL);
  return data;
};

const addItem = async (
  request: AddItemToCartRequest
): Promise<CartResponse> => {
  const { data } = await axiosInstance.post<CartResponse>(
    `${CART_BASE_URL}/items`,
    request
  );

  return data;
};

const updateItem = async (
  productId: number,
  request: UpdateCartItemRequest
): Promise<CartResponse> => {
  const { data } = await axiosInstance.put<CartResponse>(
    `${CART_BASE_URL}/items/${productId}`,
    request
  );

  return data;
};

const removeItem = async (productId: number): Promise<void> => {
  await axiosInstance.delete(`${CART_BASE_URL}/items/${productId}`);
};

const clearCart = async (): Promise<void> => {
  await axiosInstance.delete(`${CART_BASE_URL}/clear`);
};

const cartService = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};

export default cartService;
