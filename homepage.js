const API_KEY = import.meta.env.VITE_CAT_API_KEY;

let breeds = [];

//fetch breeds 
async function fetchBreeds() {
    const response = await fetch("https://api.thecatapi.com/v1/breeds", {
    headers: { "x-api-key": API_KEY }
  });

    breeds = await response.json();
    breedDropdown();
    randomDex(8);
}

function breedDropdown() {
    const datalist = document.getElementById("breedList");
    datalist.innerHTML = "";

    breeds.forEach(breed => {
    const option = document.createElement("option");
    option.value = breed.name; //filter breeds
    datalist.appendChild(option);

  });
}

//fetch breed image
async function fetchBreedImage(breedId) {
  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`,
    { headers: { "x-api-key": API_KEY } }
  );

  const data = await response.json();
  return data[0]?.url;
}


//display breeds
async function randomDex(count) {
  const container = document.getElementById("dexContainer");
  container.innerHTML = ""; // clear old cards

  for (let i = 0; i < count; i++) {
    const randomBreed =
      breeds[Math.floor(Math.random() * breeds.length)];

    const imageUrl = await fetchBreedImage(randomBreed.id);

    createCard(randomBreed, imageUrl);
  }
}


//create card
function createCard(breed, imageUrl) {
  const container = document.getElementById("dexContainer");

  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <img src="${imageUrl}" alt="${breed.name}">
    <h2>${breed.name}</h2>
    <p>${breed.temperament}</p>
  `;

 
  card.addEventListener("click", () => {
  window.location.href = `catInfo.html?id=${breed.id}`;
  });


  container.appendChild(card);
}



async function searchBreed() {
  const searchValue = document
    .getElementById("breedInput")
    .value
    .toLowerCase();

  const foundBreed = breeds.find(breed =>
    breed.name.toLowerCase().includes(searchValue)
  );

  if (foundBreed) {
    window.location.href = `catInfo.html?id=${foundBreed.id}`;
  } else {
    alert("No breed found with that name");
  }
}

document.getElementById("randomBtn").addEventListener("click", () => {
  randomDex(8);
});

document.getElementById("searchButton").addEventListener("click", () => {
  const input = document.getElementById("breedInput").value.toLowerCase();
  const foundBreed = breeds.find(b => b.name.toLowerCase() === input);
  if (foundBreed) {
    window.location.href = `catInfo.html?id=${foundBreed.id}`;
  } else {
    alert("Breed not found");
  }
});

// Load on page start
fetchBreeds();