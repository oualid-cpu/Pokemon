// Connect to HTML elements
const container = document.getElementById("card-container");
const template = document.getElementById("card-template").firstElementChild;
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

let pokemonList = []; // store all Pokémon for searching

// 🧠 Save Pokémon (and note) to localStorage
function savePokemonToLocalStorage(pokemon) {
  const caught = JSON.parse(localStorage.getItem("caughtPokemons")) || [];
  const existing = caught.find(p => p.id === pokemon.id);

  if (existing) {
    // update existing Pokémon (note or info)
    existing.note = pokemon.note;
    console.log(`✏️ Updated note for ${pokemon.name}`);
  } else {
    caught.push(pokemon);
    console.log(`✅ Saved ${pokemon.name}`);
  }

  localStorage.setItem("caughtPokemons", JSON.stringify(caught));
}

// 🎴 Create Pokémon card from template
function createPokemonCard(pokemonObj) {
  const card = template.cloneNode(true);

  card.querySelector(".pokemon-img").src = pokemonObj.image;
  card.querySelector(".pokemon-img").alt = pokemonObj.name;
  card.querySelector(".pokemon-name").textContent = pokemonObj.name;
  card.querySelector(".pokemon-id").textContent = `# ${pokemonObj.id}`;
  card.querySelector(".pokemon-height").textContent = `Height: ${pokemonObj.height}`;
  card.querySelector(".pokemon-type").textContent = `Types: ${pokemonObj.types}`;

  // note textarea
  const noteField = card.querySelector(".pokemon-note");
  noteField.value = pokemonObj.note || "";
  noteField.addEventListener("input", () => {
    pokemonObj.note = noteField.value;
  });

  const button = card.querySelector("button");
  button.addEventListener("click", () => {
    savePokemonToLocalStorage(pokemonObj);
    button.textContent = "Added 💖";
    button.classList.add("bg-purple-500");
  });

  return card;
}

// 🌐 Fetch Pokémon data
async function loadPokemons(limit = 60) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const data = await res.json();

    for (const pokemon of data.results) {
      const pokeResp = await fetch(pokemon.url);
      const pokeData = await pokeResp.json();

      const pokemonObj = {
        id: pokeData.id,
        name: pokeData.name,
        height: pokeData.height,
        types: pokeData.types.map(t => t.type.name).join(", "),
        image: pokeData.sprites.front_default,
        note: "" // new property 
      };

      pokemonList.push(pokemonObj);
      const card = createPokemonCard(pokemonObj);
      container.appendChild(card);
    }
  } catch (err) {
    console.error("❌ Error loading Pokémons:", err);
  }
}

// 🔍 Search bar logic
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  const found = pokemonList.find(
    p => p.name.toLowerCase() === query || p.id.toString() === query
  );

  if (found) {
    showCardPopup(found);
  } else {
    alert("❌ Pokémon not found!");
  }

  searchInput.value = "";
});

// 💡 Popup using same card style
function showCardPopup(pokemon) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]";

  const popupCard = createPokemonCard(pokemon);
  popupCard.classList.add(
    "scale-125",
    "shadow-2xl",
    "border-4",
    "border-pink-500"
  );

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close ✖";
  closeBtn.className =
    "absolute top-4 right-4 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold";
  closeBtn.addEventListener("click", () => overlay.remove());

  const popupContainer = document.createElement("div");
  popupContainer.className = "relative";
  popupContainer.appendChild(popupCard);
  popupContainer.appendChild(closeBtn);

  overlay.appendChild(popupContainer);
  document.body.appendChild(overlay);
}

// 🚀 Start
loadPokemons();
