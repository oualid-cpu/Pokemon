document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pokedex-container");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  let savedPokemons = JSON.parse(localStorage.getItem("caughtPokemons")) || [];

  // Show message if no Pokémon are saved
  if (savedPokemons.length === 0) {
    container.innerHTML = `
      <p class="text-center text-gray-400 col-span-full">
        No Pokémon caught yet 😢<br>
        <a href="index.html" class="text-cyan-400 underline hover:text-cyan-200">Go catch some!</a>
      </p>
    `;
    return;
  }

  // Function to render Pokémon cards
  function renderPokemons(list) {
    container.innerHTML = ""; // Clear old cards

    list.forEach(pokemon => {
      if (pokemon.note === undefined) pokemon.note = "";

      const card = document.createElement("div");
      card.className =
        "bg-cyan-500 border-4 border-cyan-500 rounded-xl shadow-md text-black flex flex-col justify-between overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-400";

      card.innerHTML = `
        <div class="bg-green-200 flex justify-center p-4">
          <img src="${pokemon.image}" alt="${pokemon.name}" class="w-40 h-40">
        </div>
        <div class="px-4 py-2">
          <h3 class="text-lg font-bold text-center">${pokemon.name}</h3>
          <p class="text-center">#${pokemon.id}</p>
          <p class="text-center">Height: ${pokemon.height}</p>
          <p class="text-center">Types: ${pokemon.types}</p>
          <textarea class="note-field w-full mt-2 p-2 rounded-md text-black" placeholder="Add a note...">${pokemon.note}</textarea>
        </div>
        <div class="flex justify-between gap-2 p-2">
          <button class="save-btn w-1/2 bg-blue-400 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">💾 Save Note</button>
          <button class="remove-btn w-1/2 bg-red-400 hover:bg-red-700 text-white font-semibold py-2 rounded-lg">❌ Remove</button>
        </div>
      `;

      // Save note
      const noteField = card.querySelector(".note-field");
      const saveBtn = card.querySelector(".save-btn");
      saveBtn.addEventListener("click", () => {
        pokemon.note = noteField.value;
        localStorage.setItem("caughtPokemons", JSON.stringify(savedPokemons));
        saveBtn.textContent = "✅ Saved!";
        setTimeout(() => (saveBtn.textContent = "💾 Save Note"), 1500);
      });

      // Remove Pokémon
      const removeBtn = card.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => {
        savedPokemons = savedPokemons.filter(p => p.id.toString() !== pokemon.id.toString());
        localStorage.setItem("caughtPokemons", JSON.stringify(savedPokemons));
        card.remove();

        if (savedPokemons.length === 0) {
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
  }

  // Search by name or ID
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      renderPokemons(savedPokemons);
      return;
    }

    const filtered = savedPokemons.filter(
      p => p.name.toLowerCase().includes(query) || p.id.toString() === query
    );

    if (filtered.length > 0) {
      renderPokemons(filtered);
    } else {
      container.innerHTML = `
        <p class="text-center text-gray-400 col-span-full">
          ❌ No Pokémon found for "<span class='text-pink-400'>${query}</span>"
        </p>
      `;
    }
  });

  // Initial render
  renderPokemons(savedPokemons);
});
