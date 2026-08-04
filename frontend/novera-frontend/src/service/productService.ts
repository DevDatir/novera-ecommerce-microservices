import axiosInstance from "../api/axios";
import type { Product } from "../types/product";
import type { PageResponse } from "../types/page";

const PRODUCT_URL = import.meta.env.VITE_PRODUCT_API;

export const getProducts = async (
    page: number,
    size: number,
    sortBy: string = "id",
    direction: string = "asc"
): Promise<PageResponse<Product>> => {

    const response = await axiosInstance.get(
        `${PRODUCT_URL}/api/products`,
        {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        }
    );

    return response.data;

};

export const searchProducts = async (
    keyword: string,
    page: number,
    size: number
): Promise<PageResponse<Product>> => {

    const response = await axiosInstance.get(
        `${PRODUCT_URL}/api/products/search`,
        {
            params: {
                keyword,
                page,
                size
            }
        }
    );

    return response.data;

};

export const getProductsByCategory = async (
    categoryId: number,
    page: number,
    size: number
): Promise<PageResponse<Product>> => {

    const response = await axiosInstance.get(
        `${PRODUCT_URL}/api/products/category/${categoryId}`,
        {
            params: {
                page,
                size
            }
        }
    );

    return response.data;
};

export const getProductsByGender = async (
    gender: string,
    page: number,
    size: number
): Promise<PageResponse<Product>> => {

    const response = await axiosInstance.get(
        `${PRODUCT_URL}/api/products/gender/${gender}`,
        {
            params: {
                page,
                size
            }
        }
    );

    return response.data;
};

export const getProductById = async (
    id: number
): Promise<Product> => {

    const response = await axiosInstance.get(
        `${PRODUCT_URL}/api/products/${id}`
    );

    return response.data;

};