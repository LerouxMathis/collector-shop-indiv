package com.collector.catalog.controller;
import com.collector.catalog.dto.ArticleRequest;
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
    public Article createArticle(@RequestBody ArticleRequest dto, @AuthenticationPrincipal Jwt jwt) {
        Article article = new Article();
        article.setTitle(dto.title());
        article.setPrice(dto.price());
        article.setOwnerId(jwt.getSubject()); 
        Article saved = repository.save(article);
        kafkaService.sendArticleCreatedEvent(saved.getId(), saved.getTitle());
        return saved;
    }
}