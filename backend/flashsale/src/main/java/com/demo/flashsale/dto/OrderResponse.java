package com.demo.flashsale.dto;

public record OrderResponse(boolean success, String message, Long orderId) {
}
