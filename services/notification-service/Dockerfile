# Utilisation de la même image de base pour mutualiser le cache Docker
FROM eclipse-temurin:17-jdk-alpine

VOLUME /tmp

COPY target/*.jar app.jar

# Ce service n'expose pas de port HTTP (il écoute juste Kafka), donc pas de directive EXPOSE

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-jar", "/app.jar"]