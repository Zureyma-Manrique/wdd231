// 1. Declare constants for the URL and the main cards div
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json'; 
const cards = document.querySelector('#cards'); 

// 2. Create an async function to fetch the data
async function getProphetData() {
    const response = await fetch(url); 
    const data = await response.json(); 
    // Call the function to display the prophets, passing the 'prophets' array
    displayProphets(data.prophets); 
}

// 3. Define the function to display the prophets
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => { 
        // Create elements for the prophet card
        let card = document.createElement('section'); 
        let fullName = document.createElement('h2');
        let birthDate = document.createElement('p');
        let birthPlace = document.createElement('p');
        let portrait = document.createElement('img');

        // Populate the elements with data
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`; 
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`; 

        // Set attributes for the image
        portrait.setAttribute('src', prophet.imageurl); 
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`); 
        portrait.setAttribute('loading', 'lazy'); 
        portrait.setAttribute('width', '340'); 
        portrait.setAttribute('height', '440');

        // Append the elements to the card section
        card.appendChild(fullName); 
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(portrait); 

        // Append the card to the main cards div
        cards.appendChild(card); 
    });
}

// Call the function to start the process
getProphetData(); 