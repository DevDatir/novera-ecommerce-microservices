import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import addressService from "../service/addressService";
import type { AddressRequest } from "../types/address";

const ADDRESS_QUERY_KEY = ["addresses"];

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const addressesQuery = useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: addressService.getAddresses,
  });

  const addAddressMutation = useMutation({
    mutationFn: addressService.addAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEY,
      });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: AddressRequest;
    }) => addressService.updateAddress(id, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEY,
      });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: addressService.deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEY,
      });
    },
  });

  return {
    addresses: addressesQuery.data,
    isLoading: addressesQuery.isLoading,
    isError: addressesQuery.isError,
    error: addressesQuery.error,

    addAddressMutation,
    updateAddressMutation,
    deleteAddressMutation,
  };
};