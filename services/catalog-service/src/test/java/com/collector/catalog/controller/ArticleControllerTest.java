package com.collector.catalog.controller;

import com.collector.catalog.dto.ArticleRequest;
import com.collector.catalog.model.Article;
import com.collector.catalog.repository.ArticleRepository;
import com.collector.catalog.service.KafkaProducerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ArticleController.class)
@AutoConfigureMockMvc
class ArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper; 

    @MockBean
    private ArticleRepository repository;

    @MockBean
    private KafkaProducerService kafkaService;

    @Test
    void testGetAllArticles_ShouldReturnList() throws Exception {
        Article article1 = new Article();
        article1.setId(1L);
        article1.setTitle("Carte Dracaufeu");
        article1.setPrice(150.0);
        article1.setOwnerId("user-123");

        Mockito.when(repository.findAll()).thenReturn(Arrays.asList(article1));

        mockMvc.perform(get("/api/articles")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Carte Dracaufeu"))
                .andExpect(jsonPath("$[0].price").value(150.0));
    }

    @Test
    void testCreateArticle_ShouldSaveAndSendKafkaEvent() throws Exception {
        ArticleRequest request = new ArticleRequest("Console Retro", 80.0);
        
        Article savedArticle = new Article();
        savedArticle.setId(10L);
        savedArticle.setTitle("Console Retro");
        savedArticle.setPrice(80.0);
        savedArticle.setOwnerId("mock-user-id");

        Mockito.when(repository.save(any(Article.class))).thenReturn(savedArticle);

        mockMvc.perform(post("/api/articles")
                .with(SecurityMockMvcRequestPostProcessors.jwt().jwt(j -> j.subject("mock-user-id"))) 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.title").value("Console Retro"))
                .andExpect(jsonPath("$.ownerId").value("mock-user-id"));
        Mockito.verify(kafkaService, Mockito.times(1))
               .sendArticleCreatedEvent(10L, "Console Retro");
    }
}