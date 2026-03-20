package com.collector.catalog.service;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendArticleCreatedEvent(Long articleId, String title) {
        String message = String.format("{\"articleId\": %d, \"title\": \"%s\"}", articleId, title);
        kafkaTemplate.send("article-cree", String.valueOf(articleId), message);
        System.out.println("Événement envoyé à Kafka : " + message);
    }
}