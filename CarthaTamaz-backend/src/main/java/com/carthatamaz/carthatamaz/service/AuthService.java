package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.dto.AuthResponse;
import com.carthatamaz.carthatamaz.dto.LoginRequest;
import com.carthatamaz.carthatamaz.dto.RegisterRequest;
import com.carthatamaz.carthatamaz.entity.User;
import com.carthatamaz.carthatamaz.repository.UserRepository;
import com.carthatamaz.carthatamaz.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;
    @Autowired private JavaMailSender mailSender;

    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhonenumber(request.getPhonenumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepo.save(user);

        String token = jwtService.generateToken(user.getEmail());

        // ✅ Retourner token + email + rôle
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());

        // ✅ Retourner token + email + rôle
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }


    // Stockage temporaire (idéalement, mets ça dans une table ou Redis)
    private ConcurrentHashMap<String, String> verificationCodes = new ConcurrentHashMap<>();

    // Autres méthodes login/register...

    // 👉 Méthode d'envoi du code de vérification
    public void sendVerificationCode(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String code = generateCode();
        verificationCodes.put(email, code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Réinitialisation de mot de passe");
        message.setText("Votre code de vérification est : " + code);
        mailSender.send(message);
    }

    // 👉 Méthode de vérification du code et réinitialisation du mot de passe
    public void resetPassword(String email, String code, String newPassword) {
        String savedCode = verificationCodes.get(email);
        if (savedCode == null || !savedCode.equals(code)) {
            throw new RuntimeException("Code invalide");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        verificationCodes.remove(email); // Nettoyage
    }

    // Génère un code à 6 chiffres
    private String generateCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}
