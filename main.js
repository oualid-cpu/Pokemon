const container = document.getElementById("card-container");
const template = document.getElementById("card-template").firstElementChild;

fetch("https://pokeapi.co/api/v2/pokemon?limit=2000") 
  .then(res => res.json())
  .then(async data => {
    for (const pokemon of data.results) {
      const pokeResp = await fetch(pokemon.url);
      const pokeData = await pokeResp.json();

      // Clone template
      const card = template.cloneNode(true);

      // Fill data
      card.querySelector(".pokemon-img").src = pokeData.sprites.front_default;
      card.querySelector(".pokemon-img").alt = pokeData.name;
      card.querySelector(".pokemon-name").textContent = pokeData.name;
      card.querySelector(".pokemon-id").textContent = `# ${pokeData.id}`;
      card.querySelector(".pokemon-height").textContent = `Height: ${pokeData.height}`;
      card.querySelector(".pokemon-type").textContent = `Types: ${pokeData.types.map(t => t.type.name).join(", ")}`;

      // Append to container
      container.appendChild(card);
    }
  })
  .catch(err => console.error("Error loading pokemons:", err));