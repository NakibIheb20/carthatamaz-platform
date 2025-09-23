package com.carthatamaz.carthatamaz.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Document(collection = "sentiment_scores")
public class SentimentScore {

    @Id
    private String id;  // En MongoDB, l'id est souvent une String (ObjectId)

    @DBRef
    private Review review;

    private double score;
    private String label; // POSITIVE, NEGATIVE, NEUTRAL

    public SentimentScore() {
    }

    public SentimentScore(String id, Review review, double score, String label) {
        this.id = id;
        this.review = review;
        this.score = score;
        this.label = label;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
