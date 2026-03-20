package com.collector.catalog.controller;
import com.collector.catalog.model.Article;
import com.collector.catalog.repository.ArticleRepository;
import com.collector.catalog.service.KafkaProducerService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleRepository repository;
    private final KafkaProducerService kafkaService;

    public ArticleController(ArticleRepository repository, KafkaProducerService kafkaService) {
        this.repository = repository;
        this.kafkaService = kafkaService;
    }

    @GetMapping
    public List<Article> getAllArticles() {
        return repository.findAll();
    }

    @PostMapping
    public Article createArticle(@RequestBody Article article, @AuthenticationPrincipal Jwt jwt) {
        // Sécurité : On associe l'article à l'utilisateur authentifié (Zero Trust)
        article.setOwnerId(jwt.getSubject()); 
        Article saved = repository.save(article);
        
        // Performance : Envoi asynchrone pour ne pas bloquer le thread HTTP
        kafkaService.sendArticleCreatedEvent(saved.getId(), saved.getTitle());
        return saved;
    }
}