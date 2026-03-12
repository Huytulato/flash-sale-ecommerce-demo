package com.demo.flashsale.repository;

import com.demo.flashsale.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Spring Data JPA sẽ tự động dịch tên hàm này thành câu lệnh SQL: 
    // SELECT COUNT(*) FROM orders WHERE user_id = ? AND product_id = ?
    int countByUserIdAndProductId(Long userId, Long productId);
}
