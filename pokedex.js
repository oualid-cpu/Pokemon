document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pokedex-container");
  const savedPokemons = JSON.parse(localStorage.getItem("caughtPokemons")) || [];

  if (savedPokemons.length === 0) {
    container.innerHTML = `
      <p class="text-center text-gray-400 col-span-full">
        No Pokémon caught yet 😢<br>
        <a href="index.html" class="text-cyan-400 underline hover:text-cyan-200">Go catch some!</a>
      </p>
    `;
    return;
  }

    // create cards
  savedPokemons.forEach((pokemon) => {
    const card = document.createElement("div");
    card.className =
      "bg-cyan-500 border-4 border-cyan-500 rounded-xl shadow-md text-black flex flex-col justify-between items-center overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-400 w-64 mx-auto mb-6";

    card.innerHTML = `
      <div class="bg-green-200 flex justify-center p-4">
        <img src="${pokemon.image}" alt="${pokemon.name}" class="w-24 h-24" />
      </div>
      <div class="px-4 py-2 font-bold">
        <h3 class="text-center">${pokemon.name}</h3>
        <p class="text-center">#${pokemon.id}</p>
        <p class="text-center">Height: ${pokemon.height}</p>
        <p class="text-center">Types: ${pokemon.types}</p>
      </div>
      <button class="remove-btn bg-red-400 hover:bg-red-800 text-white font-semibold py-2 rounded-b-none w-full">
        Remove ❌
      </button>
      <div class="bg-gray-800 p-3 w-full text-center rounded-b-xl">
        <p class="text-cyan-300 font-semibold mb-2">Write here:</p>
        <input type="text" placeholder="Your note..."
          class="p-2 w-11/12 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
      </div>
    `;

    // --- remove logic
    card.querySelector(".remove-btn").addEventListener("click", () => {
      removePokemonFromLocalStorage(pokemon.id);
      card.remove();

      if (container.children.length === 0) {
        container.innerHTML = `
          <p class="text-center text-gray-400 col-span-full">
            No Pokémon left in your Pokédex 😢<br>
            <a href="index.html" class="text-cyan-400 underline hover:text-cyan-200">
              Catch some more!
            </a>
          </p>
        `;
      }
    });

    container.appendChild(card);
  });
});

// --- remove function
function removePokemonFromLocalStorage(id) {
  let pokemons = JSON.parse(localStorage.getItem("caughtPokemons")) || [];
  pokemons = pokemons.filter(p => p.id !== id);
  localStorage.setItem("caughtPokemons", JSON.stringify(pokemons));
}
