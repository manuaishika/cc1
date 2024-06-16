// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recipes', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a recipe schema and model
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: String,
  instructions: String,
  image: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/api/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

app.post('/api/recipes', async (req, res) => {
  const newRecipe = new Recipe(req.body);
  await newRecipe.save();
  res.json(newRecipe);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
document.addEventListener('DOMContentLoaded', () => {
  const recipeForm = document.getElementById('new-recipe-form');
  const recipeList = document.getElementById('recipe-list');
  const recipeModal = document.getElementById('recipe-modal');
  const closeModalButton = document.querySelector('.close-button');
  const modalTitle = document.getElementById('modal-title');
  const modalIngredients = document.getElementById('modal-ingredients');
  const modalInstructions = document.getElementById('modal-instructions');
  const modalImage = document.getElementById('modal-image');

  recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(recipeForm);
    const recipe = {
      title: formData.get('title'),
      ingredients: formData.get('ingredients'),
      instructions: formData.get('instructions'),
      image: formData.get('image')
    };

    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    });

    const newRecipe = await response.json();
    displayRecipe(newRecipe);
    recipeForm.reset();
  });

  async function loadRecipes() {
    const response = await fetch('/api/recipes');
    const recipes = await response.json();
    recipes.forEach(displayRecipe);
  }

  function displayRecipe(recipe) {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    recipeDiv.innerHTML = `
      <h3>${recipe.title}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.split(',').join(', ')}</p>
      <p><strong>Instructions:</strong> ${recipe.instructions}</p>
      ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}">` : ''}
    `;
    recipeDiv.addEventListener('click', () => openModal(recipe));
    recipeList.appendChild(recipeDiv);
  }

  function openModal(recipe) {
    modalTitle.textContent = recipe.title;
    modalIngredients.textContent = recipe.ingredients;
    modalInstructions.textContent = recipe.instructions;
    modalImage.src = recipe.image || '';
    modalImage.alt = recipe.title;
    recipeModal.style.display = 'block';
  }

  closeModalButton.addEventListener('click', () => {
    recipeModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === recipeModal) {
      recipeModal.style.display = 'none';
    }
  });

  loadRecipes();
});
