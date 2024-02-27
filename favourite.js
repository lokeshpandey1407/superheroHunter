const CharactersContainer = document.querySelector("#characters");
let loading = true;
const defaultDescription =
  "The Marvel Cinematic Universe (MCU) is an American media franchise and shared universe centered on a series of superhero films produced by Marvel Studios.";
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
  const RFButton = document.createElement("button");
  RFButton.classList.add("add-to-favorite");
  RFButton.textContent = "Remove From Favourite";
  // RFButton.addEventListener("click", () => removeFromFavourites(character));

  CharacterCard.appendChild(ImageContainer);
  CharacterCard.appendChild(Title);
  CharacterCard.appendChild(RFButton);
  Title.addEventListener("click", function () {
    window.location.href = `character-details.html?id=${character.id}`;
  });
  return CharacterCard;
}

function renderCharacterCards(AllCharacters) {
  CharactersContainer.innerHTML = "";
  if (loading && AllCharacters.length == 0) {
    const loader = createLoader();
    CharactersContainer.appendChild(loader);
  } else {
    AllCharacters.forEach((character) => {
      const Card = createCharacterCard(character);
      CharactersContainer.appendChild(Card);
    });
  }
}

function createLoader() {
  const loading = document.createElement("div");
  loading.classList.add("loading");
  return loading;
}

function renderFavouritePage() {
  let favorites = JSON.parse(localStorage.getItem("favourites"));
  renderCharacterCards(favorites);
}

document.addEventListener("DOMContentLoaded", renderFavouritePage);
