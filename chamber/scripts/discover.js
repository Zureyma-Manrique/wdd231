document.addEventListener('DOMContentLoaded', () => {
    const discoverContainer = document.getElementById('discover-container');
    const visitorMessage = document.getElementById('visitor-message');

    function displayVisitorMessage() {
        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now();

        if (!lastVisit) {
            // First visit
            visitorMessage.textContent = 'Welcome! Let us know if you have any questions.';
        } else {
            // Calculate days since last visit
            const diff = now - lastVisit;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (days < 1) {
                // Less than a day
                visitorMessage.textContent = 'Back so soon! Awesome!';
            } else if (days === 1) {
                // Exactly 1 day (singular)
                visitorMessage.textContent = 'You last visited 1 day ago.';
            } else {
                // More than 1 day (plural)
                visitorMessage.textContent = `You last visited ${days} days ago.`;
            }
        }

        // Store current visit time
        localStorage.setItem('lastVisit', now);
    }

    async function getDiscoverItems() {
        try {
            const response = await fetch('data/discover.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const items = await response.json();
            displayItems(items);
        } catch (error) {
            console.error('Error fetching discover items:', error);
            discoverContainer.innerHTML = '<p class="error-message">Sorry, we could not load the attractions at this time. Please try again later.</p>';
        }
    }

    function displayItems(items) {
        discoverContainer.innerHTML = ''; // Clear loading message

        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('discover-card');

            itemCard.innerHTML = `
                <figure>
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         loading="lazy" 
                         width="300" 
                         height="200">
                </figure>
                <h2>${item.name}</h2>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button aria-label="Learn more about ${item.name}">Learn More</button>
            `;

            discoverContainer.appendChild(itemCard);
        });
    }
    function updateFooter() {
        const currentYearSpan = document.getElementById('current-year');
        const lastModifiedSpan = document.getElementById('last-modified');

        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
        
        if (lastModifiedSpan) {
            lastModifiedSpan.textContent = document.lastModified;
        }
    }


    displayVisitorMessage();
    getDiscoverItems();
    updateFooter();
});