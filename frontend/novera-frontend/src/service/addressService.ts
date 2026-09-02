import axiosInstance from "../api/axios";
import type {
  AddressRequest,
  AddressResponse,
} from "../types/address";

const ADDRESS_BASE_URL =
  `${import.meta.env.VITE_AUTH_API || ""}/api/addresses`;

const getAddresses = async (): Promise<AddressResponse[]> => {
  const { data } = await axiosInstance.get<AddressResponse[]>(
    ADDRESS_BASE_URL
  );

  return data;
};

const getAddress = async (
  id: number
): Promise<AddressResponse> => {
  const { data } = await axiosInstance.get<AddressResponse>(
    `${ADDRESS_BASE_URL}/${id}`
  );

  return data;
};

const addAddress = async (
  request: AddressRequest
): Promise<AddressResponse> => {
  const { data } = await axiosInstance.post<AddressResponse>(
    ADDRESS_BASE_URL,
    request
  );

  return data;
};

const updateAddress = async (
  id: number,
  request: AddressRequest
): Promise<AddressResponse> => {
  const { data } = await axiosInstance.put<AddressResponse>(
    `${ADDRESS_BASE_URL}/${id}`,
    request
  );

  return data;
};

const deleteAddress = async (
  id: number
): Promise<void> => {
  await axiosInstance.delete(
    `${ADDRESS_BASE_URL}/${id}`
  );
};

const addressService = {
  getAddresses,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
};

export default addressService;
