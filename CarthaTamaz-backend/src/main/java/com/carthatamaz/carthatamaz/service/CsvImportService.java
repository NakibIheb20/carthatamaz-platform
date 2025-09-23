package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.entity.User;
import com.carthatamaz.carthatamaz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CsvImportService {

    @Autowired
    private UserRepository userRepository;

    public void importUsersFromCSV(String filePath) {
        List<User> users = new ArrayList<>();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            br.readLine(); // Skip header line

            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");

                User user = new User();

                // NE PAS fixer l’ID ici, laisser JPA gérer l'auto-incrément
                // user.setId(Long.parseLong(data[0]));  <-- retirer cette ligne

                user.setFullName(data[1].trim());
                user.setPicture_url(data[2].trim());

                // Gestion sécurisée du Role (en majuscules et sans espaces)
                String roleStr = data[3].trim().toUpperCase();
                try {
                    user.setRole(User.Role.valueOf(roleStr));
                } catch (IllegalArgumentException e) {
                    System.out.println("Role inconnu pour l'utilisateur " + user.getFullName() + " : " + roleStr);
                    continue; // sauter cet utilisateur
                }

                user.setEmail(data[4].trim());
                user.setPhonenumber(data[5].trim());

                Date birthday = formatter.parse(data[6].trim());
                user.setBirthday(birthday);

                users.add(user);
            }

            userRepository.saveAll(users);
            System.out.println("✅ Import terminé avec succès !");
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de l'import : " + e.getMessage());
            e.printStackTrace();
        }
    }
}
