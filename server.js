const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recipes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Define a recipe schema and model
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  image: { type: String }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes

// Get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recipes', error });
  }
});

// Create a new recipe
app.post('/api/recipes', async (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  const newRecipe = new Recipe({
    title,
    ingredients,
    instructions,
    image
  });

  try {
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error saving recipe', error });
  }
});

// Serve the application
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
