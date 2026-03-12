package com.demo.flashsale.dto;

public record OrderRequest(Long productId, Long userId, Integer quantity) {
}
