document.addEventListener('DOMContentLoaded', async () => {
    const habitsContainer = document.getElementById('habits-container');
    const addHabitForm = document.getElementById('add-habit-form');
    const habitLibraryContainer = document.getElementById('habit-library-container');
    const progressContainer = document.getElementById('progress-container');

    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    // Save habits to localStorage
    const saveHabits = () => {
        localStorage.setItem('habits', JSON.stringify(habits));
    };

    // Helper function to get week number
    const getWeekNumber = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    // Render habits on dashboard
    const renderHabits = () => {
        if (!habitsContainer) return;
        
        habitsContainer.innerHTML = '';

        if (habits.length === 0) {
            habitsContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No habits yet!</h3>
                    <p>Add a habit above or browse the Habit Library for inspiration.</p>
                </div>
            `;
            return;
        }

        habits.forEach((habit, index) => {
            const habitCard = document.createElement('div');
            habitCard.className = `habit-card ${habit.completed ? 'completed' : ''}`;
            habitCard.innerHTML = `
                <div class="habit-info">
                    <h3>${habit.name}</h3>
                    <p>Streak: ${habit.streak || 0} ${habit.frequency === 'daily' ? 'days' : 'weeks'} | ${habit.frequency}</p>
                </div>
                <div class="habit-actions">
                    <button class="complete-btn" data-index="${index}" title="Mark as complete" aria-label="Mark ${habit.name} as complete">✔️</button>
                    <button class="delete-btn" data-index="${index}" title="Delete habit" aria-label="Delete ${habit.name}">❌</button>
                </div>
            `;
            habitsContainer.appendChild(habitCard);
        });
    };

    // Render habit library
    const renderHabitLibrary = async () => {
        if (!habitLibraryContainer) return;
        
        try {
            const response = await fetch('data/data.json');
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
                    <button class="add-from-library-btn" data-name="${suggestion.name}" data-frequency="${suggestion.frequency}" title="Add to dashboard" aria-label="Add ${suggestion.name} to dashboard">+</button>
                `;
                habitLibraryContainer.appendChild(suggestionCard);
            });
        } catch (error) {
            console.error('Error fetching habit suggestions:', error);
            habitLibraryContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Could not load habit suggestions</h3>
                    <p>Please check that the data file is in the correct location.</p>
                </div>
            `;
        }
    };

    // Render progress page
    const renderProgress = () => {
        if (!progressContainer) return;
        
        // Reset completion status based on frequency
        const today = new Date().toDateString();
        const thisWeek = getWeekNumber(new Date());
        
        habits.forEach(habit => {
            if (habit.frequency === 'daily' && habit.lastCompleted !== today) {
                habit.completed = false;
            } else if (habit.frequency === 'weekly' && habit.lastCompletedWeek !== thisWeek) {
                habit.completed = false;
            }
        });
        saveHabits();

        if (habits.length === 0) {
            progressContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No habits to track yet!</h3>
                    <p>Start adding habits to see your progress here.</p>
                </div>
            `;
            return;
        }
        
        const completedHabits = habits.filter(habit => habit.completed).length;
        const totalHabits = habits.length;
        const completionRate = totalHabits > 0 ? ((completedHabits / totalHabits) * 100).toFixed(0) : 0;
        const longestStreak = Math.max(0, ...habits.map(h => h.streak || 0));

        progressContainer.innerHTML = `
            <div class="progress-stat">
                <h3>Completion Rate</h3>
                <p>${completionRate}%</p>
            </div>
            <div class="progress-stat">
                <h3>Completed Today</h3>
                <p>${completedHabits} / ${totalHabits}</p>
            </div>
            <div class="progress-stat">
                <h3>Longest Streak</h3>
                <p>${longestStreak}</p>
            </div>
        `;
    };

    // Add habit form submission
    if (addHabitForm) {
        addHabitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const habitName = document.getElementById('habit-name').value.trim();
            const habitFrequency = document.getElementById('habit-frequency').value;
            
            // Check for duplicates
            if (habits.some(h => h.name.toLowerCase() === habitName.toLowerCase())) {
                alert('This habit already exists!');
                return;
            }
            
            habits.push({ 
                name: habitName, 
                frequency: habitFrequency, 
                completed: false, 
                streak: 0, 
                lastCompleted: null,
                lastCompletedWeek: null
            });
            saveHabits();
            renderHabits();
            addHabitForm.reset();
        });
    }

    // Dashboard habit actions (complete/delete)
    if (habitsContainer) {
        habitsContainer.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            
            if (e.target.classList.contains('complete-btn')) {
                const habit = habits[index];
                const today = new Date().toDateString();
                const thisWeek = getWeekNumber(new Date());
                
                if (habit.frequency === 'daily') {
                    // Allow completing only if it's not already completed today
                    if (habit.lastCompleted !== today) {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);

                        // Check if the last completion was yesterday to continue the streak
                        if (habit.lastCompleted === yesterday.toDateString()) {
                            habit.streak = (habit.streak || 0) + 1;
                        } else {
                            // If not, reset streak to 1
                            habit.streak = 1;
                        }
                        habit.completed = true;
                        habit.lastCompleted = today;
                    }
                } else if (habit.frequency === 'weekly') {
                    // Allow completing only if it's not already completed this week
                    if (habit.lastCompletedWeek !== thisWeek) {
                        const lastWeek = thisWeek - 1;

                        // Check if the last completion was last week to continue the streak
                        if (habit.lastCompletedWeek === lastWeek) {
                            habit.streak = (habit.streak || 0) + 1;
                        } else {
                            // If not, reset streak to 1
                            habit.streak = 1;
                        }
                        habit.completed = true;
                        habit.lastCompletedWeek = thisWeek;
                    }
                }
            }
            
            if (e.target.classList.contains('delete-btn')) {
                if (confirm('Are you sure you want to delete this habit?')) {
                    habits.splice(index, 1);
                }
            }
            
            saveHabits();
            renderHabits();
        });
    }
    
    // Library add button
    if (habitLibraryContainer) {
        habitLibraryContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-from-library-btn')) {
                const { name, frequency } = e.target.dataset;
                
                // Check if the habit already exists
                if (habits.some(habit => habit.name === name)) {
                    alert(`"${name}" is already on your dashboard.`);
                } else {
                    habits.push({ 
                        name, 
                        frequency, 
                        completed: false, 
                        streak: 0, 
                        lastCompleted: null,
                        lastCompletedWeek: null
                    });
                    saveHabits();
                    alert(`"${name}" has been added to your dashboard!`);
                }
            }
        });
    }

    // Update footer with current year and last modified date
    const updateFooter = () => {
        const currentYearSpan = document.getElementById('current-year');
        const lastModifiedSpan = document.getElementById('last-modified');

        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
        
        if (lastModifiedSpan) {
            lastModifiedSpan.textContent = document.lastModified;
        }
    };

    // Initial Render based on the current page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/final/') || window.location.pathname.endsWith('/')) {
        renderHabits();
    } else if (window.location.pathname.endsWith('library.html')) {
        await renderHabitLibrary();
    } else if (window.location.pathname.endsWith('progress.html')) {
        renderProgress();
    }

    // Update footer on all pages
    updateFooter();
});