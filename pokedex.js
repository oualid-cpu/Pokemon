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

  savedPokemons.forEach(pokemon => {
    const card = document.createElement("div");
    card.className =
      "bg-cyan-500 border-4 border-cyan-500 rounded-xl shadow-md text-black flex flex-col justify-between overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-400";

    card.innerHTML = `
      <div class="bg-green-200 flex justify-center p-4">
        <img src="${pokemon.image}" alt="${pokemon.name}" class="w-24 h-24">
      </div>
      <div class="px-4 py-2">
        <h3 class="text-center font-bold">${pokemon.name}</h3>
        <p class="text-center">#${pokemon.id}</p>
        <p class="text-center">Height: ${pokemon.height}</p>
        <p class="text-center">Types: ${pokemon.types}</p>
      </div>
      <button class="remove-btn bg-red-400 hover:bg-red-800 text-white font-semibold py-2 rounded-b-xl">
        Remove ❌
      </button>
    `;

    // Remove Pokémon when button clicked
    card.querySelector(".remove-btn").addEventListener("click", () => {
      removePokemonFromLocalStorage(pokemon.id);
      card.remove(); // remove card visually

      // If no Pokémon left, show message
      if (container.children.length === 0) {
        container.innerHTML = `
          <p class="text-center text-gray-400 col-span-full">
            No Pokémon left in your Pokédex 😢<br>
            <a href="index.html" class="text-cyan-400 underline hover:text-cyan-200">Catch some more!</a>
          </p>
        `;
      }
    });

    container.appendChild(card);
  });
});

function removePokemonFromLocalStorage(id) {
  let pokemons = JSON.parse(localStorage.getItem("caughtPokemons")) || [];
  pokemons = pokemons.filter(p => p.id !== id);
  localStorage.setItem("caughtPokemons", JSON.stringify(pokemons));
}
