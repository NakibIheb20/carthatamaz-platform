package com.carthatamaz.carthatamaz.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChatbotRecommandationService {
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String FLASK_URL = "http://localhost:5001/recommend";

    /**
     * Appelle le chatbot Flask avec une requête texte libre (query)
     * et retourne le résultat formaté en texte (pas JSON).
     *
     * @param query Texte décrivant le logement souhaité
     * @return Réponse texte (liste formatée des recommandations)
     */
    public String getChatbotRecommendations(String query) {
        // Corps JSON attendu par Flask: { "query": "<texte>" }
        Map<String, String> request = new HashMap<>();
        request.put("query", query);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.List.of(MediaType.TEXT_PLAIN)); // on attend du texte

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    FLASK_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody(); // Flask renvoie un texte formaté
            }
            throw new RuntimeException("Réponse vide du chatbot Flask");
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'appel au chatbot Flask: " + e.getMessage(), e);
        }
    }
}
