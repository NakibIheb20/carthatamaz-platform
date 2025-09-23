package com.carthatamaz.carthatamaz.dto;

import com.carthatamaz.carthatamaz.entity.Reservation;
// import jakarta.validation.constraints.NotNull;

public class ReservationStatusUpdateRequest {

    // @NotNull(message = "Status is required")
    private Reservation.ReservationStatus status;

    private String reason; // For cancellation or rejection

    public ReservationStatusUpdateRequest() {}

    public ReservationStatusUpdateRequest(Reservation.ReservationStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    // Getters and Setters

    public Reservation.ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(Reservation.ReservationStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}