let currentNumberPokemon = 20;

// fetch first 20 pokemon
async function fetchPokemonData(numberPokemon) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=' + numberPokemon); // api request
    const data = await response.json(); // parse as JSON
    return data.results; // return list of pokemon
}

// display pokemon data in html
async function displayPokemon(numberPokemon) {
    const pokedex = document.querySelector('.pokedex');
    const pokemonData = await fetchPokemonData(numberPokemon);

    pokemonData.forEach((pokemon, index) => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        
        const pokemonNumber = '#' + String(index + 1).padStart(4, '0');
        pokemonCard.id = "pokemon-" + index;

        pokemonCard.innerHTML = `
            <div class="pokemon-details-top">
                <p class="pokemon-name">${pokemon.name}</p> 
                <p class="pokemon-number">${pokemonNumber}</p>
            </div>
            <div class="pokemon-details-bottom">
                <label for="checkbox-${pokemonNumber}" class="checkbox-label">
                    <input type="checkbox" id="checkbox-${pokemonNumber}" class="default-checkbox">
                    <span class="checkbox-custom"></span>
                </label>
                <input type='hidden' value='${pokemon.url}' id='pokemonUrl-${index}'/>
                <div class="pokemon-img">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png" alt="${pokemon.name}"/>
                </div>
            </div>
        `;
        pokedex.appendChild(pokemonCard);

        const checkboxId = 'checkbox-' + pokemonNumber;
        const checkbox = document.getElementById(checkboxId);
        const checkboxStatus = localStorage.getItem(checkboxId);
        checkbox.checked = checkboxStatus === "true";
    });
}


// function to get pokemon id from url
function getPokemonId(url) {
    const parts = url.split('/'); // splits the url by the slashes, making an array
    return parts[parts.length - 2]; // the id is the second-to-last part of the url
    
}



// event listener to call the displayPokemon function when the page loads
window.addEventListener('load', function(){
    displayPokemon(currentNumberPokemon);
});

// pokemon details overlay
function openPokemonDetails(pokemon, pokemonIndex) {
    const overlay = document.getElementById('pokemonDetails'); // stores overlay div
    const officialArtwork = document.getElementById('officialArtwork'); //stores artwork div
    const overlayHeader = document.getElementById('pokemonName'); //stores overlay h2, name of pokemon
    const pokemonUrl = document.getElementById('pokemonUrl-' + pokemonIndex).value;
    pokemonIndex = parseInt(pokemonIndex);
    const pokemonNumber = '#' + String(pokemonIndex + 1).padStart(4, '0');
    const pokemonNumberText = document.getElementById('pokemonNumber');
    const pokemonTypeContainer = document.getElementById('pokemonTypeContainer');
    const pokemonAbilities = document.getElementById('pokemonAbilities');
    const checkbox = document.getElementById('checkbox-' + pokemonNumber);
    const overlayCheckbox = document.getElementById('overlay-checkbox');
    const overlayPokemonNumber = document.getElementById('overlayPokemonNumber');

    overlayPokemonNumber.value = pokemonNumber;

    // updates overlay checkbox
    overlayCheckbox.checked = checkbox.checked;

    //updates artwork
    officialArtwork.innerHTML = `<img id="officialArtworkImg" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonId(pokemonUrl)}.png" alt="${pokemon.name}"/>`
    
    //updates pokemon number
    pokemonNumberText.innerText = pokemonNumber;

    //updates pokemon name
    overlayHeader.innerText = pokemon.name;

    //updates pokemon types
    pokemonTypeContainer.innerHTML = ''; //deletes previous
    pokemon.types.forEach(type => {
        const addType = document.createElement('div');
        addType.classList.add('pokemonType', type.type.name);
        addType.innerText = (type.type.name);
        pokemonTypeContainer.appendChild(addType);
    })

    // removes previous abilities
    pokemonAbilities.innerHTML = '';
    // updates pokemon abilities
    pokemon.abilities.forEach((ability, index) => {
        const addAbility = document.createElement ('p');
        addAbility.classList.add('abilityName');
        addAbility.innerText = ability.ability.name;
        pokemonAbilities.appendChild(addAbility);

        //comma after ability except last one
        if (index < pokemon.abilities.length - 1) {
            addAbility.innerText += ',';
        }
    })

    // pokemon stats
    updateStatBar('hpBar', pokemon.stats[0].base_stat);
    updateStatBar('atkBar', pokemon.stats[1].base_stat);
    updateStatBar('defBar', pokemon.stats[2].base_stat);
    updateStatBar('spAtkBar', pokemon.stats[3].base_stat);
    updateStatBar('spDefBar', pokemon.stats[4].base_stat);
    updateStatBar('speedBar', pokemon.stats[5].base_stat);

    // update width of stat bar
    function updateStatBar(barId, statNumber) {
        const statBar = document.getElementById(barId);
        const statBarNumber = statBar.querySelector('.stat-bar-number');
        const maxWidth = 100;
        const width = (statNumber / 150) * maxWidth;
        statBar.style.width = `${width}%`;
        statBarNumber.innerText = statNumber;
    }

    //shows the overlay
    overlay.style.display = 'block';

    //close overlay button
    const closeOverlay = document.getElementById('closeOverlay');
    closeOverlay.addEventListener('click', (event) => {
        overlay.style.display = 'none';
    });
}

function storeCatchedPokemon(pokemonCheckboxId, pokemonCheckboxStatus) {
    localStorage.setItem(pokemonCheckboxId, pokemonCheckboxStatus);
}

document.addEventListener('change', (event) => {
    const targetElement = event.target;
    const classNames = "" + targetElement.className;
    const id = "" + targetElement.id;

    if (id === 'overlay-checkbox') {

        const pokemonNumber = document.getElementById('overlayPokemonNumber').value;
        const checkbox = document.getElementById('checkbox-' + pokemonNumber);
        
        checkbox.checked = targetElement.checked;
       storeCatchedPokemon(checkbox.id, checkbox.checked);
                        
    } else if (classNames.includes('default-checkbox')) {

        storeCatchedPokemon(id, targetElement.checked);
    }
})

async function fetchPokemonDetails(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();
    return data;
}

 // pokemon card clicks
 document.addEventListener('click', async (event) => {
    const targetElement = event.target;
    const classNames = "" + targetElement.className;
    const id = "" + targetElement.id;

    if (classNames.includes("pokemon-card")) {
        const pokemonCard = targetElement;
        const pokemonIndex = id.split('-')[1];

        // check for checkbox click to not open the overlay
        if (event.target.classList.contains('default-checkbox', 'checkbox-custom')) {
            return;
        }

        if (pokemonCard) {
            const pokemonName = pokemonCard.querySelector('.pokemon-name').innerText;
            const pokemonDetails = await fetchPokemonDetails(pokemonName);
            console.log(pokemonDetails);
            openPokemonDetails(pokemonDetails, pokemonIndex);
        
    }
}
});


