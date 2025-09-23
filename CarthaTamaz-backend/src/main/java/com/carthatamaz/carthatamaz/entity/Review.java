package com.carthatamaz.carthatamaz.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String idReview;
    private String reviewText;
    private int rating;
    private String username;
    private String language;
    private String title;
    private String description;
    private String cityListing;
    private double sentimentScore;
    private Instant createdAt;

    public Review() {}

    public Review(String id, String idReview, String reviewText, int rating, String username,
                  String language, String title, String description, String cityListing,
                  double sentimentScore, Instant createdAt) {
        this.id = id;
        this.idReview = idReview;
        this.reviewText = reviewText;
        this.rating = rating;
        this.username = username;
        this.language = language;
        this.title = title;
        this.description = description;
        this.cityListing = cityListing;
        this.sentimentScore = sentimentScore;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdReview() {
        return idReview;
    }

    public void setIdReview(String idReview) {
        this.idReview = idReview;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCityListing() {
        return cityListing;
    }

    public void setCityListing(String cityListing) {
        this.cityListing = cityListing;
    }

    public double getSentimentScore() {
        return sentimentScore;
    }

    public void setSentimentScore(double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
