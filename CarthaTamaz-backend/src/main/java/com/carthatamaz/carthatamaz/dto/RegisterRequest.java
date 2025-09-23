package com.carthatamaz.carthatamaz.dto;

import com.carthatamaz.carthatamaz.entity.User;

public class RegisterRequest {
    public enum  role {
        ADMIN, OWNER, GUEST
    }
    private String fullName;
    private String email;
    private String password;
    private User.Role role; // CLIENT / AGENCY
    private String phonenumber;
// Getters & Setters

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
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

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }
}
