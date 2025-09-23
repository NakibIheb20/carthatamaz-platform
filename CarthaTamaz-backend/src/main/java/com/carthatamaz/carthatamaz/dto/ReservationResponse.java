package com.carthatamaz.carthatamaz.dto;

import com.carthatamaz.carthatamaz.entity.Reservation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservationResponse {

    private String id;
    private String guestId;
    private String guestName;
    private String guestEmail;
    private String guesthouseId;
    private String guesthouseTitle;
    private String guesthouseThumbnail;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private int guestsCount;
    private Reservation.ReservationStatus status;
    private BigDecimal totalPrice;
    private String specialRequests;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime canceledAt;
    private long nights;

    public ReservationResponse() {}

    public ReservationResponse(Reservation reservation) {
        this.id = reservation.getId();
        this.guestId = reservation.getGuest().getId();
        this.guestName = reservation.getGuest().getFullName();
        this.guestEmail = reservation.getGuest().getEmail();
        this.guesthouseId = reservation.getGuesthouse().getId();
        this.guesthouseTitle = reservation.getGuesthouse().getTitle();
        this.guesthouseThumbnail = reservation.getGuesthouse().getThumbnail();
        this.checkIn = reservation.getCheckIn();
        this.checkOut = reservation.getCheckOut();
        this.guestsCount = reservation.getGuestsCount();
        this.status = reservation.getStatus();
        this.totalPrice = reservation.getTotalPrice();
        this.specialRequests = reservation.getSpecialRequests();
        this.cancellationReason = reservation.getCancellationReason();
        this.createdAt = reservation.getCreatedAt();
        this.updatedAt = reservation.getUpdatedAt();
        this.confirmedAt = reservation.getConfirmedAt();
        this.canceledAt = reservation.getCanceledAt();
        this.nights = reservation.getNights();
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGuestId() {
        return guestId;
    }

    public void setGuestId(String guestId) {
        this.guestId = guestId;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getGuestEmail() {
        return guestEmail;
    }

    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    public String getGuesthouseId() {
        return guesthouseId;
    }

    public void setGuesthouseId(String guesthouseId) {
        this.guesthouseId = guesthouseId;
    }

    public String getGuesthouseTitle() {
        return guesthouseTitle;
    }

    public void setGuesthouseTitle(String guesthouseTitle) {
        this.guesthouseTitle = guesthouseTitle;
    }

    public String getGuesthouseThumbnail() {
        return guesthouseThumbnail;
    }

    public void setGuesthouseThumbnail(String guesthouseThumbnail) {
        this.guesthouseThumbnail = guesthouseThumbnail;
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

    public Reservation.ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(Reservation.ReservationStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public LocalDateTime getCanceledAt() {
        return canceledAt;
    }

    public void setCanceledAt(LocalDateTime canceledAt) {
        this.canceledAt = canceledAt;
    }

    public long getNights() {
        return nights;
    }

    public void setNights(long nights) {
        this.nights = nights;
    }
}