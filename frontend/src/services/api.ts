import axios from 'axios';
import type { OrderRequest, OrderResponse, Product } from '../types/flashsale';

// URL của Spring Boot Backend 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const flashSaleApi = {
    // Gọi xuống backend để lấy danh sách sản phẩm 
    getProducts: async (): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>('/flash-sale/products');
        return response.data;
    },
    
    placeOrder: async (data: OrderRequest): Promise<OrderResponse> => {
        const response = await apiClient.post<OrderResponse>('/flash-sale/order', data);
        return response.data;
    }
};
