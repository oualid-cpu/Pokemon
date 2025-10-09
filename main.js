// Connect to HTML elements
const container = document.getElementById("card-container");
const template = document.getElementById("card-template").firstElementChild;

// Save Pokémon to localStorage
function savePokemonToLocalStorage(pokemon) {
  const caught = JSON.parse(localStorage.getItem("caughtPokemons")) || [];
  if (!caught.some(p => p.id === pokemon.id)) {
    caught.push(pokemon);
    localStorage.setItem("caughtPokemons", JSON.stringify(caught));
    console.log(`✅ Saved ${pokemon.name}`);
  } else {
    console.log(`⚠️ ${pokemon.name} already in Pokédex`);
  }
}

// Create one Pokémon card from template
function createPokemonCard(pokemonObj) {
  const card = template.cloneNode(true);

  card.querySelector(".pokemon-img").src = pokemonObj.image;
  card.querySelector(".pokemon-img").alt = pokemonObj.name;
  card.querySelector(".pokemon-name").textContent = pokemonObj.name;
  card.querySelector(".pokemon-id").textContent = `# ${pokemonObj.id}`;
  card.querySelector(".pokemon-height").textContent = `Height: ${pokemonObj.height}`;
  card.querySelector(".pokemon-type").textContent = `Types: ${pokemonObj.types}`;

  const button = card.querySelector("button");
  button.addEventListener("click", () => {
    savePokemonToLocalStorage(pokemonObj);
    button.textContent = "Added 💖";
    button.classList.add("bg-purple-500");
  });

  return card;
}

// Fetch Pokémon data and display cards
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
        image: pokeData.sprites.front_default
      };

      const card = createPokemonCard(pokemonObj);
      container.appendChild(card);
    }
  } catch (err) {
    console.error("❌ Error loading Pokémons:", err);
  }
}

// Start everything
loadPokemons();