export interface Product {
    id: number;
    name: string;
    originalPrice: number;
    salePrice: number;
    stock: number;
}

export interface OrderRequest {
    productId: number;
    userId: number;
    quantity: number;
}

export interface OrderResponse {
    success: boolean;
    message: string;
    orderId?: number;
}

export interface ErrorResponse {
    error: string;
}