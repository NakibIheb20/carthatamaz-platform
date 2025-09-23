package com.carthatamaz.carthatamaz.repository;

import com.carthatamaz.carthatamaz.entity.SentimentScore;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SentimentScoreRepository extends MongoRepository<SentimentScore, Long> {
    // Additional query methods can be defined here if needed
    // For example:
    // Optional<SentimentScore> findById(Long id);
    // List<SentimentScore> findAll();
    // void deleteById(Long id);
}
