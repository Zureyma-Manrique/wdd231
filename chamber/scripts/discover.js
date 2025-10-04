document.addEventListener('DOMContentLoaded', () => {
    const discoverContainer = document.getElementById('discover-container');
    const visitorMessage = document.getElementById('visitor-message');

    // Visitor Message
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();

    if (!lastVisit) {
        visitorMessage.textContent = 'Welcome! Let us know if you have any questions.';
    } else {
        const diff = now - lastVisit;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days < 1) {
            visitorMessage.textContent = 'Back so soon! Awesome!';
        } else {
            const dayText = days === 1 ? 'day' : 'days';
            visitorMessage.textContent = `You last visited ${days} ${dayText} ago.`;
        }
    }

    localStorage.setItem('lastVisit', now);


    // Fetch and display discover items
    async function getDiscoverItems() {
        try {
            const response = await fetch('data/discover.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const items = await response.json();
            displayItems(items);
        } catch (error) {
            console.error('Fetch error:', error);
            discoverContainer.innerHTML = '<p>Sorry, attractions data could not be loaded.</p>';
        }
    }

    function displayItems(items) {
        discoverContainer.innerHTML = ''; // Clear existing content
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('discover-card');

            itemCard.innerHTML = `
                <figure>
                    <img src="${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
                </figure>
                <h2>${item.name}</h2>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button>Learn More</button>
            `;

            discoverContainer.appendChild(itemCard);
        });
    }

    // Footer Info
    const currentYearSpan = document.getElementById('current-year');
    const lastModifiedSpan = document.getElementById('last-modified');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    getDiscoverItems();
});