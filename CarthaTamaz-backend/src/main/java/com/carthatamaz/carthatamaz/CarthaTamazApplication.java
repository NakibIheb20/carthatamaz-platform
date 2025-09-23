package com.carthatamaz.carthatamaz;

import com.carthatamaz.carthatamaz.service.CsvGuestHouseImportService;
import com.carthatamaz.carthatamaz.service.CsvImportService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CarthaTamazApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarthaTamazApplication.class, args);

    }
//    @Bean
//    CommandLineRunner run(CsvImportService csvImportService) {
//        return args -> {
//            csvImportService.importUsersFromCSV("src/main/resources/users2.csv");
//        };
//    }

//    @Bean
//    CommandLineRunner run(CsvGuestHouseImportService csvImportService) {
//        return args -> {
//            // Test first to verify CSV parsing
//            System.out.println("🧪 Testing CSV parsing...");
//            csvImportService.testCSVParsing("src/main/resources/listings_cleaned_final.csv", 3);
//
//            // Then import the data
//            System.out.println("\n📥 Starting CSV import...");
//            csvImportService.importGuestHousesFromCSV("src/main/resources/listings_cleaned_final.csv");
//        };
//    }


}
