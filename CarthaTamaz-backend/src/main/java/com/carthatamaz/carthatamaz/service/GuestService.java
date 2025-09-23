package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.entity.Guesthouse;

import java.util.List;
import java.util.Optional;

public interface GuestService {
    List<Guesthouse> getAllGuesthouses();
    Optional<Guesthouse> getGuesthouseById(String id);
    Guesthouse createGuesthouse(Guesthouse guesthouse);
    Guesthouse updateGuesthouse(String id, Guesthouse guesthouse);
    void deleteGuesthouse(String id);



}
