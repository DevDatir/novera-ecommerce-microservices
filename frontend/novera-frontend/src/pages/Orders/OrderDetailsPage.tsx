import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";

import { toast } from "react-toastify";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { useOrder, cancelOrderMutation } = useOrders();

    const orderId = Number(id);
    const { data: order, isLoading, isError } = useOrder(orderId);

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-4">
                <h2 className="font-display text-2xl text-ink-900">Order not found</h2>
                <p className="text-ink-500">
                    We couldn't find the requested order details.
                </p>
                <div className="pt-4 max-w-xs mx-auto">
                    <Button onClick={() => navigate("/orders")}>
                        Back to orders
                    </Button>
                </div>
            </div>
        );
    }

    const handleCancelOrder = () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        cancelOrderMutation.mutate(order.id, {
            onSuccess: () => {
                toast.success("Order cancelled successfully.");
                navigate("/orders");
            },
            onError: () => {
                toast.error("Unable to cancel order.");
            },
        });
    };

    const canCancel =
        order.orderStatus !== "SHIPPED" &&
        order.orderStatus !== "OUT_FOR_DELIVERY" &&
        order.orderStatus !== "DELIVERED" &&
        order.orderStatus !== "CANCELLED";

    return (
        <div className="max-w-4xl mx-auto py-10 sm:py-12 px-4 sm:px-6 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="text-sm font-semibold text-ink-500 hover:text-ink-900 mb-2 inline-block"
                    >
                        &larr; Back to all orders
                    </button>
                    <h1 className="font-display text-3xl text-ink-900">
                        Order #{order.id}
                    </h1>
                </div>

                <div className="text-right">
                    <span className="text-xs font-semibold text-ink-400 block">
                        Order status
                    </span>
                    <span className="inline-block mt-1 px-3 py-1 bg-sand-100 text-ink-800 font-semibold text-sm border border-ink-200">
                        {order.orderStatus}
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* ITEMS LIST */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-ink-900">Items ordered</h2>

                    <div className="bg-white border border-ink-100 divide-y divide-ink-100">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center gap-4">
                                {item.imageUrls && item.imageUrls.length > 0 ? (
                                    <img
                                        src={item.imageUrls[0]}
                                        alt={item.productName}
                                        className="w-16 h-16 object-contain bg-sand-100 p-1.5"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-sand-100 flex items-center justify-center text-ink-400 text-xs">
                                        No image
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h4 className="font-semibold text-ink-900">
                                        {item.productName}
                                    </h4>
                                    <p className="text-sm text-ink-400">
                                        Qty: {item.quantity} &times; ₹{item.priceAtPurchase}
                                    </p>
                                </div>

                                <div className="text-right font-display text-ink-900">
                                    ₹{item.subtotal}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SUMMARY & ADDRESS */}
                <div className="space-y-6">
                    <div className="bg-white border border-ink-100 p-6 space-y-4">
                        <h2 className="text-base font-semibold text-ink-900 border-b border-ink-100 pb-3">
                            Payment details
                        </h2>

                        <div className="flex justify-between text-sm">
                            <span className="text-ink-500">Payment status</span>
                            <span className="font-semibold text-pine-600">
                                {order.paymentStatus}
                            </span>
                        </div>

                        <div className="flex justify-between text-base font-display text-ink-900 pt-2 border-t border-ink-100">
                            <span>Total amount</span>
                            <span>₹{order.totalAmount}</span>
                        </div>
                    </div>

                    {order.shippingAddress && (
                        <div className="bg-white border border-ink-100 p-6 space-y-3">
                            <h2 className="text-base font-semibold text-ink-900 border-b border-ink-100 pb-3">
                                Shipping address
                            </h2>

                            <p className="font-semibold text-ink-900">
                                {order.shippingAddress.fullName}
                            </p>
                            <p className="text-sm text-ink-500">
                                {order.shippingAddress.addressLine1}
                                {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                            </p>
                            <p className="text-sm text-ink-500">
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-sm text-ink-500">
                                Phone: {order.shippingAddress.phone}
                            </p>
                        </div>
                    )}

                    {canCancel && (
                        <Button
                            variant="danger"
                            onClick={handleCancelOrder}
                            loading={cancelOrderMutation.isPending}
                            className="w-full"
                        >
                            Cancel order
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
