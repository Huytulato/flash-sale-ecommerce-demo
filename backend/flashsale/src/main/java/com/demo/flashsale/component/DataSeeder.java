package com.demo.flashsale.component;

import com.demo.flashsale.entity.Product;
import com.demo.flashsale.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final StringRedisTemplate redisTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Chỉ thêm dữ liệu nếu bảng Product đang trống
        if (productRepository.count() == 0) {
            System.out.println("🌱 Đang khởi tạo dữ liệu mẫu cho Flash Sale...");

            Product p1 = new Product();
            p1.setName("Iphone 15 Pro Max 256GB");
            p1.setOriginalPrice(30000000.0);
            p1.setSalePrice(15000000.0);
            p1.setStock(5);

            Product p2 = new Product();
            p2.setName("MacBook Air M2");
            p2.setOriginalPrice(25000000.0);
            p2.setSalePrice(12500000.0);
            p2.setStock(2);

            // Lưu vào PostgreSQL
            productRepository.saveAll(List.of(p1, p2));

            // Bơm số lượng tồn kho lên Redis theo đúng cấu trúc Key mà Lua Script sẽ đọc
            redisTemplate.opsForValue().set("flashsale:product:" + p1.getId() + ":stock", String.valueOf(p1.getStock()));
            redisTemplate.opsForValue().set("flashsale:product:" + p2.getId() + ":stock", String.valueOf(p2.getStock()));

            System.out.println("✅ Khởi tạo dữ liệu thành công! ID iPhone: " + p1.getId() + ", ID MacBook: " + p2.getId());
        } else {
            System.out.println("⚡ Dữ liệu Flash Sale đã tồn tại, bỏ qua Seeder.");
        }
    }
}
