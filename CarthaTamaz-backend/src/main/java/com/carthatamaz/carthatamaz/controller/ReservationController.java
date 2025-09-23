package com.carthatamaz.carthatamaz.controller;

import com.carthatamaz.carthatamaz.dto.ReservationRequest;
import com.carthatamaz.carthatamaz.dto.ReservationResponse;
import com.carthatamaz.carthatamaz.dto.ReservationStatusUpdateRequest;
import com.carthatamaz.carthatamaz.entity.Reservation;
import com.carthatamaz.carthatamaz.service.ReservationService;
import com.carthatamaz.carthatamaz.util.ValidationUtil;
// import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // Guest endpoints
    @PostMapping("/guest/reservations")
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        try {
            // Validate request
            List<String> validationErrors = ValidationUtil.validateReservationRequest(request);
            if (!validationErrors.isEmpty()) {
                return ResponseEntity.badRequest().body("Validation errors: " + String.join(", ", validationErrors));
            }

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String guestId = auth.getName(); // Assuming the username is the user ID
            
            ReservationResponse reservation = reservationService.createReservation(request, guestId);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating reservation: " + e.getMessage());
        }
    }

    @GetMapping("/guest/reservations")
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<List<ReservationResponse>> getGuestReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String guestId = auth.getName();
        
        List<ReservationResponse> reservations = reservationService.getReservationResponsesByGuestId(guestId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/guest/reservations/{id}")
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<?> getReservationById(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String guestId = auth.getName();
        
        Optional<ReservationResponse> reservation = reservationService.getReservationResponseById(id);
        
        if (reservation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Check if the reservation belongs to the authenticated guest
        if (!reservation.get().getGuestId().equals(guestId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        
        return ResponseEntity.ok(reservation.get());
    }

    @PutMapping("/guest/reservations/{id}/cancel")
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<?> cancelReservation(@PathVariable String id, 
                                             @RequestBody(required = false) ReservationStatusUpdateRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String guestId = auth.getName();
            
            // Verify the reservation belongs to the guest
            Optional<ReservationResponse> reservation = reservationService.getReservationResponseById(id);
            if (reservation.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            if (!reservation.get().getGuestId().equals(guestId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            
            String reason = request != null ? request.getReason() : "Canceled by guest";
            reservationService.cancelReservation(id, reason);
            
            return ResponseEntity.ok().body("Reservation canceled successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Owner endpoints
    @GetMapping("/owner/reservations")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<ReservationResponse>> getOwnerReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String ownerId = auth.getName();
        
        List<ReservationResponse> reservations = reservationService.getReservationsByOwnerId(ownerId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/owner/guesthouses/{guesthouseId}/reservations")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<ReservationResponse>> getGuesthouseReservations(@PathVariable String guesthouseId) {
        List<ReservationResponse> reservations = reservationService.getReservationResponsesByGuesthouseId(guesthouseId);
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/owner/reservations/{id}/status")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> updateReservationStatus(@PathVariable String id, 
                                                   @RequestBody ReservationStatusUpdateRequest request) {
        try {
            ReservationResponse updated = reservationService.updateReservationStatus(
                id, request.getStatus(), request.getReason());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/owner/reservations/{id}/confirm")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> confirmReservation(@PathVariable String id) {
        try {
            ReservationResponse updated = reservationService.updateReservationStatus(
                id, Reservation.ReservationStatus.CONFIRMED, null);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/owner/reservations/{id}/reject")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> rejectReservation(@PathVariable String id, 
                                             @RequestBody ReservationStatusUpdateRequest request) {
        try {
            ReservationResponse updated = reservationService.updateReservationStatus(
                id, Reservation.ReservationStatus.REJECTED, request.getReason());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Admin endpoints
    @GetMapping("/admin/reservations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<ReservationResponse> reservations = reservationService.getReservationsByStatus(null);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/admin/reservations/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getReservationsByStatus(@PathVariable String status) {
        try {
            Reservation.ReservationStatus reservationStatus = Reservation.ReservationStatus.valueOf(status.toUpperCase());
            List<ReservationResponse> reservations = reservationService.getReservationsByStatus(reservationStatus);
            return ResponseEntity.ok(reservations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Utility endpoints
    @GetMapping("/guest/guesthouses/{guesthouseId}/availability")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<Boolean> checkAvailability(
            @PathVariable String guesthouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        
        boolean available = reservationService.isGuesthouseAvailable(guesthouseId, checkIn, checkOut);
        return ResponseEntity.ok(available);
    }

    @GetMapping("/guest/guesthouses/{guesthouseId}/price")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<?> calculatePrice(
            @PathVariable String guesthouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        
        try {
            BigDecimal totalPrice = reservationService.calculateTotalPrice(guesthouseId, checkIn, checkOut);
            return ResponseEntity.ok(Map.of("totalPrice", totalPrice));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Exception handler
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Internal server error: " + e.getMessage());
    }
}