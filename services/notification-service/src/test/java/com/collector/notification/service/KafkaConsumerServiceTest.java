package com.collector.notification.service;

import com.collector.notification.dto.ArticleDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KafkaConsumerServiceTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private KafkaConsumerService kafkaConsumerService;

    @Test
    void consume_ShouldCallEmailService_WhenMessageReceived() {
        ArticleDTO article = new ArticleDTO();
        article.setNom("Console Rétro");
        kafkaConsumerService.consume(article);
        verify(emailService, times(1))
            .sendNotification("client@test.com", "Console Rétro");
    }
}