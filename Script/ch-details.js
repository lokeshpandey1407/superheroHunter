const public_key = "9798c70d3a564b5b348e0faab8ac5062";
const private_key = "da5aafdff6ebeddaa9bc8db4b9e87dbc02ca049a";
let ts = Date.now();
const hash = CryptoJS.MD5(ts + private_key + public_key).toString();

const MainContainer = document.querySelector("main");
let CharacterDetails = {};

//Getting the id from the url
function getCharacter() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    const id = urlParams.get("id");
    fetchCharacterDetails(id);
  }
}

function characterComicsDetailsGenerator(key, character) {
  const Container = document.createElement("div");
  Container.id = key;
  Container.classList.add("details");
  const title = document.createElement("h4");
  title.textContent = `${key}:`;
  const data = document.createElement("p");
  if (character[key].items.length > 0) {
    character[key].items.forEach((element) => {
      const dataElement = document.createElement("span");
      dataElement.textContent = `${element.name}, `;
      data.appendChild(dataElement);
    });
  }

  Container.appendChild(title);
  Container.appendChild(data);
  return Container;
}

//Creating Character Content page
function createCharacterContent(character) {
  const ThumbnailSection = document.createElement("section");
  ThumbnailSection.id = "thumbnail";
  const CharacterInfoSection = document.createElement("section");
  CharacterInfoSection.id = "char-info";
  const ThumbnailImage = document.createElement("img");
  ThumbnailImage.setAttribute(
    "src",
    `${character.thumbnail.path}.${character.thumbnail.extension}`
  );
  const InformationContainer = document.createElement("div");
  InformationContainer.classList.add("info-container");
  const Title = document.createElement("h3");
  Title.textContent = character.name;
  InformationContainer.appendChild(Title);
  if (character.description != "") {
    const Description = document.createElement("p");
    Description.textContent = character.description;
    InformationContainer.appendChild(Description);
  }
  const Comics = characterComicsDetailsGenerator("comics", character);
  const Series = characterComicsDetailsGenerator("series", character);
  const Events = characterComicsDetailsGenerator("events", character);
  const Stories = characterComicsDetailsGenerator("stories", character);

  ThumbnailSection.appendChild(ThumbnailImage);
  // need to add other information inside Information Container
  CharacterInfoSection.appendChild(InformationContainer);
  CharacterInfoSection.appendChild(Comics);
  CharacterInfoSection.appendChild(Series);
  CharacterInfoSection.appendChild(Events);
  CharacterInfoSection.appendChild(Stories);
  MainContainer.appendChild(ThumbnailSection);
  MainContainer.appendChild(CharacterInfoSection);
}

//Fetching Character details from an api using id
async function fetchCharacterDetails(id) {
  loading = true;
  const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${public_key}&hash=${hash}`;
  try {
    const response = await fetch(url);
    const res = await response.json();
    if (res.status == "Ok") {
      const { results } = res.data;
      CharacterDetails = results[0];
      createCharacterContent(results[0]);
      loading = false;
    }
  } catch (error) {
    loading = false;
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", getCharacter);
