# Utilisation d'une image de base minimale pour réduire la surface d'attaque (Sécurité)
FROM eclipse-temurin:17-jdk-alpine

# Ajout d'un volume pour les fichiers temporaires de Tomcat (Serveur web Spring Boot)
VOLUME /tmp

# Copie de l'artefact généré par la CI/CD
COPY target/*.jar app.jar

# Port exposé par défaut
EXPOSE 8081

# Commande de démarrage avec optimisation de la mémoire pour les conteneurs
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-jar", "/app.jar"]