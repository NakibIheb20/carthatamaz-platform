package com.carthatamaz.carthatamaz.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders; // ✅ CORRECTE IMPORTATION
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommandationService {
    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, Object>> getRecommendations(String title) {
        String flaskUrl = "http://localhost:5000/recommend";

        // Création de la requête JSON
        Map<String, String> request = new HashMap<>();
        request.put("title", title);

        // Headers corrects
        HttpHeaders headers = new HttpHeaders(); // ✅
        headers.setContentType(MediaType.APPLICATION_JSON); // ✅

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers); // ✅

        // Envoi de la requête
        ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> body = response.getBody();
            return (List<Map<String, Object>>) body.get("recommendations");
        } else {
            throw new RuntimeException("Erreur lors de l'appel au moteur Flask");
        }
    }
}
