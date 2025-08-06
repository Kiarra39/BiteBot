import React, { useState } from 'react';
import axios from 'axios';

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
        .filter(item => item);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-extrabold text-[#ff7043] text-center mb-8 drop-shadow-sm">
          🍳 BiteBot: AI Recipe Generator
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter ingredients (e.g. rice, tomato)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="p-4 border-2 border-orange-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <button
            type="submit"
            className="bg-[#ff7043] text-white text-base font-semibold py-3 rounded-md hover:bg-[#ff5722] transition-all duration-300 shadow-md disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Recipe'}
          </button>
        </form>

        {/* Recipe Response Block */}
        {recipe && (
          <div className="bg-orange-50 border-l-4 border-[#ff7043] p-6 rounded-lg shadow-lg mb-6 transition-all duration-300">
            <h2 className="text-2xl font-bold text-[#ff5722] mb-4 flex items-center gap-2">
              🍽 <span>Your Personalized Recipe</span>
            </h2>
            <pre className="bg-white p-4 rounded-md text-gray-800 text-sm leading-relaxed whitespace-pre-wrap border border-gray-300 overflow-x-auto">
              {recipe}
            </pre>
          </div>
        )}

        {/* Error Block */}
        {error && (
          <p className="text-red-600 text-sm font-medium text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default App;
