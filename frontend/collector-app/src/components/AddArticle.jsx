import React, { useState } from 'react';
import api from '../services/api';
import './AddArticle.css'; // Import des styles du formulaire

const AddArticle = ({ onArticleAdded }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/articles', { 
        title, 
        price: parseFloat(price) 
      });
      onArticleAdded(response.data);
      setTitle('');
      setPrice('');
      alert('Article créé ! Un événement a été envoyé à Kafka.');
    } catch (error) {
      console.error("Erreur lors de la création", error);
      alert('Erreur de création (Vérifiez que le backend tourne et que vous êtes authentifié)');
    }
  };

  return (
    <div className="add-article-container">
      <h3 className="add-article-title">Vendre une nouvelle pépite</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Titre de l'objet</label>
          <input 
            type="text" 
            className="form-input"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Ex: Carte Pokémon Dracaufeu Edition 1"
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Prix souhaité (€)</label>
          <input 
            type="number" 
            step="0.01" 
            className="form-input"
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Ex: 150.00"
            required 
          />
        </div>
        <button type="submit" className="submit-button">Publier l'annonce</button>
      </form>
    </div>
  );
};

export default AddArticle;