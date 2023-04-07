import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJson, sendJson } from './helper.js';

export const state = {
  recipe: {},
  searchResults: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // console.log(`${API_URL}${id}`);\
    const data = await getJson(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    // const { recipe } = data.data;
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceURL: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };

    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (err) {
    // alert(err);
    // console.error(`${err} booom boooom boooom`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.searchResults.query = query;
    const data = await getJson(`${API_URL}/?search=${query}&key=${KEY}`);

    state.searchResults.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // console.log(state);
  } catch (err) {
    console.error(`${err} booom boooom boooom`);
    throw err;
  }
};

// loadSearchResults('pizza');

export const getSearchResultsPage = function (page = 1) {
  state.searchResults.page = page;
  const start = (page - 1) * state.searchResults.resultsPerPage;
  const end = page * state.searchResults.resultsPerPage;
  return state.searchResults.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQT= oldqt*new servings/oldServings
  });

  state.recipe.servings = newServings;
};

const saveBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add bookmarks
  state.bookmarks.push(recipe);

  //mark current recipe as bookmakr

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  saveBookmarks();
};

export const removeBookmark = function (id) {
  //remove bookmarks

  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //mark current recipe as bookmakr

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  saveBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newrecipe) {
  // console.log(Object.entries(newrecipe));
  try {
    const ingredients = Object.entries(newrecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArray = ing[1].replaceAll(' ', '').split(',');

        if (ingArray.length !== 3)
          throw new Error('Wrong Format. Please check');
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // console.log(ingredients);

    const recipe = {
      title: newrecipe.title,
      publisher: newrecipe.publisher,
      source_url: newrecipe.sourceUrl,
      image_url: newrecipe.image,
      servings: +newrecipe.servings,
      cooking_time: +newrecipe.cookingTime,
      ingredients,
    };

    const data = await sendJson(`${API_URL}/?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
