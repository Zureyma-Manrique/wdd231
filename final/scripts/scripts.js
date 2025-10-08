document.addEventListener('DOMContentLoaded', async () => {
    const habitsContainer = document.getElementById('habits-container');
    const addHabitForm = document.getElementById('add-habit-form');
    const habitLibraryContainer = document.getElementById('habit-library-container');
    const progressContainer = document.getElementById('progress-container');

    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    const saveHabits = () => {
        localStorage.setItem('habits', JSON.stringify(habits));
    };

    const renderHabits = () => {
        if (!habitsContainer) return;
        habitsContainer.innerHTML = '';
        habits.forEach((habit, index) => {
            const habitCard = document.createElement('div');
            habitCard.className = `habit-card ${habit.completed ? 'completed' : ''}`;
            habitCard.innerHTML = `
                <div class="habit-info">
                    <h3>${habit.name}</h3>
                    <p>Streak: ${habit.streak || 0} days</p>
                </div>
                <div class="habit-actions">
                    <button class="complete-btn" data-index="${index}">✔️</button>
                    <button class="delete-btn" data-index="${index}">❌</button>
                </div>
            `;
            habitsContainer.appendChild(habitCard);
        });
    };

    const renderHabitLibrary = async () => {
        if (!habitLibraryContainer) return;
        
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const habitSuggestions = await response.json();
            
            habitLibraryContainer.innerHTML = '';
            habitSuggestions.forEach(suggestion => {
                const suggestionCard = document.createElement('div');
                suggestionCard.className = 'habit-card';
                suggestionCard.innerHTML = `
                    <div class="habit-info">
                        <h3>${suggestion.name}</h3>
                        <p>Frequency: ${suggestion.frequency}</p>
                    </div>
                    <button class="add-from-library-btn" data-name="${suggestion.name}" data-frequency="${suggestion.frequency}">+</button>
                `;
                habitLibraryContainer.appendChild(suggestionCard);
            });
        } catch (error) {
            console.error('Error fetching habit suggestions:', error);
            habitLibraryContainer.innerHTML = '<p>Could not load habit suggestions.</p>';
        }
    };

    const renderProgress = () => {
        if (!progressContainer) return;
        // Reset completion status for daily habits at the start of a new day
        const today = new Date().toDateString();
        habits.forEach(habit => {
            if (habit.frequency === 'daily' && habit.lastCompleted !== today) {
                habit.completed = false;
            }
        });
        saveHabits();
        
        const completedHabits = habits.filter(habit => habit.completed).length;
        const totalHabits = habits.length;
        const completionRate = totalHabits > 0 ? ((completedHabits / totalHabits) * 100).toFixed(2) : 0;
        const longestStreak = Math.max(0, ...habits.map(h => h.streak || 0));

        progressContainer.innerHTML = `
            <div class="progress-stat">
                <h3>Completion Rate</h3>
                <p>${completionRate}%</p>
            </div>
            <div class="progress-stat">
                <h3>Completed Habits (Today)</h3>
                <p>${completedHabits} / ${totalHabits}</p>
            </div>
             <div class="progress-stat">
                <h3>Longest Streak</h3>
                <p>${longestStreak} days</p>
            </div>
        `;
    };

    if (addHabitForm) {
        addHabitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const habitName = document.getElementById('habit-name').value;
            const habitFrequency = document.getElementById('habit-frequency').value;
            habits.push({ name: habitName, frequency: habitFrequency, completed: false, streak: 0, lastCompleted: null });
            saveHabits();
            renderHabits();
            addHabitForm.reset();
        });
    }

    if (habitsContainer) {
        habitsContainer.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (e.target.classList.contains('complete-btn')) {
                const today = new Date().toDateString();
                // Allow completing only if it's not already completed today
                if (habits[index].lastCompleted !== today) {
                    habits[index].completed = true;
                    
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    // Check if the last completion was yesterday to continue the streak
                    if (habits[index].lastCompleted === yesterday.toDateString()) {
                        habits[index].streak = (habits[index].streak || 0) + 1;
                    } else {
                        // If not, reset streak to 1
                        habits[index].streak = 1;
                    }
                    habits[index].lastCompleted = today;
                }
            }
            if (e.target.classList.contains('delete-btn')) {
                habits.splice(index, 1);
            }
            saveHabits();
            renderHabits();
        });
    }
    
    if (habitLibraryContainer) {
        habitLibraryContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-from-library-btn')) {
                const { name, frequency } = e.target.dataset;
                // Check if the habit already exists
                if (!habits.some(habit => habit.name === name)) {
                    habits.push({ name, frequency, completed: false, streak: 0, lastCompleted: null });
                    saveHabits();
                    alert(`"${name}" has been added to your dashboard!`);
                } else {
                    alert(`"${name}" is already on your dashboard.`);
                }
            }
        });
    }
    

    // Initial Render based on the current page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/wdd231/')) {
        renderHabits();
    } else if (window.location.pathname.endsWith('library.html')) {
        await renderHabitLibrary();
    } else if (window.location.pathname.endsWith('progress.html')) {
        renderProgress();
    }
});
