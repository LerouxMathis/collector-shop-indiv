package com.collector.catalog.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KafkaProducerServiceTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @InjectMocks
    private KafkaProducerService kafkaProducerService;

    @Test
    void sendArticleCreatedEvent_ShouldSendCorrectMessage() {
        Long id = 1L;
        String title = "Carte Dracaufeu";
        String expectedMessage = "{\"articleId\": 1, \"title\": \"Carte Dracaufeu\"}";
        kafkaProducerService.sendArticleCreatedEvent(id, title);
        verify(kafkaTemplate, times(1)).send("article-cree", "1", expectedMessage);
    }
}