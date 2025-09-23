package com.carthatamaz.carthatamaz.repository;

import com.carthatamaz.carthatamaz.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends MongoRepository<Review, Long> {
    // Additional query methods can be defined here if needed
    // For example:
    // List<Review> findByCarId(Long carId);
    // List<Review> findByUserId(Long userId);
    // void deleteById(Long id);
}
