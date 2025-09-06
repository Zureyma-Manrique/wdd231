// --- Responsive Hamburger Menu ---
const menuButton = document.querySelector('#menu');
const navigation = document.querySelector('nav ul');

menuButton.addEventListener('click', () => {
    navigation.classList.toggle('open');
    menuButton.classList.toggle('open');
});


// --- Dynamic Footer Content ---
const currentYearSpan = document.querySelector('#currentyear');
const lastModifiedParagraph = document.querySelector('#lastModified');

// Set current year
const currentYear = new Date().getFullYear();
currentYearSpan.textContent = currentYear;

// Set last modified date
const lastModified = document.lastModified;
lastModifiedParagraph.textContent = `Last Modification: ${lastModified}`;


// --- Dynamic Course Cards ---
const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Intro to Programming',
    credits: 2,
    completed: true // ❗ Change to true if you have completed this course
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    completed: true // ❗ Change to true if you have completed this course
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    completed: false // ❗ Change to true if you have completed this course
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    completed: false // ❗ Change to true if you have completed this course
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    completed: false // ❗ Change to true if you have completed this course
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Web Frontend Development I',
    credits: 2,
    completed: false // ❗ Change to true if you have completed this course
  }
];

const courseContainer = document.querySelector('#course-container');
const totalCreditsSpan = document.querySelector('#total-credits');

function displayCourses(courseList) {
    courseContainer.innerHTML = ''; // Clear existing content

    courseList.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        if (course.completed) {
            courseCard.classList.add('completed');
        }
        
        courseCard.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p>${course.title}</p>
            <p>Credits: ${course.credits}</p>
        `;
        courseContainer.appendChild(courseCard);
    });

    updateTotalCredits(courseList);
}

function updateTotalCredits(courseList) {
    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsSpan.textContent = totalCredits;
}

// --- Filter Event Listeners ---
document.querySelector('#all').addEventListener('click', () => {
    displayCourses(courses);
});

document.querySelector('#cse').addEventListener('click', () => {
    const cseCourses = courses.filter(course => course.subject === 'CSE');
    displayCourses(cseCourses);
});

document.querySelector('#wdd').addEventListener('click', () => {
    const wddCourses = courses.filter(course => course.subject === 'WDD');
    displayCourses(wddCourses);
});

// Initial display of all courses on page load
displayCourses(courses);