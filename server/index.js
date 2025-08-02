const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { ingredients } = req.body;

  try {
    const prompt = `Suggest a simple and tasty recipe using the following ingredients: ${ingredients}. Keep the instructions short and beginner-friendly.`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      res.json({ recipe: generatedText });
    } else {
      res.status(500).json({ error: 'No recipe generated' });
    }
  } catch (error) {
    console.error('Error generating recipe:', error.message);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
