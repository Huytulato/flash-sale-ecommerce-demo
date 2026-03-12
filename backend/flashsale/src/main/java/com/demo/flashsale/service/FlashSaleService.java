package com.demo.flashsale.service;

import com.demo.flashsale.dto.OrderRequest;
import com.demo.flashsale.dto.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashSaleService {

    private final StringRedisTemplate redisTemplate;

    // Lua Script: Kiểm tra tồn kho và limit user cùng một lúc trên Redis (Atomic)
    private static final String FLASH_SALE_LUA_SCRIPT = """
            local stockKey = KEYS[1]
            local userKey = KEYS[2]
            local requestQty = tonumber(ARGV[1])
            local maxLimit = tonumber(ARGV[2])

            -- 1. Lấy tồn kho hiện tại
            local currentStock = tonumber(redis.call('get', stockKey) or "0")
            if currentStock < requestQty then
                return 1 -- Lỗi 1: Hết hàng
            end

            -- 2. Kiểm tra user đã mua bao nhiêu
            local userBought = tonumber(redis.call('get', userKey) or "0")
            if userBought + requestQty > maxLimit then
                return 2 -- Lỗi 2: Vượt giới hạn mua
            end

            -- 3. Trừ tồn kho và cộng dồn số lượng user đã mua
            redis.call('decrby', stockKey, requestQty)
            redis.call('incrby', userKey, requestQty)
            return 0 -- Thành công
            """;

    public OrderResponse processOrder(OrderRequest request) {
        // Tạo key lưu trên Redis
        String stockKey = "flashsale:product:" + request.productId() + ":stock";
        String userKey = "flashsale:product:" + request.productId() + ":user:" + request.userId();

        List<String> keys = Arrays.asList(stockKey, userKey);

        // Thực thi Lua script
        DefaultRedisScript<Long> script = new DefaultRedisScript<>(FLASH_SALE_LUA_SCRIPT, Long.class);
        Long result = redisTemplate.execute(script, keys, String.valueOf(request.quantity()), "2"); // Giới hạn là 2

        if (result == null) {
            throw new RuntimeException("Lỗi hệ thống Redis.");
        }
        if (result == 1) {
            throw new RuntimeException("Sản phẩm đã hết hàng hoặc không đủ số lượng!");
        }
        if (result == 2) {
            throw new RuntimeException("Bạn đã vượt quá giới hạn mua cho sản phẩm này (tối đa 2 sản phẩm).");
        }

        return new OrderResponse(true, "Đặt hàng thành công!", System.currentTimeMillis());
    }
}
