// src/main/java/com/carthatamaz/carthatamaz/controller/ChatbotController.java
package com.carthatamaz.carthatamaz.controller;

import com.carthatamaz.carthatamaz.dto.ChatRequest;
import com.carthatamaz.carthatamaz.entity.Guesthouse; // Make sure to import your Guesthouse model
import com.carthatamaz.carthatamaz.service.ChatbotRecommandationService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Adjust for production if needed
public class ChatbotController {

    private final ChatbotRecommandationService service;

    public ChatbotController(ChatbotRecommandationService service) {
        this.service = service;
    }

    /**
     * Handles chatbot queries to recommend guesthouses.
     * This endpoint is public and returns a JSON array of guesthouses.
     */
    @PostMapping(
            value = "/recommend",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE // CORRECTED: Return JSON
    )
    @PreAuthorize("permitAll()") // CORRECTED: Allow public access
    public ResponseEntity<?> recommend(@Valid @RequestBody ChatRequest req) {
        if (req == null || req.getQuery() == null || req.getQuery().isBlank()) {
            // Return a JSON error object
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Requête invalide: 'query' est requis."));
        }
        try {
            // IMPORTANT: Your service must now return List<Guesthouse>
            String results = service.getChatbotRecommendations(req.getQuery());
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            // Log the exception for debugging
            // log.error("Error calling recommendation service", e);
            return ResponseEntity.status(502) // 502 Bad Gateway is appropriate here
                    .body(Map.of("error", "Erreur lors de l'appel au service de recommandation: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/health", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("chatbot spring ok");
    }
}