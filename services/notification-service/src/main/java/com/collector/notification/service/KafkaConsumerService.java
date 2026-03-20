package com.collector.notification.service;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "article-cree", groupId = "notification-group")
    public void consume(String message) {
        // Dans la réalité, on parserait le JSON pour envoyer un mail via SMTP/SendGrid
        System.out.println("🔔 [NOTIFICATION-SERVICE] Reçu depuis Kafka : " + message);
        System.out.println("✉️ Envoi de l'email à l'utilisateur...");
    }
}