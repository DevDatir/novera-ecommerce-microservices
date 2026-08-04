import axiosInstance from "../api/axios";

import type {

    CreatePaymentRequest,

    CreatePaymentResponse,

    VerifyPaymentRequest,

    VerifyPaymentResponse,

} from "../types/payment";

const PAYMENT_BASE_URL =
    `${import.meta.env.VITE_PAYMENT_API}/api/payments`;

const createPayment = async (
    request: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {

    const { data } =
        await axiosInstance.post(
            PAYMENT_BASE_URL,
            request
        );

    return data;
};

const verifyPayment = async (
    request: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> => {

    const { data } =
        await axiosInstance.post(
            `${PAYMENT_BASE_URL}/verify`,
            request
        );

    return data;
};

export default {

    createPayment,

    verifyPayment,

};