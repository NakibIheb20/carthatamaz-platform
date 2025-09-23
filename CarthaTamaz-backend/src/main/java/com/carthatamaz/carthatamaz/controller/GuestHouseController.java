package com.carthatamaz.carthatamaz.controller;

import com.carthatamaz.carthatamaz.entity.Guesthouse;
import com.carthatamaz.carthatamaz.service.GuestHouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest/guesthouses")
@CrossOrigin(origins = "http://localhost:3000")
public class GuestHouseController {
    
    @Autowired
    private GuestHouseService guestHouseService;


    @GetMapping
    public ResponseEntity<List<Guesthouse>> getAllGuesthouses() {
        try {
            List<Guesthouse> guesthouses = guestHouseService.getAllGuesthouses();
            return ResponseEntity.ok(guesthouses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guesthouse> getGuesthouseById(@PathVariable String id) {
        try {
            return guestHouseService.getGuesthouseById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Guesthouse> createGuesthouse(@RequestBody Guesthouse guesthouse) {
        try {
            Guesthouse created = guestHouseService.createGuesthouse(guesthouse);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Guesthouse> updateGuesthouse(@PathVariable String id, @RequestBody Guesthouse guesthouse) {
        try {
            Guesthouse updated = guestHouseService.updateGuesthouse(id, guesthouse);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteGuesthouse(@PathVariable String id) {
        try {
            guestHouseService.deleteGuesthouse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
