#
## Étape 1 : build du projet
#FROM maven:3.9.6-eclipse-temurin-17 AS builder
#WORKDIR /app
#COPY src/main/java .
#RUN mvn clean package -DskipTests
#
## Étape 2 : image d'exécution
#FROM eclipse-temurin:17-jdk
#WORKDIR /app
#COPY --from=builder /app/target/*.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "app.jar"]
