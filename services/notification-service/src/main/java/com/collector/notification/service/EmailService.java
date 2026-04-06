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
        log.info("📧 Tentative d'envoi d'email pour l'article : {} vers {}", articleName, to);
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@collectorshop.fr");
            message.setTo(to);
            message.setSubject("Nouvel article sur Collector Shop !");
            message.setText("L'article '" + articleName + "' vient d'être ajouté au catalogue.");

            mailSender.send(message);
            log.info("✅ Email envoyé avec succès à Maildev !");
        } catch (Exception e) {
            log.error("❌ ERREUR LORS DE L'ENVOI DE L'EMAIL : {}", e.getMessage());
            log.error("Détails de l'erreur : ", e);
        }
    }
}