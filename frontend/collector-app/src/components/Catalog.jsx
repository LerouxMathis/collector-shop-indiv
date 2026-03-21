import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AddArticle from './AddArticle';
import './Catalog.css';

const Catalog = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 1. Déclaration du contrôleur d'annulation
    const controller = new AbortController();
    let isMounted = true;

    // 2. Encapsulation de la logique DANS l'effet (C'est ce qui corrige ton erreur !)
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles', { 
          signal: controller.signal 
        });
        
        if (isMounted) {
          setArticles(response.data);
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error("Erreur de récupération du catalogue", error);
        }
      }
    };

    // Appel immédiat
    fetchArticles();

    // 3. Fonction de nettoyage
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Dépendances vides : exécution unique au montage

  const handleArticleAdded = (newArticle) => {
    setArticles([...articles, newArticle]);
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h2 className="catalog-title">Découvrez les pépites</h2>
        <p className="catalog-subtitle">Les dernières trouvailles de la communauté Collector.</p>
      </div>

      {articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Aucun article pour le moment. Soyez le premier à vendre !
        </div>
      ) : (
        <div className="article-grid">
          {articles.map((art) => (
            <div key={art.id} className="article-card">
              <h4 className="article-title">{art.title}</h4>
              <div className="article-price-tag">
                {/* Petite sécurité : on s'assure que price est un nombre avant de faire toFixed */}
                <span className="article-price">{Number(art.price || 0).toFixed(2)} €</span>
                {/* Autre sécurité : on s'assure que ownerId existe avant de faire substring */}
                <span className="article-vendeur">
                  Vendeur: {art.ownerId ? art.ownerId.substring(0,8) : 'Inconnu'}...
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Intégration du formulaire de création */}
      <AddArticle onArticleAdded={handleArticleAdded} />
    </div>
  );
};

export default Catalog;