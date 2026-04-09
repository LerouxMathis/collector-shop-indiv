import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AddArticle from './AddArticle';
import './Catalog.css';


const Catalog = ({ authenticated }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

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
    fetchArticles();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); 

  const handleArticleAdded = (newArticle) => {
    setArticles([...articles, newArticle]);
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h2 className="catalog-title">Découvrez les pépites</h2>
        <p className="catalog-subtitle">Les dernières trouvailles de la communauté Collector.</p>
      </div>

      {authenticated && (
        <div className="add-article-section" style={{ marginBottom: '40px' }}>
          <AddArticle onArticleAdded={handleArticleAdded} />
        </div>
      )}

      {articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Aucun article pour le moment. {authenticated ? "Soyez le premier à en ajouter !" : "Connectez-vous pour être le premier vendeur !"}
        </div>
      ) : (
        <div className="article-grid">
          {articles.map((art) => (
            <div key={art.id} className="article-card">
              <h4 className="article-title">{art.title}</h4>
              <div className="article-price-tag">
                <span className="article-price">{Number(art.price || 0).toFixed(2)} €</span>
                <span className="article-vendeur">
                  Vendeur: {art.ownerId ? art.ownerId.substring(0,8) : 'Anonyme'}...
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;