package com.demo.flashsale.controller;
import com.demo.flashsale.dto.ErrorResponse;
import com.demo.flashsale.dto.OrderRequest;
import com.demo.flashsale.dto.OrderResponse;
import com.demo.flashsale.service.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flash-sale")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cấp phép cho Frontend gọi API
public class FlashSaleController {
  private final FlashSaleService flashSaleService;

    @PostMapping("/order")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        try {
            OrderResponse response = flashSaleService.processOrder(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Bắt lỗi từ Service (hết hàng, vượt limit) và trả về HTTP 400
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
