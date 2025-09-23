package com.carthatamaz.carthatamaz.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

@Document(collection = "guesthouses")
public class Guesthouse {

    @Id
    private String id; // MongoDB ID

    // Essential attributes from cleaned CSV dataset
    private String thumbnail;           // Image URL
    private String title;              // Property title
    private String description;        // Property description
    private int reviewsCount;          // Number of reviews (rating/reviewsCount)
    private String price;              // Price per night (price/price)
    private String priceLabel;         // Price label (price/label)
    private double latitude;           // Location coordinates
    private double longitude;          // Location coordinates
    private String url;                // External property URL
    private String city;               // City location

    // Additional fields for platform functionality
    @DBRef
    private User owner;

    @DBRef
    private List<Review> reviews;

    // Constructors
    public Guesthouse() {}

    public Guesthouse(String thumbnail, String title, String description, int reviewsCount,
                      String price, String priceLabel, double latitude, double longitude,
                      String url, String city) {
        this.thumbnail = thumbnail;
        this.title = title;
        this.description = description;
        this.reviewsCount = reviewsCount;
        this.price = price;
        this.priceLabel = priceLabel;
        this.latitude = latitude;
        this.longitude = longitude;
        this.url = url;
        this.city = city;
    }

    // Getters & Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
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

    public int getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(int reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getPriceLabel() {
        return priceLabel;
    }

    public void setPriceLabel(String priceLabel) {
        this.priceLabel = priceLabel;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    @Override
    public String toString() {
        return "Guesthouse{" +
                "id='" + id + '\'' +
                ", thumbnail='" + thumbnail + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", reviewsCount=" + reviewsCount +
                ", price='" + price + '\'' +
                ", priceLabel='" + priceLabel + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", url='" + url + '\'' +
                ", city='" + city + '\'' +
                '}';
    }
}
