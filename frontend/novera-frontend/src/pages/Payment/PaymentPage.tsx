import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../components/ui/Button";
import { usePayment } from "../../hooks/usePayment";
import type { CreatePaymentResponse } from "../../types/payment";

const PaymentPage = () => {

    const { orderId } = useParams();

    const navigate = useNavigate();

    const { createPaymentMutation, verifyPaymentMutation } = usePayment();

    const [paymentData, setPaymentData] =
        useState<CreatePaymentResponse | null>(null);

    const openRazorpayCheckout = useCallback(
        (payment: CreatePaymentResponse) => {

            if (!window.Razorpay) {
                toast.error("Razorpay SDK failed to load. Please refresh.");
                return;
            }

            const options = {

                key: payment.razorpayKey,

                amount: payment.amount,

                currency: payment.currency,

                order_id: payment.razorpayOrderId,

                name: "Novera",

                description: `Order #${orderId} Payment`,

                handler: async (response: any) => {

                    verifyPaymentMutation.mutate(
                        {

                            razorpayOrderId:
                                response.razorpay_order_id,

                            razorpayPaymentId:
                                response.razorpay_payment_id,

                            razorpaySignature:
                                response.razorpay_signature,

                        },
                        {
                            onSuccess: () => {

                                toast.success(
                                    "Payment Successful!"
                                );

                                navigate("/orders");

                            },

                            onError: (error: any) => {

                                console.error(
                                    "Payment verification failed:",
                                    error
                                );

                                toast.error(
                                    "Payment verification failed. Please try again."
                                );

                            },
                        }
                    );

                },

                modal: {

                    ondismiss: () => {

                        toast.info(
                            "Payment modal closed."
                        );

                    },

                },

                theme: {

                    color: "#2563eb",

                },

            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        },
        [orderId, verifyPaymentMutation, navigate]
    );

    const handleInitiatePayment = useCallback(() => {

        if (!orderId) return;

        if (paymentData) {
            openRazorpayCheckout(paymentData);
            return;
        }

        createPaymentMutation.mutate(
            {
                orderId: Number(orderId),
            },
            {
                onSuccess: (payment) => {

                    setPaymentData(payment);

                    openRazorpayCheckout(payment);

                },

                onError: (error: any) => {

                    console.error("Failed to initialize payment:", error);

                    toast.error(
                        "Unable to initialize payment. Please try again."
                    );

                },

            }
        );

    }, [orderId, paymentData, createPaymentMutation, openRazorpayCheckout]);

    useEffect(() => {

        if (
            orderId &&
            !paymentData &&
            !createPaymentMutation.isPending &&
            !createPaymentMutation.isSuccess
        ) {
            handleInitiatePayment();
        }

    }, [orderId]);

    const isProcessing =
        createPaymentMutation.isPending || verifyPaymentMutation.isPending;

    return (

        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">

            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">

                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    💳
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Complete Your Payment
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Order #{orderId}
                    </p>
                </div>

                {paymentData && (
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span>Amount to Pay:</span>

                            <span className="font-bold text-gray-900">
                                ₹{(paymentData.amount / 100).toFixed(2)}{" "}
                                {paymentData.currency}
                            </span>
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Razorpay Order ID:</span>

                            <span className="font-mono">
                                {paymentData.razorpayOrderId}
                            </span>
                        </div>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <Button
                        onClick={handleInitiatePayment}
                        loading={isProcessing}
                        disabled={isProcessing}
                    >
                        {paymentData
                            ? "Re-open Razorpay Gateway"
                            : "Proceed to Pay with Razorpay"}
                    </Button>

                    <button
                        type="button"
                        onClick={() => navigate("/checkout")}
                        disabled={isProcessing}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium py-2 transition"
                    >
                        Cancel & Return to Checkout
                    </button>
                </div>

            </div>

        </div>

    );

};

export default PaymentPage;