import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";

import type { OrderSummaryResponse } from "../../types/order";

const OrdersPage = () => {
    const navigate = useNavigate();
    const { orders, isLoading } = useOrders();

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const orderList: OrderSummaryResponse[] = orders?.content || [];

    if (orderList.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-4">
                <div className="w-16 h-16 bg-sand-100 flex items-center justify-center mx-auto">
                    <Package className="text-ink-400" size={28} />
                </div>
                <h1 className="font-display text-3xl text-ink-900">No orders found</h1>
                <p className="text-ink-500 max-w-md mx-auto">
                    You haven't placed any orders yet. Explore our products and start shopping!
                </p>
                <div className="pt-4 max-w-xs mx-auto">
                    <Button onClick={() => navigate("/products")}>
                        Browse products
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const s = status.toUpperCase();
        if (s === "CONFIRMED" || s === "PAID" || s === "DELIVERED") {
            return "bg-pine-500/10 text-pine-600 border-pine-500/20";
        }
        if (s === "PLACED" || s === "PENDING") {
            return "bg-amber-50 text-amber-700 border-amber-200";
        }
        if (s === "CANCELLED") {
            return "bg-red-50 text-red-700 border-red-200";
        }
        return "bg-sand-100 text-ink-700 border-ink-200";
    };

    return (
        <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6">

            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="inline-flex items-center text-sm font-semibold text-ink-500 hover:text-ink-900 transition mb-2"
                >
                    &larr; Back to products
                </button>

                <h1 className="font-display text-3xl text-ink-900">My orders</h1>
            </div>

            <div className="space-y-4">
                {orderList.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-ink-100 p-6 space-y-4"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ink-100">
                            <div>
                                <span className="text-xs font-semibold text-ink-400">
                                    Order number
                                </span>
                                <h3 className="text-lg font-display text-ink-900">
                                    #{order.id}
                                </h3>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-ink-400">
                                    Date placed
                                </span>
                                <p className="text-sm font-medium text-ink-700">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-ink-400">
                                    Total amount
                                </span>
                                <p className="text-lg font-display text-ink-900">
                                    ₹{order.totalAmount.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <span
                                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold border ${getStatusBadge(
                                        order.orderStatus
                                    )}`}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className="inline-flex items-center text-sm font-semibold text-ink-900 hover:text-primary-500 transition"
                            >
                                View order details &rarr;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
