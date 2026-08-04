export interface CreatePaymentRequest {
    orderId: number;
}

export interface CreatePaymentResponse {

    razorpayOrderId: string;

    razorpayKey: string;

    paymentId: number;

    currency: string;

    amount: number;
}

export interface VerifyPaymentRequest {

    razorpayOrderId: string;

    razorpayPaymentId: string;

    razorpaySignature: string;
}

export interface VerifyPaymentResponse {

    paymentId: number;

    paymentStatus: string;

    message: string;
}