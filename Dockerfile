# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-focal AS builder
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw pom.xml ./
COPY .mvn/ .mvn

# Copy source code
COPY src/ src/

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build the project (skip tests to speed up)
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port your app uses
EXPOSE 9090

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
