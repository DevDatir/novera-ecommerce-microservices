import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartService from "../service/cartService";
import type {
  AddItemToCartRequest,
  CartResponse,
  UpdateCartItemRequest,
} from "../types/cart";

const CART_QUERY_KEY = ["cart"];

export const useCart = (enabled = true) => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartService.getCart,
    enabled,
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

    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      if (previousCart) {
        queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity, subtotal: item.product.price * quantity }
              : item
          ),
        });
      }

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartService.removeItem,

    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      if (previousCart) {
        queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, {
          ...previousCart,
          items: previousCart.items.filter((item) => item.productId !== productId),
        });
      }

      return { previousCart };
    },

    onError: (_err, _productId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
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
