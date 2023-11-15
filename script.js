// fetch first 20 pokemon
async function fetchPokemonData() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20'); // api request
    const data = await response.json(); // parse as JSON
    return data.results; // return list of pokemon
}

// display pokemon data in html
async function displayPokemon() {
    const pokedex = document.querySelector('.pokedex'); // get container for pokemon gallery
    const pokemonData = await fetchPokemonData(); // fetch pokemon data
    
    pokemonData.forEach((pokemon, index) => {
        const pokemonCard = document.createElement('div'); // create a card for each pokemon
        pokemonCard.classList.add('pokemon-card'); // css class for styling the card
        
        // pokemon number
        const pokemonNumber = '#' + String(index + 1).padStart(4, '0');

        // pokemon card html
        pokemonCard.innerHTML = `
            <div class="pokemon-details-top">
                <!--name-->
                <p class="pokemon-name">${pokemon.name}</p> 
                <!-- Number -->
                <p class="pokemon-number">${pokemonNumber}</p>
            </div>
            <div class="pokemon-details-bottom">
                <!--checkbox for marking caught pokemon-->
                <label for="${pokemonNumber}" class="checkbox-label">
                    <input type="checkbox" id="${pokemonNumber}" class="default-checkbox">
                    <span class="checkbox-custom"></span>
                </label>

                <!--thumbnail-->
                <div class="pokemon-img">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png" alt="${pokemon.name}"/>
                </div>
            </div>
        `;
        pokedex.appendChild(pokemonCard); // add card to pokedex container
    });
}

// function to get pokemon id from url
function getPokemonId(url) {
    const parts = url.split('/'); // splits the url by the slashes, making an array
    return parts[parts.length - 2]; // the id is the second-to-last part of the url
}

// event listener to call the displayPokemon function when the page loads
window.addEventListener('load', displayPokemon);

// pokemon details overlay
function openPokemonDetails(pokemon) {
    const overlay = document.getElementById('pokemonDetails'); // stores overlay div
    const overlayHeader = document.getElementById('pokemonName'); //stores overlay h2, name of pokemon
    
    //updates pokemon name
    overlayHeader.innerText = pokemon.name;

    //shows the overlay
    overlay.style.display = 'block';

    //close overlay button
    const closeOverlay = document.getElementById('closeOverlay');
    closeOverlay.addEventListener('click', (event) => {
        overlay.style.display = 'none';
    });
}

async function fetchPokemonDetails(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();
    return data;
}

 // pokemon card clicks
 document.addEventListener('click', async (event) => {
    const pokemonCard = event.target.closest('.pokemon-card');
    
    //check for checkbox click to not open the overlay

    if (event.target.classList.contains('default-checkbox', 'checkbox-custom')) {
        return;
    }

    if (pokemonCard) {
        const pokemonName = pokemonCard.querySelector('.pokemon-name').innerText;
        const pokemonDetails = await fetchPokemonDetails(pokemonName);

        openPokemonDetails(pokemonDetails);
    }
 });