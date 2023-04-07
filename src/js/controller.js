// import icons from '../img/icons'; //parcel 1

// parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import addUserRecipeView from './views/addUserRecipeView.js';
import paginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SECONDS } from './config.js';

// console.log(icons);

// console.log('test');

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept;
}

///////////////////////////////////////

// document.querySelector('.header').addEventListener('click', function (e) {
//   // e.preventDefault();
//   let url = window.location.href;
//   console.log(typeof url);
//   const el = e.target.className;
//   if (el === 'header__logo') {
//     window.history.pushState(null, '', url);
//     // location.reload();
//   }

//   console.log(window.location.href);
// });

// document.querySelector('.header__logo').addEventListener('click', function () {
//   let url = window.location.href;
//   window.history.pushState(null, '', url);
//   // location.reload();
// });
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    // console.log(recipeView);

    // console.log(id);

    if (!id) return;
    resultsView.renderSpinner();

    // console.log(model.getSearchResultsPage());

    //update results view to mark selected search results

    resultsView.render(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //Loading recipe\
    await model.loadRecipe(id);

    // console.log(recipe);
    //rendering recipe
    // console.log(recipe);
    recipeView.render(model.state.recipe);

    // console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err.message}`);
    // console.log(err);
  }
};

const controlSearcResults = async function () {
  try {
    resultsView.renderSpinner();
    //GET SEARCH QUERY

    // console.log(resultsView);

    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    // LOAD SEARCH RESULTS
    await model.loadSearchResults(query);
    //RENDER RESULTS
    // console.log(model.state.searchResults.results);

    resultsView.render(model.getSearchResultsPage());

    //RENDER INITIAL PAGINATION

    paginationView.render(model.state.searchResults);
  } catch (err) {}
};

const controlPagination = function (goToPage) {
  //RENDER NEW RESULTS

  resultsView.render(model.getSearchResultsPage(goToPage));

  //RENDER INITIAL PAGINATION

  paginationView.render(model.state.searchResults);
};

const controlServings = function (newServings) {
  //update the recipe serving (in state)
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
  //update recipe view
};

const controlAddBookmark = function () {
  //ADD REMOVE BOOKMARKS
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // console.log(model.state);
  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newrecipe) {
  // console.log(newrecipe);

  try {
    addUserRecipeView.renderSpinner();

    await model.uploadRecipe(newrecipe);
    // console.log(model.state.recipe);

    //render user recipe

    recipeView.render(model.state.recipe);
    //close form window

    //success message
    addUserRecipeView.renderMessage();

    //Render the bookmark view

    bookmarksView.render(model.state.bookmarks);

    //chnage Id in the url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addUserRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    addUserRecipeView.renderError(err);
  }
};

const newFeature = function () {
  console.log('WELCOME');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdate(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearcResults);
  paginationView.addHandlerClick(controlPagination);
  addUserRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
