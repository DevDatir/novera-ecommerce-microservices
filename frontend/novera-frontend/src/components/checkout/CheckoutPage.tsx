import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";

import AddressSelector from "../../components/checkout/AddressSelector";
import CheckoutItem from "../../components/checkout/CheckoutItem";
import CheckoutSummary from "../../components/checkout/CheckoutSummary";

import AddressModal from "../../components/address/AddressModal";
import { AddressForm } from "../../components/address/AddressForm";
import type { AddressRequest } from "../../types/address";

import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { useOrders } from "../../hooks/useOrders";

import type { AddressResponse } from "../../types/address";
import type { AddressFormData } from "../../schemas/addressSchema";

const CheckoutPage = () => {

    const navigate = useNavigate();

    const {
        cart,
        isLoading: cartLoading,
    } = useCart();

    const {
        addresses,
        isLoading: addressLoading,
        addAddressMutation,
    } = useAddresses();

    const {
        placeOrderMutation,
    } = useOrders();

    const [selectedAddressId, setSelectedAddressId] =
        useState<number>();

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    useEffect(() => {

        if (!addresses?.length) return;

        const defaultAddress =
            addresses.find(
                a => a.isDefault
            );

        if (defaultAddress) {
            setSelectedAddressId(
                defaultAddress.id
            );
        } else {
            setSelectedAddressId(
                addresses[0].id
            );
        }

    }, [addresses]);

    if (cartLoading || addressLoading) {
        return (
            <div className="p-20 text-center text-ink-400">
                Loading...
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="p-20 text-center text-ink-400">
                Your cart is empty.
            </div>
        );
    }

    const totalItems =
        cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

    const subtotal =
        cart.items.reduce(
            (sum, item) => {
                const itemPrice = item.product?.price || 0;
                const itemSubtotal = (typeof item.subtotal === "number" && !isNaN(item.subtotal))
                    ? item.subtotal
                    : itemPrice * item.quantity;
                return sum + itemSubtotal;
            },
            0
        );

    const handlePlaceOrder = () => {

        if (!selectedAddressId) {
            toast.error(
                "Please select an address."
            );
            return;
        }

        placeOrderMutation.mutate(
            {
                addressId:
                    selectedAddressId,
            },
            {
                onSuccess: (order) => {

                    toast.success(
                        "Order placed successfully!"
                    );

                    navigate(
                        `/payment/${order.id}`
                    );

                },

                onError: () => {

                    toast.error(
                        "Unable to place order."
                    );

                },
            }
        );

    };

    const handleAddAddress = (
        data: AddressFormData
    ) => {

        const request: AddressRequest = {
            ...data,
        };

        addAddressMutation.mutate(
            request,
            {

                onSuccess: (
                    address: AddressResponse
                ) => {

                    toast.success(
                        "Address added."
                    );

                    setSelectedAddressId(
                        address.id
                    );

                    setIsModalOpen(false);

                },

                onError: () => {

                    toast.error(
                        "Unable to add address."
                    );

                },

            }
        );

    };

    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="inline-flex items-center text-sm font-semibold text-ink-500 hover:text-ink-900 transition mb-2"
                >
                    &larr; Back to cart
                </button>

                <h1 className="font-display text-3xl text-ink-900">
                    Checkout
                </h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* LEFT */}

                <div className="lg:col-span-2 space-y-8">

                    <div>

                        <div className="flex justify-between items-center mb-4">

                            <h2 className="text-xl font-semibold text-ink-900">
                                Shipping address
                            </h2>

                            <Button
                                size="sm"
                                onClick={() =>
                                    setIsModalOpen(true)
                                }
                            >
                                + Add address
                            </Button>

                        </div>

                        <AddressSelector
                            addresses={
                                addresses ?? []
                            }
                            selectedId={
                                selectedAddressId
                            }
                            onSelect={
                                setSelectedAddressId
                            }
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-semibold text-ink-900 mb-4">
                            Order items
                        </h2>

                        <div className="space-y-4">

                            {cart.items.map(item => (

                                <CheckoutItem
                                    key={
                                        item.product.id
                                    }
                                    item={item}
                                />

                            ))}

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <CheckoutSummary
                    subtotal={subtotal}
                    totalItems={totalItems}
                    loading={
                        placeOrderMutation.isPending
                    }
                    onCheckout={
                        handlePlaceOrder
                    }
                />

            </div>

            <AddressModal
                open={isModalOpen}
                title="Add Address"
                onClose={() =>
                    setIsModalOpen(false)
                }
            >

                <AddressForm
                    loading={
                        addAddressMutation.isPending
                    }
                    onSubmit={
                        handleAddAddress
                    }
                />

            </AddressModal>

        </div>

    );
};

export default CheckoutPage;