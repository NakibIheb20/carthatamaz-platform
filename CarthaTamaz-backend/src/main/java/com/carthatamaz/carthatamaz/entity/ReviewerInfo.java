package com.carthatamaz.carthatamaz.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;


@Document(collection = "reviewerInfo")
public class ReviewerInfo {

    @Field("reviewerId")
    private Long reviewerId;

    @Field("firstName")
    private String firstName;

    @Field("profilePicture")
    private String profilePicture;

    @Field("profilePath")
    private String profilePath;

    public ReviewerInfo() {
    }

    public ReviewerInfo(Long reviewerId, String firstName, String profilePicture, String profilePath) {
        this.reviewerId = reviewerId;
        this.firstName = firstName;
        this.profilePicture = profilePicture;
        this.profilePath = profilePath;
    }

    public Long getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getProfilePath() {
        return profilePath;
    }

    public void setProfilePath(String profilePath) {
        this.profilePath = profilePath;
    }
}
