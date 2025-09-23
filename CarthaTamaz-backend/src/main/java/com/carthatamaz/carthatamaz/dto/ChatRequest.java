// src/main/java/com/carthatamaz/carthatamaz/dto/ChatRequest.java
package com.carthatamaz.carthatamaz.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatRequest {

    @NotBlank(message = "Le champ 'query' est requis et ne doit pas être vide.")
    private String query; // texte libre

    public ChatRequest() {}

    public ChatRequest(String query) {
        this.query = query;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
