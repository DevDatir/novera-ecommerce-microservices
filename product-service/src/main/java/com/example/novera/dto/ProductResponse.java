package com.example.novera.dto;


import java.math.BigDecimal;
import java.util.List;

import com.example.novera.entity.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer stockQuantity;

    private Double rating;

    private Integer unitsSold;

    private Gender gender;

    private String category;

    private List<String> imageUrls;

}