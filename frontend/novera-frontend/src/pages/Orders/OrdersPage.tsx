import { useNavigate } from "react-router-dom";
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
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    🛍️
                </div>
                <h1 className="text-3xl font-bold text-gray-900">No Orders Found</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    You haven't placed any orders yet. Explore our products and start shopping!
                </p>
                <div className="pt-4 max-w-xs mx-auto">
                    <Button onClick={() => navigate("/products")}>
                        Browse Products
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const s = status.toUpperCase();
        if (s === "CONFIRMED" || s === "PAID" || s === "DELIVERED") {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
        if (s === "PLACED" || s === "PENDING") {
            return "bg-amber-50 text-amber-700 border-amber-200";
        }
        if (s === "CANCELLED") {
            return "bg-rose-50 text-rose-700 border-rose-200";
        }
        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">

            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition mb-2"
                >
                    &larr; Back to Products
                </button>

                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            </div>

            <div className="space-y-6">
                {orderList.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                            <div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Order Number
                                </span>
                                <h3 className="text-lg font-bold text-gray-900">
                                    #{order.id}
                                </h3>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Date Placed
                                </span>
                                <p className="text-sm font-medium text-gray-700">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Total Amount
                                </span>
                                <p className="text-lg font-bold text-gray-900">
                                    ₹{order.totalAmount.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
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
                                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                            >
                                View Order Details &rarr;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
