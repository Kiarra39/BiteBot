const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['https://bite-bot-phi.vercel.app', 'http://localhost:5173'], // Adjust the origin as needed
}));
app.use(express.json());

app.post('/api/recipe', async (req, res) => {
  const { ingredients } = req.body;
  console.log("Received ingredients:", ingredients);

  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients must be an array' });
  }

  try {
    console.log("seding request");
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Suggest a recipe using these ingredients: ${ingredients.join(', ')}. Give it in a structured format.`,
              },
            ],
          },
        ],
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Generated text:", generatedText);

    if (generatedText) {
      res.json({ recipe: generatedText });
    } else {
      res.status(500).json({ error: 'No recipe generated' });
    }

  }catch (error) {
  console.error('Error generating recipe:', error.response?.data || error.message);
  res.status(500).json({ error: 'Failed to generate recipe' });
}
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
