import axiosInstance from "../api/axios";

import type {
    PlaceOrderRequest,
    OrderResponse
} from "../types/order";

const ORDER_BASE_URL =
    `${import.meta.env.VITE_ORDER_API || ""}/api/orders`;

const placeOrder = async (
    request: PlaceOrderRequest
): Promise<OrderResponse> => {

    const { data } = await axiosInstance.post(
        ORDER_BASE_URL,
        request
    );

    return data;
};

const getOrder = async (
    id: number
): Promise<OrderResponse> => {

    const { data } =
        await axiosInstance.get(
            `${ORDER_BASE_URL}/${id}`
        );

    return data;
};

const getOrders = async (
    page = 0,
    size = 10
) => {

    const { data } =
        await axiosInstance.get(
            ORDER_BASE_URL,
            {
                params: {
                    page,
                    size
                }
            }
        );

    return data;
};

const cancelOrder = async (
    id: number
): Promise<OrderResponse> => {

    const { data } =
        await axiosInstance.put(
            `${ORDER_BASE_URL}/${id}/cancel`
        );

    return data;
};

export default {
    placeOrder,
    getOrder,
    getOrders,
    cancelOrder
};
