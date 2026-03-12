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
    // Mock Data
    getProducts: async (): Promise<Product[]> => {
        return [
            { id: 1, name: "Iphone 15 Pro Max 256GB", originalPrice: 30000000, salePrice: 15000000, stock: 5 },
            { id: 2, name: "MacBook Air M2", originalPrice: 25000000, salePrice: 12500000, stock: 2 }
        ];
    },
    
    placeOrder: async (data: OrderRequest): Promise<OrderResponse> => {
        const response = await apiClient.post<OrderResponse>('/flash-sale/order', data);
        return response.data;
    }
};
