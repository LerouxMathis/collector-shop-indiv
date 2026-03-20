import React, { useState } from 'react';
import api from '../services/api';

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
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <h3>Vendre un nouvel article</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre : </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Prix (€) : </label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Publier l'annonce</button>
      </form>
    </div>
  );
};

export default AddArticle;