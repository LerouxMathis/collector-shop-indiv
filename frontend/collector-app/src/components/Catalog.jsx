import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AddArticle from './AddArticle';
import './Catalog.css';


const Catalog = ({ authenticated, showAddForm, setShowAddForm }) => {
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
    setArticles([newArticle, ...articles]);
    setShowAddForm(false);
  };

  return (
  <div className="catalog-container">
    {authenticated && showAddForm && (
        <div className="add-article-overlay">
           <div className="add-article-header">
             <h3>Proposer un article</h3>
             <button onClick={() => setShowAddForm(false)} className="close-btn">✕</button>
           </div>
           <AddArticle onArticleAdded={handleArticleAdded} />
        </div>
      )}
    
    <h2 className="catalog-title">Fil d'actualité</h2>

    <div className="article-grid">
      {articles.map((art) => (
        <div key={art.id} className="article-card">
          <div className="article-image-placeholder">🖼️</div>
          <div className="article-info">
            <span className="article-price">{Number(art.price).toFixed(2)} €</span>
            <span className="article-title">{art.title}</span>
            <span className="article-vendeur">👤 {art.ownerId?.substring(0,8)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default Catalog;