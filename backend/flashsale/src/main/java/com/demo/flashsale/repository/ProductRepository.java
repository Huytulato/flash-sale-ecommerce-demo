package com.demo.flashsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.flashsale.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
  
}
