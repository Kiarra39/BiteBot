import React, { useState } from 'react';
import axios from 'axios';
import './index.css'; // 👈 Import the external CSS file

const App = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setRecipe('');
  setError('');

  try {
    const ingredientsArray = ingredients
      .split(',')
      .map(item => item.trim())
      .filter(item => item); // remove empty strings

    const response = await axios.post('https://bitebot-server.onrender.com/api/recipe', {
      ingredients: ingredientsArray,
    });

    setRecipe(response.data.recipe);
  } catch (err) {
    setError('Failed to generate recipe. Please try again.');
    console.error('Error:', err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container">
      <h1 className="title">🍳 BiteBot: AI Recipe Generator</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter ingredients (e.g. rice, tomato)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </form>

      {recipe && (
        <div className="result">
          <h2>🍽 Your Recipe</h2>
          <pre className="recipe">{recipe}</pre>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;
