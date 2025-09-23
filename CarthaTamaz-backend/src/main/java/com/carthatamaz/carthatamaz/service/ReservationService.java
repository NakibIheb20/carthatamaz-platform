package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.dto.ReservationRequest;
import com.carthatamaz.carthatamaz.dto.ReservationResponse;
import com.carthatamaz.carthatamaz.entity.Guesthouse;
import com.carthatamaz.carthatamaz.entity.Reservation;
import com.carthatamaz.carthatamaz.entity.User;
import com.carthatamaz.carthatamaz.repository.GuestHouseRepository;
import com.carthatamaz.carthatamaz.repository.ReservationRepository;
import com.carthatamaz.carthatamaz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationService implements ReservationServiceInterface {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GuestHouseRepository guestHouseRepository;

    @Override
    public Reservation createReservation(Reservation reservation) {
        // Validate dates
        if (!isValidDateRange(reservation.getCheckIn(), reservation.getCheckOut())) {
            throw new IllegalArgumentException("Invalid date range");
        }

        // Check for conflicts
        if (hasConflictingReservations(reservation.getGuesthouse().getId(), 
                                     reservation.getCheckIn(), reservation.getCheckOut())) {
            throw new IllegalArgumentException("Dates are not available");
        }

        reservation.setStatus(Reservation.ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    public ReservationResponse createReservation(ReservationRequest request, String guestId) {
        // Validate guest
        User guest = userRepository.findById(guestId)
            .orElseThrow(() -> new IllegalArgumentException("Guest not found"));

        // Validate guesthouse
        Guesthouse guesthouse = guestHouseRepository.findById(request.getGuesthouseId())
            .orElseThrow(() -> new IllegalArgumentException("Guesthouse not found"));

        // Validate dates
        if (!request.isValidDateRange()) {
            throw new IllegalArgumentException("Invalid date range");
        }

        // Check for conflicts
        if (hasConflictingReservations(request.getGuesthouseId(), 
                                     request.getCheckIn(), request.getCheckOut())) {
            throw new IllegalArgumentException("Dates are not available");
        }

        // Create reservation
        Reservation reservation = new Reservation(guest, guesthouse, request.getCheckIn(), 
                                                request.getCheckOut(), request.getGuestsCount());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setTotalPrice(request.getTotalPrice());

        Reservation saved = reservationRepository.save(reservation);
        return new ReservationResponse(saved);
    }

    @Override
    public List<Reservation> getReservationsByGuestId(String guestId) {
        return reservationRepository.findByGuestId(guestId);
    }

    public List<ReservationResponse> getReservationResponsesByGuestId(String guestId) {
        return getReservationsByGuestId(guestId).stream()
            .map(ReservationResponse::new)
            .collect(Collectors.toList());
    }

    @Override
    public List<Reservation> getReservationsByGuesthouseId(String guesthouseId) {
        return reservationRepository.findByGuesthouseId(guesthouseId);
    }

    public List<ReservationResponse> getReservationResponsesByGuesthouseId(String guesthouseId) {
        return getReservationsByGuesthouseId(guesthouseId).stream()
            .map(ReservationResponse::new)
            .collect(Collectors.toList());
    }

    public List<ReservationResponse> getReservationsByOwnerId(String ownerId) {
        // Get all reservations where the guesthouse owner is the specified owner
        return reservationRepository.findAll().stream()
            .filter(reservation -> reservation.getGuesthouse().getOwner() != null && 
                   reservation.getGuesthouse().getOwner().getId().equals(ownerId))
            .map(ReservationResponse::new)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<Reservation> getReservationById(String id) {
        return reservationRepository.findById(id);
    }

    public Optional<ReservationResponse> getReservationResponseById(String id) {
        return getReservationById(id).map(ReservationResponse::new);
    }

    @Override
    public Reservation updateReservation(String id, Reservation updatedReservation) {
        if (!reservationRepository.existsById(id)) {
            throw new IllegalArgumentException("Reservation not found");
        }
        updatedReservation.setId(id);
        return reservationRepository.save(updatedReservation);
    }

    public ReservationResponse updateReservationStatus(String id, Reservation.ReservationStatus status, String reason) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        switch (status) {
            case CONFIRMED:
                reservation.confirm();
                break;
            case CANCELED:
                reservation.cancel(reason);
                break;
            case REJECTED:
                reservation.reject(reason);
                break;
            case COMPLETED:
                reservation.complete();
                break;
            default:
                reservation.setStatus(status);
        }

        Reservation updated = reservationRepository.save(reservation);
        return new ReservationResponse(updated);
    }

    @Override
    public void cancelReservation(String id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        reservation.ifPresent(res -> {
            res.cancel("Canceled by user");
            reservationRepository.save(res);
        });
    }

    public void cancelReservation(String id, String reason) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        
        reservation.cancel(reason);
        reservationRepository.save(reservation);
    }

    public List<ReservationResponse> getReservationsByStatus(Reservation.ReservationStatus status) {
        return reservationRepository.findByStatus(status.name()).stream()
            .map(ReservationResponse::new)
            .collect(Collectors.toList());
    }

    public boolean isGuesthouseAvailable(String guesthouseId, LocalDate checkIn, LocalDate checkOut) {
        return !hasConflictingReservations(guesthouseId, checkIn, checkOut);
    }

    public BigDecimal calculateTotalPrice(String guesthouseId, LocalDate checkIn, LocalDate checkOut) {
        Guesthouse guesthouse = guestHouseRepository.findById(guesthouseId)
            .orElseThrow(() -> new IllegalArgumentException("Guesthouse not found"));

        long nights = java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
        
        // Extract numeric price from price string (assuming format like "$50" or "50")
        String priceStr = guesthouse.getPrice().replaceAll("[^\\d.]", "");
        BigDecimal pricePerNight = new BigDecimal(priceStr);
        
        return pricePerNight.multiply(BigDecimal.valueOf(nights));
    }

    private boolean hasConflictingReservations(String guesthouseId, LocalDate checkIn, LocalDate checkOut) {
        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
            guesthouseId, checkIn, checkOut);
        return !conflicts.isEmpty();
    }

    private boolean isValidDateRange(LocalDate checkIn, LocalDate checkOut) {
        return checkIn != null && checkOut != null && 
               checkOut.isAfter(checkIn) && 
               checkIn.isAfter(LocalDate.now().minusDays(1));
    }
}
