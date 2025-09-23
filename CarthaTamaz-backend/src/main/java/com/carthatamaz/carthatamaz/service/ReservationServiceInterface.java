package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.entity.Reservation;

import java.util.List;
import java.util.Optional;

public interface ReservationServiceInterface {

    Reservation createReservation(Reservation reservation);
    List<Reservation> getReservationsByGuestId(String guestId);
    List<Reservation> getReservationsByGuesthouseId(String guesthouseId);
    Optional<Reservation> getReservationById(String id);
    Reservation updateReservation(String id, Reservation updatedReservation);
    void cancelReservation(String id);
}
