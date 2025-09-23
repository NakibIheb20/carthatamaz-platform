package com.carthatamaz.carthatamaz.repository;

import com.carthatamaz.carthatamaz.entity.Guesthouse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface GuestHouseRepository extends MongoRepository<Guesthouse, String> {
    List<Guesthouse> findByCity(String city);



}
