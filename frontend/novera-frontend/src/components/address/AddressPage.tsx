import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";

import AddressCard from "../../components/address/AddressCard";
import AddressModal from "../../components/address/AddressModal";
import EmptyAddress from "../../components/address/EmptyAddress";
import { AddressForm } from "../../components/address/AddressForm";
import type { AddressRequest } from "../../types/address";
import type { AddressResponse } from "../../types/address";
import type { AddressFormData } from "../../schemas/addressSchema";

import { useAddresses } from "../../hooks/useAddresses";

const AddressPage = () => {
  const navigate = useNavigate();
  const {
    addresses,
    isLoading,
    addAddressMutation,
    updateAddressMutation,
    deleteAddressMutation,
  } = useAddresses();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponse | null>(null);

  const openAddModal = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: AddressResponse) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAddress(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (data: AddressFormData) => {
    const request: AddressRequest = {
      ...data,
    };

    if (selectedAddress) {
      updateAddressMutation.mutate(
        {
          id: selectedAddress.id,
          request,
        },
        {
          onSuccess: () => {
            toast.success("Address updated");
            closeModal();
          },

          onError: () => {
            toast.error("Unable to update address");
          },
        }
      );
    } else {
      addAddressMutation.mutate(request, {
        onSuccess: () => {
          toast.success("Address added");
          closeModal();
        },

        onError: () => {
          toast.error("Unable to add address");
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this address?")) {
      return;
    }

    deleteAddressMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Address deleted");
      },

      onError: () => {
        toast.error("Unable to delete address");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-20 text-center text-ink-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">

      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="inline-flex items-center text-sm font-semibold text-ink-500 hover:text-ink-900 transition mb-2"
        >
          &larr; Back to products
        </button>

        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-ink-900">
            Saved addresses
          </h1>

          <Button size="sm" onClick={openAddModal}>
            + Add address
          </Button>
        </div>
      </div>

      {addresses?.length === 0 ? (
        <EmptyAddress onAdd={openAddModal} />
      ) : (
        <div className="space-y-5">
          {addresses?.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => openEditModal(address)}
              onDelete={() => handleDelete(address.id)}
            />
          ))}
        </div>
      )}

      <AddressModal
        open={isModalOpen}
        onClose={closeModal}
        title={
          selectedAddress
            ? "Edit Address"
            : "Add Address"
        }
      >
        <AddressForm
          initialData={selectedAddress}
          loading={
            addAddressMutation.isPending ||
            updateAddressMutation.isPending
          }
          onSubmit={handleSubmit}
        />
      </AddressModal>

    </div>
  );
};

export default AddressPage;