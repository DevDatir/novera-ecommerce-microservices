import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartService from "../service/cartService";
import type {
  AddItemToCartRequest,
  UpdateCartItemRequest,
} from "../types/cart";

const CART_QUERY_KEY = ["cart"];

export const useCart = () => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartService.getCart,
  });

  const addItemMutation = useMutation({
    mutationFn: (request: AddItemToCartRequest) =>
      cartService.addItem(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) =>
      cartService.updateItem(productId, {
        quantity,
      } as UpdateCartItemRequest),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartService.removeItem,

    onSuccess: (updatedCart) => {
        queryClient.setQueryData(["cart"], updatedCart);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });

  return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        isError: cartQuery.isError,
        error: cartQuery.error,

        addItemMutation,
        updateItemMutation,
        removeItemMutation,
        clearCartMutation,
    };
};