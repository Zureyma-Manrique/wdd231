document.addEventListener('DOMContentLoaded', () => {
    // Weather Section
    const weatherContainer = document.getElementById('weather-container');
    const apiKey = 'aa7514efc2e7509549977c3fdfbadcc5';
    const city = 'Timbuktu';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    async function getWeather() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            console.error('Fetch error:', error);
            weatherContainer.innerHTML = '<p>Could not load weather data.</p>';
        }
    }

    function displayWeather(data) {
        const today = data.list[0];
        const forecast = data.list.filter((item, index) => index % 8 === 0).slice(1, 4); // Next 3 days

        let weatherHtml = `
            <p><strong>Current Temperature:</strong> ${today.main.temp.toFixed(1)}&deg;C</p>
            <p><strong>Description:</strong> ${today.weather[0].description}</p>
            <h3>3-Day Forecast</h3>
        `;

        forecast.forEach(day => {
            const date = new Date(day.dt_txt);
            weatherHtml += `<p><strong>${date.toLocaleDateString('en-US', { weekday: 'long' })}:</strong> ${day.main.temp.toFixed(1)}&deg;C</p>`;
        });

        weatherContainer.innerHTML = weatherHtml;
    }

    // Company Spotlights
    const spotlightsContainer = document.getElementById('spotlights-container');

    async function getMembers() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const members = await response.json();
            displaySpotlights(members);
        } catch (error) {
            console.error('Fetch error:', error);
            spotlightsContainer.innerHTML = '<p>Sorry, member data could not be loaded.</p>';
        }
    }

    function displaySpotlights(members) {
        const eligibleMembers = members.filter(member => member.membershipLevel === 'Gold' || member.membershipLevel === 'Silver');
        const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3); // Get 2-3 spotlights

        let spotlightsHtml = '';
        selected.forEach(member => {
            spotlightsHtml += `
                <div class="spotlight-card">
                    <h3>${member.name}</h3>
                    <img src="${member.image}" alt="${member.name} Logo">
                    <p>${member.phone}</p>
                    <p>${member.address}</p>
                    <a href="${member.website}" target="_blank">Visit Website</a>
                    <p><strong>Membership:</strong> ${member.membershipLevel}</p>
                </div>
            `;
        });
        spotlightsContainer.innerHTML = spotlightsHtml;
    }


    // Footer Info
    const currentYearSpan = document.getElementById('current-year');
    const lastModifiedSpan = document.getElementById('last-modified');

    currentYearSpan.textContent = new Date().getFullYear();
    lastModifiedSpan.textContent = document.lastModified;

    // Initial fetch calls
    getWeather();
    getMembers();
});