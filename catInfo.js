const API_KEY = import.meta.env.VITE_CAT_API_KEY;

let breeds = [];


const params = new URLSearchParams(window.location.search);
const breedId = params.get("id");

async function fetchBreeds() {
  const response = await fetch("https://api.thecatapi.com/v1/breeds", {
    headers: { "x-api-key": API_KEY }
  });

  breeds = await response.json();

  breedDropdown();
  fetchBreedInfo(breedId);
}

//dropdown cat breed datalist
function breedDropdown() {
    const datalist = document.getElementById("breedList");
    datalist.innerHTML = "";

    breeds.forEach(breed => {
    const option = document.createElement("option");
    option.value = breed.name; //filter breeds
    datalist.appendChild(option);

  });
}


async function fetchBreedInfo(breedId) {
  if (!breedId) return;

  const breed = breeds.find(b => b.id === breedId);

  if (!breed) return;

  // Fetch image
  const imageResponse = await fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breed.id}`,
    { headers: { "x-api-key": API_KEY } }
  );
  const imageData = await imageResponse.json();
  const imageUrl = imageData[0]?.url;

  displayBreedInfo(breed, imageUrl);
}


function displayBreedInfo(breed, imageUrl) {
  document.getElementById("catName").textContent = breed.name;

  document.getElementById("catDescription").innerHTML =
    `<strong>Description:</strong> ${breed.description}`;

  document.getElementById("catOrigin").innerHTML =
    `<strong>Origin:</strong> ${breed.origin}`;

  document.getElementById("catTemperament").innerHTML =
    `<strong>Temperament:</strong> ${breed.temperament}`;

  document.getElementById("catLifeSpan").innerHTML =
    `<strong>Life Span:</strong> ${breed.life_span} years`;

  document.getElementById("wikiUrl").innerHTML =
    `<strong>Wikipedia:</strong> <a href="${breed.wikipedia_url}" target="_blank">${breed.name} cat Wiki page</a>`;

  document.getElementById("catImage").src = imageUrl;
}


fetchBreeds();
document.getElementById("searchButton").addEventListener("click", () => {
  const input = document.getElementById("breedInput").value.toLowerCase();

  const foundBreed = breeds.find(
    b => b.name.toLowerCase() === input
  );

  if (foundBreed) {
    window.location.href = `/catInfo.html?id=${foundBreed.id}`;
  } else {
    alert("Breed not found");
  }
});