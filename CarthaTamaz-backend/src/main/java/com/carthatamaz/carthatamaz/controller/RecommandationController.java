package com.carthatamaz.carthatamaz.controller;

import com.carthatamaz.carthatamaz.service.RecommandationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommandationController {

    private final RecommandationService service;

    public RecommandationController(RecommandationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<List<Map<String, Object>>> recommend(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        List<Map<String, Object>> recommendations = service.getRecommendations(title);
        return ResponseEntity.ok(recommendations);
    }
}
