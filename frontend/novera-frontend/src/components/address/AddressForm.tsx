import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../ui/Button";
import Input from "../ui/Input";

import type { AddressResponse } from "../../types/address";
import {
  addressSchema,
} from "../../schemas/addressSchema";
import type z from "zod";

interface Props {
  initialData?: AddressResponse | null;
  loading: boolean;
  onSubmit: (data: AddressFormData) => void;
}

export const AddressForm = ({
  initialData,
  loading,
  onSubmit,
}: Props) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),

    defaultValues: {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    },
  });

useEffect(() => {
    if (initialData) {
        reset(initialData);
    } else {
        reset({
            fullName: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            isDefault: false,
        });
    }
}, [initialData, reset]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2"
    >
      <Input
        label="Full Name"
        {...register("fullName")}
        error={errors.fullName?.message}
      />

      <Input
        label="Phone Number"
        {...register("phone")}
        error={errors.phone?.message}
      />

      <Input
        label="Address Line 1"
        {...register("addressLine1")}
        error={errors.addressLine1?.message}
      />

      <Input
        label="Address Line 2"
        {...register("addressLine2")}
        error={errors.addressLine2?.message}
      />

      <Input
        label="City"
        {...register("city")}
        error={errors.city?.message}
      />

      <Input
        label="State"
        {...register("state")}
        error={errors.state?.message}
      />

      <Input
        label="Postal Code"
        {...register("postalCode")}
        error={errors.postalCode?.message}
      />

      <Input
        label="Country"
        {...register("country")}
        error={errors.country?.message}
      />

      <label className="flex items-center gap-3 mt-4">
        <input
          type="checkbox"
          {...register("isDefault")}
        />

        Set as default address
      </label>

      <Button
        type="submit"
        loading={loading}
        className="mt-6 w-full"
      >
        Save Address
      </Button>
    </form>
  );
};

export type AddressFormData = z.infer<typeof addressSchema>;