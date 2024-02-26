const public_key = "9798c70d3a564b5b348e0faab8ac5062";
const private_key = "da5aafdff6ebeddaa9bc8db4b9e87dbc02ca049a";
let ts = Date.now();
const hash = CryptoJS.MD5(ts + private_key + public_key).toString();
const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${public_key}&hash=${hash}`;

const defaultDescription =
  "The Marvel Cinematic Universe (MCU) is an American media franchise and shared universe centered on a series of superhero films produced by Marvel Studios.";

const CharactersContainer = document.querySelector("#characters");
const SearchInput = document.querySelector("#search-bar-input");
const SearchButton = document.querySelector("#search-btn");

let loading = true;
let filterText = "";
let AllCharacters = [];
let FilteredCharacter = [];
let FavoriteCharacters = [];

async function fetchAllCharacters() {
  loading = true;
  try {
    renderCharacterCards([]);
    const response = await fetch(url);
    const res = await response.json();
    if (res.status == "Ok") {
      const { results } = res.data;
      AllCharacters = results;
      loading = false;
      renderCharacterCards(results);
    }
  } catch (error) {
    loading = false;
    console.log(error);
  }
}

async function fetchSearchCharacters(text) {
  const filterUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${text}&ts=${ts}&apikey=${public_key}&hash=${hash}`;
  loading = true;
  try {
    renderCharacterCards([]);
    const response = await fetch(filterUrl);
    const res = await response.json();
    if (res.status == "Ok") {
      const { results } = res.data;
      FilteredCharacter = results;
      loading = false;
      renderCharacterCards(results);
    }
  } catch (error) {
    loading = false;
    console.log(error);
  }
}

function createCharacterCard(character) {
  const CharacterCard = document.createElement("div");
  CharacterCard.id = "character-card";
  const ImageContainer = document.createElement("div");
  ImageContainer.classList.add("img-container");
  const Image = document.createElement("img");
  Image.setAttribute(
    "src",
    `${character.thumbnail.path}.${character.thumbnail.extension}`
  );
  //add scr attribute when the data comes
  const ImageDescription = document.createElement("p");
  ImageDescription.classList.add("character-description");
  if (character.description != "") {
    ImageDescription.textContent = character.description;
  } else {
    ImageDescription.textContent = defaultDescription;
  }
  ImageContainer.appendChild(Image);
  ImageContainer.appendChild(ImageDescription);
  const Title = document.createElement("h4");
  Title.classList.add("character-name");
  Title.textContent = character.name;
  const AFButton = document.createElement("button");
  AFButton.classList.add("add-to-favorite");
  AFButton.textContent = "Add To Favorite";
  // AFButton.addEventListener('click', () => addToFavorites(AFButton, card));

  CharacterCard.appendChild(ImageContainer);
  CharacterCard.appendChild(Title);
  CharacterCard.appendChild(AFButton);
  return CharacterCard;
}

function createLoader() {
  const loading = document.createElement("div");
  loading.classList.add("loading");
  return loading;
}

function createNoResultFoundElement() {
  const EmptyElem = document.createElement("div");
  EmptyElem.textContent = "No Result Found. Back to ";
  const ReturnHomeElement = document.createElement("a");
  ReturnHomeElement.href = "index.html";
  ReturnHomeElement.textContent = "home";
  EmptyElem.appendChild(ReturnHomeElement);
  return EmptyElem;
}

function renderCharacterCards(AllCharacters) {
  CharactersContainer.innerHTML = "";
  if (loading && AllCharacters.length == 0) {
    const loader = createLoader();
    CharactersContainer.appendChild(loader);
  } else if (!loading && AllCharacters.length == 0) {
    const EmptyElem = createNoResultFoundElement();
    CharactersContainer.appendChild(EmptyElem);
  } else {
    AllCharacters.forEach((character) => {
      const Card = createCharacterCard(character);
      CharactersContainer.appendChild(Card);
    });
  }
}

function handleSearchCharacters() {
  let text = SearchInput.value;
  if (text.trim != "") {
    fetchSearchCharacters(text);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllCharacters();
});
SearchButton.addEventListener("click", function (e) {
  e.preventDefault();
  handleSearchCharacters();
});
