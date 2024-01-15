"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navHidden.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Shows the form for submitting a story when clicked //
function navSubmitClick(evt) {
  console.debug('navSubmitClick', evt);
  hidePageComponents();
  $newStoryForm.show();
}

$navSubmitStory.on("click", navSubmitClick);


// Shows the currentUsers favorite story list //
function navFavoritesClick(evt) {
  console.debug('navFavoritesClick', evt);
  hidePageComponents();
  $favoritedStories.show();
}

$navFavorites.on("click", navFavoritesClick);