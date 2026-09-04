import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard } from "lucide-react";

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

                    color: "#ff4b1f",

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

        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-sand-50">

            <div className="bg-white border border-ink-100 p-8 max-w-md w-full text-center space-y-6">

                <div className="w-14 h-14 bg-primary-50 text-primary-500 flex items-center justify-center mx-auto">
                    <CreditCard size={24} />
                </div>

                <div>
                    <h2 className="font-display text-2xl text-ink-900">
                        Complete your payment
                    </h2>

                    <p className="text-sm text-ink-400 mt-1">
                        Order #{orderId}
                    </p>
                </div>

                {paymentData && (
                    <div className="bg-sand-50 p-4 space-y-2 text-sm text-ink-700">
                        <div className="flex justify-between">
                            <span>Amount to pay</span>

                            <span className="font-semibold text-ink-900">
                                ₹{(paymentData.amount / 100).toFixed(2)}{" "}
                                {paymentData.currency}
                            </span>
                        </div>

                        <div className="flex justify-between text-xs text-ink-400">
                            <span>Razorpay order ID</span>

                            <span className="font-mono">
                                {paymentData.razorpayOrderId}
                            </span>
                        </div>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <Button
                        className="w-full"
                        onClick={handleInitiatePayment}
                        loading={isProcessing}
                        disabled={isProcessing}
                    >
                        {paymentData
                            ? "Re-open Razorpay gateway"
                            : "Proceed to pay with Razorpay"}
                    </Button>

                    <button
                        type="button"
                        onClick={() => navigate("/checkout")}
                        disabled={isProcessing}
                        className="w-full text-sm text-ink-500 hover:text-ink-800 font-medium py-2 transition"
                    >
                        Cancel & return to checkout
                    </button>
                </div>

            </div>

        </div>

    );

};

export default PaymentPage;