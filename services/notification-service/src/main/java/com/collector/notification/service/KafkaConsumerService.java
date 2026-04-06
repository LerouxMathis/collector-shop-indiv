package com.collector.notification.service;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.collector.notification.dto.ArticleDTO;

@Service
public class KafkaConsumerService {

    private final EmailService emailService;

    public KafkaConsumerService(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(topics = "article-cree", groupId = "notification-group")
    public void consume(ArticleDTO article) {
        System.out.println("🔔 Notification pour : " + article.getNom());
        emailService.sendNotification("client@test.com", article.getNom());
    }
}