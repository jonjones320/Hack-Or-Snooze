"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let user;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
*
* Returns the markup for the story.
*/
const loggedIn = Boolean(currentUser);

function getStarHTML() {
  `<input type="checkbox" id="faveStar" class="faveStar">`
  isFavorite(story)
}

function isFavorite(story) {
  const fave = currentUser.favorites
  if (fave.includes(story)) {
    return true;
  }
}

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup");
  
  const hostName = story.getHostName();
  return $(`
  <li id="${story.storyId}">
  <input type="checkbox" id="faveStar" class="faveStar">
  <input type="checkbox" id="deleteBttn" class="deleteBttn">
  <a href="${story.url}" target="a_blank" class="story-link">
  ${story.title}
  </a>
  <small class="story-hostname">(${hostName})</small>
  <small class="story-author">by ${story.author}</small>
  <small class="story-user">posted by ${story.username}</small>
  </li>
  `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  
  $allStoriesList.empty();
  $favoritedStories.empty();
  
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  updateFavorites();  
  $allStoriesList.show();
}

// User submits new story, and new story is added to the DOM and their profile //

async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();
  
  const title = $("#newStoryTitle").val();
  const author = $("#newStoryAuthor").val();
  const url = $("#newStoryUrl").val();
  const username = currentUser.username;

  const newStory = await storyList.addStory(currentUser, {author, title, url, username});
  
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  
  $allStoriesList.show();
  $newStoryForm.hide();
  $newStoryForm.trigger("reset");
}

$($newStoryForm).on("submit", submitStory)

// When story is favorited it is added to the favorites list 

function updateFavorites() {
  console.debug("updateFavorites");
  const userFavorites = currentUser.favorites;
  for (let story of userFavorites) {
    $favoritedStories.append(generateStoryMarkup(story));
  }
  $favoritedStories.show();
}

async function favoriteStory(e) {
  const token = `${currentUser.loginToken}`;
  const faveStoryId = e.target.closest("li").id;
  await axios({
    url: `${BASE_URL}/users/${currentUser.username}/favorites/${faveStoryId}`,
    method: "POST",
    data: {token},
  });
  
  updateFavorites();
}
$allStoriesList.toggleClass('click', "#faveStar", favoriteStory);


async function remove(e) {
  const storyId = e.target.closest('li').id;
  await storyList.removeStory(currentUser, storyId);
};

$allStoriesList.on('click', "#deleteBttn", remove);