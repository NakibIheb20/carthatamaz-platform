package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.entity.Guesthouse;
import com.carthatamaz.carthatamaz.repository.GuestHouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CsvGuestHouseImportService {


    @Autowired
    private GuestHouseRepository guestHouseRepository;

    public void importGuestHousesFromCSV(String filePath) {
        List<Guesthouse> guestHouses = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line = br.readLine(); // skip header
            System.out.println("📋 Header: " + line);

            // Parse header to verify structure
            String[] headerColumns = parseCSVLineAdvanced(line);
            System.out.println("📋 Colonnes trouvées: " + Arrays.toString(headerColumns));

            int lineNumber = 1;
            while ((line = br.readLine()) != null) {
                lineNumber++;

                // Parse CSV line properly handling quoted fields
                String[] data = parseCSVLineAdvanced(line);

                // Expected columns count: 10 (based on cleaned CSV)
                if (data.length < 10) {
                    System.out.println("⚠️ Ligne " + lineNumber + " ignorée (colonnes insuffisantes) : " + data.length + " trouvées sur 10 attendues");
                    continue;
                }

                Guesthouse gh = new Guesthouse();

                try {
                    // Debug: Print first few fields to verify parsing
                    if (lineNumber <= 3) {
                        System.out.println("🐛 Ligne " + lineNumber + " - Premiers champs:");
                        for (int i = 0; i < Math.min(data.length, 6); i++) {
                            String preview = data[i].length() > 30 ? data[i].substring(0, 30) + "..." : data[i];
                            System.out.println("   [" + i + "] = '" + preview + "'");
                        }
                    }

                    // CSV column order: thumbnail,title,description,rating/reviewsCount,price/price,price/label,coordinates/latitude,coordinates/longitude,url,city
                    gh.setThumbnail(cleanString(data[0]));                    // thumbnail
                    gh.setTitle(cleanString(data[1]));                       // title
                    gh.setDescription(cleanString(data[2]));                 // description
                    gh.setReviewsCount(parseIntSafe(data[3]));              // rating/reviewsCount
                    gh.setPrice(cleanString(data[4]));                       // price/price
                    gh.setPriceLabel(cleanString(data[5]));                  // price/label
                    gh.setLatitude(parseDoubleSafe(data[6]));               // coordinates/latitude
                    gh.setLongitude(parseDoubleSafe(data[7]));              // coordinates/longitude
                    gh.setUrl(cleanString(data[8]));                         // url
                    gh.setCity(cleanString(data[9]));                        // city

                    // Debug: Print constructed object for first few records
                    if (lineNumber <= 3) {
                        System.out.println("🏠 Objet créé:");
                        System.out.println("   Titre: " + gh.getTitle());
                        System.out.println("   Prix: " + gh.getPrice());
                        System.out.println("   Ville: " + gh.getCity());
                        System.out.println("   Avis: " + gh.getReviewsCount());
                        System.out.println("   URL: " + gh.getUrl().substring(0, Math.min(50, gh.getUrl().length())) + "...");
                    }

                    guestHouses.add(gh);

                    // Log every 500 records for progress tracking
                    if (guestHouses.size() % 500 == 0) {
                        System.out.println("📈 Traité : " + guestHouses.size() + " enregistrements");
                    }

                } catch (Exception e) {
                    System.out.println("⚠️ Erreur ligne " + lineNumber);
                    System.out.println("   Données: " + Arrays.toString(Arrays.copyOf(data, Math.min(data.length, 3))));
                    System.out.println("   Erreur : " + e.getMessage());
                }
            }

            if (!guestHouses.isEmpty()) {
                guestHouseRepository.saveAll(guestHouses);
                System.out.println("✅ Import terminé avec succès !");
                System.out.println("📊 Nombre d'enregistrements importés : " + guestHouses.size());

                // Display sample data for verification
                System.out.println("\n📝 Échantillon des données importées:");
                guestHouses.stream().limit(3).forEach(gh -> {
                    System.out.println("   • Titre: " + gh.getTitle().substring(0, Math.min(50, gh.getTitle().length())) + "...");
                    System.out.println("     Prix: " + gh.getPrice() + " | Ville: " + gh.getCity() + " | Avis: " + gh.getReviewsCount());
                });
            } else {
                System.out.println("⚠️ Aucun enregistrement valide trouvé.");
            }

        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'import du fichier CSV : " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Advanced CSV parsing using regex to handle quoted fields with embedded commas and quotes
     */
    private String[] parseCSVLineAdvanced(String line) {
        List<String> result = new ArrayList<>();

        // Regex pattern for CSV fields: either quoted strings or unquoted strings
        Pattern csvPattern = Pattern.compile("\"([^\"]*(?:\"\"[^\"]*)*)\"|([^,]*)");
        Matcher matcher = csvPattern.matcher(line + ","); // Add comma to catch last field

        while (matcher.find()) {
            String field;
            if (matcher.group(1) != null) {
                // Quoted field - handle escaped quotes
                field = matcher.group(1).replace("\"\"", "\"");
            } else {
                // Unquoted field
                field = matcher.group(2);
            }
            result.add(field != null ? field : "");
        }

        return result.toArray(new String[0]);
    }

    /**
     * Clean and validate string data
     */
    private String cleanString(String value) {
        if (value == null) {
            return "";
        }

        String cleaned = value.trim();

        // Remove surrounding quotes if present
        if (cleaned.startsWith("\"") && cleaned.endsWith("\"") && cleaned.length() > 1) {
            cleaned = cleaned.substring(1, cleaned.length() - 1);
        }

        // Handle escaped quotes
        cleaned = cleaned.replace("\"\"", "\"");

        return cleaned;
    }

    /**
     * Parse double value safely
     */
    private double parseDoubleSafe(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0.0;
        }
        try {
            String cleaned = cleanString(value);
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            System.out.println("⚠️ Impossible de parser le double : '" + value + "', utilisation de 0.0");
            return 0.0;
        }
    }

    /**
     * Parse integer value safely
     */
    private int parseIntSafe(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0;
        }
        try {
            String cleaned = cleanString(value);
            // Handle decimal values by converting to double first, then to int
            double doubleValue = Double.parseDouble(cleaned);
            return (int) Math.round(doubleValue);
        } catch (NumberFormatException e) {
            System.out.println("⚠️ Impossible de parser l'entier : '" + value + "', utilisation de 0");
            return 0;
        }
    }

    /**
     * Method to test and display CSV parsing results
     */
    public void testCSVParsing(String filePath, int maxLines) {
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line = br.readLine(); // header
            System.out.println("🧪 TEST DE PARSING CSV");
            System.out.println("=".repeat(50));

            String[] header = parseCSVLineAdvanced(line);
            System.out.println("📋 Header (" + header.length + " colonnes):");
            for (int i = 0; i < header.length; i++) {
                System.out.println("   " + i + ": " + header[i]);
            }

            System.out.println("\n📄 Échantillon des données:");
            int count = 0;
            while ((line = br.readLine()) != null && count < maxLines) {
                count++;
                String[] data = parseCSVLineAdvanced(line);
                System.out.println("\nLigne " + count + " (" + data.length + " colonnes):");
                for (int i = 0; i < Math.min(data.length, 10); i++) {
                    String preview = data[i].length() > 50 ? data[i].substring(0, 50) + "..." : data[i];
                    System.out.println("   " + i + ": " + preview);
                }
            }

        } catch (Exception e) {
            System.err.println("❌ Erreur lors du test : " + e.getMessage());
        }
    }

    /**
     * Method to clear the MongoDB collection before importing
     */
    public void clearCollection() {
        try {
            System.out.println("🗑️ Suppression des données existantes...");
            long deletedCount = guestHouseRepository.count();
            guestHouseRepository.deleteAll();
            System.out.println("✅ " + deletedCount + " enregistrements supprimés");
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la suppression : " + e.getMessage());
        }
    }

    /**
     * Method to verify imported data quality
     */
    public void verifyImportedData() {
        try {
            System.out.println("🔍 VÉRIFICATION DES DONNÉES IMPORTÉES");
            System.out.println("=".repeat(50));

            List<Guesthouse> samples = guestHouseRepository.findAll().stream().limit(5).toList();

            for (int i = 0; i < samples.size(); i++) {
                Guesthouse gh = samples.get(i);
                System.out.println("\n📋 Échantillon " + (i + 1) + ":");
                System.out.println("   ID: " + gh.getId());
                System.out.println("   Titre: " + gh.getTitle());
                System.out.println("   Description: " + (gh.getDescription().length() > 100 ?
                        gh.getDescription().substring(0, 100) + "..." : gh.getDescription()));
                System.out.println("   Prix: " + gh.getPrice());
                System.out.println("   Label Prix: " + gh.getPriceLabel());
                System.out.println("   Ville: " + gh.getCity());
                System.out.println("   Avis: " + gh.getReviewsCount());
                System.out.println("   Coordonnées: (" + gh.getLatitude() + ", " + gh.getLongitude() + ")");
                System.out.println("   URL: " + (gh.getUrl().length() > 80 ?
                        gh.getUrl().substring(0, 80) + "..." : gh.getUrl()));
                System.out.println("   Thumbnail: " + (gh.getThumbnail().length() > 80 ?
                        gh.getThumbnail().substring(0, 80) + "..." : gh.getThumbnail()));
            }

        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la vérification : " + e.getMessage());
        }
    }
}
