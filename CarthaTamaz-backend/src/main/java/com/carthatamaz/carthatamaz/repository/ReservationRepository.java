package com.carthatamaz.carthatamaz.repository;

import com.carthatamaz.carthatamaz.entity.Guesthouse;
import com.carthatamaz.carthatamaz.entity.Reservation;
import com.carthatamaz.carthatamaz.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByGuest(User guest);
    List<Reservation> findByGuesthouse(Guesthouse guesthouse);
    List<Reservation> findByGuestId(String guestId);
    List<Reservation> findByGuesthouseId(String guesthouseId);
    List<Reservation> findByStatus(String status);
    
    @Query("{'guesthouse.id': ?0, 'status': {$in: ['CONFIRMED', 'PENDING']}, " +
           "$or: [" +
           "{'checkIn': {$lte: ?2}, 'checkOut': {$gt: ?1}}, " +
           "{'checkIn': {$lt: ?2}, 'checkOut': {$gte: ?1}}" +
           "]}")
    List<Reservation> findConflictingReservations(String guesthouseId, LocalDate checkIn, LocalDate checkOut);
    
    @Query("{'$or': [{'guest.id': ?0}, {'guesthouse.owner.id': ?0}]}")
    List<Reservation> findByUserInvolved(String userId);
}
