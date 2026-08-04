import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import orderService from "../service/orderService";

const ORDER_QUERY_KEY = ["orders"];

export const useOrders = () => {

    const queryClient = useQueryClient();

    const placeOrderMutation =
        useMutation({

            mutationFn:
                orderService.placeOrder,

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ORDER_QUERY_KEY,
                });

                queryClient.invalidateQueries({
                    queryKey: ["cart"],
                });
            },
        });

    const useOrder = (id: number) =>
        useQuery({
            queryKey: ["order", id],
            queryFn: () =>
                orderService.getOrder(id),
        });

    const ordersQuery =
        useQuery({

            queryKey: ORDER_QUERY_KEY,

            queryFn: () =>
                orderService.getOrders(),
        });

    const cancelOrderMutation =
        useMutation({

            mutationFn:
                orderService.cancelOrder,

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: ORDER_QUERY_KEY,
                });

            },
        });

    return {

        orders: ordersQuery.data,

        isLoading:
            ordersQuery.isLoading,

        placeOrderMutation,

        cancelOrderMutation,

        useOrder,
    };
};