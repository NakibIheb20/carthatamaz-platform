package com.carthatamaz.carthatamaz.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;
import java.util.List;

@Document(collection = "users") // nom de la collection MongoDB
public class User {

    public enum Role {
        ADMIN, OWNER, GUEST
    }

    @Id
    private String id; // MongoDB utilise des IDs String par défaut

    private String fullName;
    @Indexed(unique = true)
    private String email;
    private String password;
    private String phonenumber;
    private Date birthday;
    private String picture_url;
    private Role role;

    @DBRef
    private List<Review> reviews;

    @DBRef
    private List<Message> sentMessages;

    @DBRef
    private List<Message> receivedMessages;

    public User() {}

    public User(String id, String fullName, String picture_url, Role role, String email, String phonenumber, Date birthday,
                List<Review> reviews, List<Message> sentMessages, List<Message> receivedMessages) {
        this.id = id;
        this.fullName = fullName;
        this.picture_url = picture_url;
        this.role = role;
        this.email = email;
        this.phonenumber = phonenumber;
        this.birthday = birthday;
        this.reviews = reviews;
        this.sentMessages = sentMessages;
        this.receivedMessages = receivedMessages;
    }

    // Getters & Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getPicture_url() {
        return picture_url;
    }

    public void setPicture_url(String picture_url) {
        this.picture_url = picture_url;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public List<Message> getSentMessages() {
        return sentMessages;
    }

    public void setSentMessages(List<Message> sentMessages) {
        this.sentMessages = sentMessages;
    }

    public List<Message> getReceivedMessages() {
        return receivedMessages;
    }

    public void setReceivedMessages(List<Message> receivedMessages) {
        this.receivedMessages = receivedMessages;
    }
}
