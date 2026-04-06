package com.collector.catalog.controller;

import com.collector.catalog.model.Article;
import com.collector.catalog.repository.ArticleRepository;
import com.collector.catalog.service.KafkaProducerService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ArticleController.class)
@AutoConfigureMockMvc(addFilters = false) 
public class ArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ArticleRepository repository;

    @MockBean
    private KafkaProducerService kafkaService;

    @Test
    public void testGetAllArticles_ShouldReturnList() throws Exception {
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
}