package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.entity.Guesthouse;
import com.carthatamaz.carthatamaz.repository.GuestHouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class GuestHouseService implements GuestService {

    @Autowired
    private GuestHouseRepository guesthouseRepository;


    @Override
    public List<Guesthouse> getAllGuesthouses() {
        return guesthouseRepository.findAll();
    }

    @Override
    public Optional<Guesthouse> getGuesthouseById(String id) {
        return guesthouseRepository.findById(id);
    }

    @Override
    public Guesthouse createGuesthouse(Guesthouse guesthouse) {
        return guesthouseRepository.save(guesthouse);
    }

    @Override
    public Guesthouse updateGuesthouse(String id, Guesthouse guesthouse) {
        if (!guesthouseRepository.existsById(id)) {
            throw new RuntimeException("Guesthouse not found with id: " + id);
        }
        guesthouse.setId(id);
        return guesthouseRepository.save(guesthouse);
    }

    @Override
    public void deleteGuesthouse(String id) {
        guesthouseRepository.deleteById(id);
    }




}