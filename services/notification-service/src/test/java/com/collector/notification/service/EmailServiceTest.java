package com.collector.notification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    void sendNotification_ShouldCallMailSender_WhenSuccess() {
        emailService.sendNotification("test@test.com", "Carte Dracaufeu");
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendNotification_ShouldCatchException_WhenMailSenderFails() {
        doThrow(new RuntimeException("SMTP Server Down")).when(mailSender).send(any(SimpleMailMessage.class));
        emailService.sendNotification("test@test.com", "Carte Dracaufeu");
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}