document.addEventListener('DOMContentLoaded', () => {
    const membersContainer = document.getElementById('members-container');
    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');

    // Function to fetch member data
    async function getMembers() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const members = await response.json();
            displayMembers(members);
        } catch (error) {
            console.error('Fetch error:', error);
            membersContainer.innerHTML = '<p>Sorry, member data could not be loaded.</p>';
        }
    }

    // Function to display members
    function displayMembers(members) {
        membersContainer.innerHTML = ''; // Clear existing content
        members.forEach(member => {
            const memberSection = document.createElement('section');
            
            memberSection.innerHTML = `
                <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
            `;
            
            membersContainer.appendChild(memberSection);
        });
    }

    // Event listeners for view toggle
    gridBtn.addEventListener('click', () => {
        membersContainer.classList.add('grid');
        membersContainer.classList.remove('list');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });

    listBtn.addEventListener('click', () => {
        membersContainer.classList.add('list');
        membersContainer.classList.remove('grid');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });

    // Footer Info
    const currentYearSpan = document.getElementById('current-year');
    const lastModifiedSpan = document.getElementById('last-modified');
    
    currentYearSpan.textContent = new Date().getFullYear();
    lastModifiedSpan.textContent = document.lastModified;

    // Initial fetch
    getMembers();
});