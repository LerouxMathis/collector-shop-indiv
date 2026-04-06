package com.collector.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendNotification(String to, String articleName) {
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@collectorshop.fr");
            message.setTo(to);
            message.setSubject("Nouvel article sur Collector Shop !");
            message.setText("L'article '" + articleName + "' vient d'être ajouté au catalogue.");

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Bug lors de l'envoi de mail : {}", e.getMessage());
            log.error("erreur : ", e);
        }
    }
}