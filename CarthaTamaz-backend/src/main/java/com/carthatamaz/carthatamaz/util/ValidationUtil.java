package com.carthatamaz.carthatamaz.util;

import com.carthatamaz.carthatamaz.dto.MessageRequest;
import com.carthatamaz.carthatamaz.dto.ReservationRequest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ValidationUtil {

    public static List<String> validateReservationRequest(ReservationRequest request) {
        List<String> errors = new ArrayList<>();

        if (request.getGuesthouseId() == null || request.getGuesthouseId().trim().isEmpty()) {
            errors.add("Guesthouse ID is required");
        }

        if (request.getCheckIn() == null) {
            errors.add("Check-in date is required");
        } else if (request.getCheckIn().isBefore(LocalDate.now())) {
            errors.add("Check-in date must be in the future");
        }

        if (request.getCheckOut() == null) {
            errors.add("Check-out date is required");
        } else if (request.getCheckOut().isBefore(LocalDate.now())) {
            errors.add("Check-out date must be in the future");
        }

        if (request.getCheckIn() != null && request.getCheckOut() != null && 
            !request.getCheckOut().isAfter(request.getCheckIn())) {
            errors.add("Check-out date must be after check-in date");
        }

        if (request.getGuestsCount() < 1) {
            errors.add("At least 1 guest is required");
        }

        return errors;
    }

    public static List<String> validateMessageRequest(MessageRequest request) {
        List<String> errors = new ArrayList<>();

        if (request.getReceiverId() == null || request.getReceiverId().trim().isEmpty()) {
            errors.add("Receiver ID is required");
        }

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            errors.add("Message content is required");
        } else if (request.getContent().length() > 1000) {
            errors.add("Message content cannot exceed 1000 characters");
        }

        return errors;
    }

    public static boolean isValidString(String value) {
        return value != null && !value.trim().isEmpty();
    }

    public static boolean isValidEmail(String email) {
        if (!isValidString(email)) {
            return false;
        }
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
}