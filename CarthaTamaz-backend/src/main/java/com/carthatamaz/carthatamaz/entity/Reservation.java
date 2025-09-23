package com.carthatamaz.carthatamaz.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "reservations")
public class Reservation {

    public enum ReservationStatus {
        PENDING, CONFIRMED, CANCELED, COMPLETED, REJECTED
    }

    @Id
    private String id;

    @DBRef
    private User guest;

    @DBRef
    private Guesthouse guesthouse;

    private LocalDate checkIn;
    private LocalDate checkOut;
    private int guestsCount;
    private ReservationStatus status = ReservationStatus.PENDING;
    
    private BigDecimal totalPrice;
    private String specialRequests;
    private String cancellationReason;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime confirmedAt;
    private LocalDateTime canceledAt;

    public Reservation() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Reservation(User guest, Guesthouse guesthouse, LocalDate checkIn,
                       LocalDate checkOut, int guestsCount) {
        this();
        this.guest = guest;
        this.guesthouse = guesthouse;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.guestsCount = guestsCount;
    }

    public Reservation(String id, User guest, Guesthouse guesthouse, LocalDate checkIn,
                       LocalDate checkOut, int guestsCount, ReservationStatus status) {
        this(guest, guesthouse, checkIn, checkOut, guestsCount);
        this.id = id;
        this.status = status;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getGuest() {
        return guest;
    }

    public void setGuest(User guest) {
        this.guest = guest;
    }

    public Guesthouse getGuesthouse() {
        return guesthouse;
    }

    public void setGuesthouse(Guesthouse guesthouse) {
        this.guesthouse = guesthouse;
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

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
        
        if (status == ReservationStatus.CONFIRMED && this.confirmedAt == null) {
            this.confirmedAt = LocalDateTime.now();
        } else if (status == ReservationStatus.CANCELED && this.canceledAt == null) {
            this.canceledAt = LocalDateTime.now();
        }
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
        return checkIn != null && checkOut != null ? 
            java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut) : 0;
    }

    public void confirm() {
        setStatus(ReservationStatus.CONFIRMED);
    }

    public void cancel(String reason) {
        setStatus(ReservationStatus.CANCELED);
        setCancellationReason(reason);
    }

    public void reject(String reason) {
        setStatus(ReservationStatus.REJECTED);
        setCancellationReason(reason);
    }

    public void complete() {
        setStatus(ReservationStatus.COMPLETED);
    }
}
