import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AddArticle from './AddArticle';

const Catalog = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 1. Déclaration du contrôleur d'annulation (Évite les fuites de mémoire)
    const controller = new AbortController();
    let isMounted = true;

    // 2. Encapsulation de la logique asynchrone DANS l'effet
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles', { 
          signal: controller.signal 
        });
        
        // 3. Mise à jour de l'état uniquement si le composant est toujours affiché
        if (isMounted) {
          setArticles(response.data);
        }
      } catch (error) {
        // On ignore l'erreur si elle est due à l'annulation volontaire de la requête
        if (error.name !== 'CanceledError') {
          console.error("Erreur de récupération du catalogue", error);
        }
      }
    };

    // Appel immédiat de la fonction interne
    fetchArticles();

    // 4. Fonction de nettoyage (Cleanup) exécutée au démontage du composant
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Le tableau vide garantit une exécution unique au montage

  const handleArticleAdded = (newArticle) => {
    setArticles([...articles, newArticle]);
  };

  return (
    <div>
      <h2>Catalogue de la Marketplace</h2>
      {articles.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        <ul>
          {articles.map((art) => (
            <li key={art.id}>
              <strong>{art.title}</strong> - {art.price} € (Vendeur ID: {art.ownerId.substring(0,8)}...)
            </li>
          ))}
        </ul>
      )}
      <AddArticle onArticleAdded={handleArticleAdded} />
    </div>
  );
};

export default Catalog;