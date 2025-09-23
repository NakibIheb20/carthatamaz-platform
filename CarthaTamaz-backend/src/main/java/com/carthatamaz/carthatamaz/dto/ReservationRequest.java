package com.carthatamaz.carthatamaz.dto;

// import jakarta.validation.constraints.Future;
// import jakarta.validation.constraints.Min;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReservationRequest {

    // @NotBlank(message = "Guesthouse ID is required")
    private String guesthouseId;

    // @NotNull(message = "Check-in date is required")
    // @Future(message = "Check-in date must be in the future")
    private LocalDate checkIn;

    // @NotNull(message = "Check-out date is required")
    // @Future(message = "Check-out date must be in the future")
    private LocalDate checkOut;

    // @Min(value = 1, message = "At least 1 guest is required")
    private int guestsCount;

    private String specialRequests;

    private BigDecimal totalPrice;

    public ReservationRequest() {}

    public ReservationRequest(String guesthouseId, LocalDate checkIn, LocalDate checkOut, 
                             int guestsCount, String specialRequests, BigDecimal totalPrice) {
        this.guesthouseId = guesthouseId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.guestsCount = guestsCount;
        this.specialRequests = specialRequests;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters

    public String getGuesthouseId() {
        return guesthouseId;
    }

    public void setGuesthouseId(String guesthouseId) {
        this.guesthouseId = guesthouseId;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public int getGuestsCount() {
        return guestsCount;
    }

    public void setGuestsCount(int guestsCount) {
        this.guestsCount = guestsCount;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    // Validation method
    public boolean isValidDateRange() {
        return checkIn != null && checkOut != null && checkOut.isAfter(checkIn);
    }
}