package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.entity.Review;
import com.carthatamaz.carthatamaz.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}
