FROM eclipse-temurin:17-jdk-jammy
VOLUME /tmp
COPY target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-jar", "/app.jar"]