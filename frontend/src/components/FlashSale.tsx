import { useState, useEffect } from 'react';
import type { Product } from '../types/flashsale';
import { flashSaleApi } from '../services/api';

const FlashSale = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [messages, setMessages] = useState<{ [key: number]: { text: string, isError: boolean } }>({});

    // Giả lập ID người dùng đang đăng nhập
    const MOCK_USER_ID = 1;

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await flashSaleApi.getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const handleBuyNow = async (productId: number) => {
        setLoadingId(productId);
        // Xóa thông báo cũ của sản phẩm này
        setMessages(prev => ({ ...prev, [productId]: { text: '', isError: false } }));

        try {
            const response = await flashSaleApi.placeOrder({
                productId,
                userId: MOCK_USER_ID,
                quantity: 1 // Mặc định mỗi lần click mua 1 cái
            });
            
            setMessages(prev => ({ 
                ...prev, 
                [productId]: { text: `${response.message}`, isError: false } 
            }));
            
            // Cập nhật lại số lượng tồn kho trên UI ngay lập tức
            setProducts(prevProducts => 
                prevProducts.map(p => 
                    p.id === productId ? { ...p, stock: p.stock - 1 } : p
                )
            );

        } catch (error: any) {
            // Lấy câu báo lỗi từ Backend Spring Boot gửi lên
            const errorMsg = error.response?.data?.error || 'Lỗi hệ thống hoặc kết nối!';
            setMessages(prev => ({ 
                ...prev, 
                [productId]: { text: `${errorMsg}`, isError: true } 
            }));
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#3498db', fontSize: '28px' }}>🔥 FLASH SALE SỰ KIỆN ĐẶC BIỆT CỦA SAPO🔥</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
                {products.map(product => (
                    <div key={product.id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{product.name}</h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '15px', fontSize: '14px' }}>
                                {product.originalPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span style={{ color: '#3498db', fontSize: '20px', fontWeight: 'bold' }}>
                                {product.salePrice.toLocaleString('vi-VN')}đ
                            </span>
                        </div>

                        <p style={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold', margin: '10px 0' }}>
                            {product.stock > 0 ? `Còn lại: ${product.stock} sản phẩm` : 'Đã hết hàng'}
                        </p>
                        
                        <button 
                            onClick={() => handleBuyNow(product.id)}
                            disabled={loadingId === product.id || product.stock === 0}
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '10px',
                                backgroundColor: product.stock > 0 ? '#3498db' : '#d1d5db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            {loadingId === product.id ? 'Đang xử lý...' : (product.stock > 0 ? 'Mua ngay' : 'Hết hàng')}
                        </button>

                        {messages[product.id] && (
                            <div style={{ 
                                marginTop: '15px', 
                                padding: '10px', 
                                borderRadius: '6px',
                                backgroundColor: messages[product.id].isError ? '#fee2e2' : '#d1fae5',
                                color: messages[product.id].isError ? '#b91c1c' : '#047857',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                {messages[product.id].text}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashSale;