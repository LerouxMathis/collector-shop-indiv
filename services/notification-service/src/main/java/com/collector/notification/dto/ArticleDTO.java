package com.collector.notification.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ArticleDTO implements Serializable {
    @JsonProperty("articleId")
    private Long id;
    @JsonProperty("title")
    private String nom;
    private Double prix;

    public ArticleDTO() {}

    public ArticleDTO(Long id, String nom, Double prix) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }

    @Override
    public String toString() {
        return "ArticleDTO{id=" + id + ", nom='" + nom + "', prix=" + prix + "}";
    }
}