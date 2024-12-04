const questions = [
    {
        id: 1,
        type: 'multiple',
        question: '5+5',
        options: ['10', '1010', 'X', 'akar 100'],
        answer: '10',
        score: 10
    },
    {
        id: 2,
        type: 'essay',
        question: 'Siapa Pacar IDOY?',
        answer: 'GEMA',
        score: 20
    },
    {
        id: 3,
        type: 'multiple',
        question: 'Bahasa apa yang tidak dipakai pada pembuatan web ini?',
        options: ['JavaScript', 'HTML', 'Python', 'CSS'],
        answer: 'Python',
        score: 10
    },
    {
        id: 4,
        type: 'multiple',
        question: 'Berapa jam kita kelas Praktikum Pemograman Web?',
        options: ['1 JAM', '2 JAM', '3 JAM', '4 JAM'],
        answer: '3 JAM',
        score: 10
    },
    {
        id: 5,
        type: 'essay',
        question: 'Apa nama Praktikum ini?',
        answer: 'Praktikum Pemograman Web',
        score: 20
    },
    {
        id: 6,
        type: 'multiple',
        question: 'Apa nama hewan yang menjadi simbol angkatan 22?',
        options: ['Gagak', 'Cobra', 'Buaya', 'Kucing', 'Merak'],
        answer: 'Gagak',
        score: 10
    },
    {
        id: 7,
        type: 'essay',
        question: 'Apakah ada makrab CS 22 di tahun depan?',
        answer: 'ada',
        score: 20
    }
];

let currentPage = 'home-page';
let userData = {
    name: '',
    id: ''
};
let currentQuestionIndex = 0;
let answers = {};
let totalScore = 0;
let timerInterval;
let timeLeft = 30;
let timerEnabled = true;

// Reference to page elements
const pages = {
    home: document.getElementById('home-page'),
    userData: document.getElementById('user-data-page'),
    quiz: document.getElementById('quiz-page'),
    results: document.getElementById('results-page')
};

// Reference to buttons and other elements
const startBtn = document.getElementById('start-btn');
const userForm = document.getElementById('user-form');
const questionContainer = document.getElementById('question-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer');
const timerToggle = document.getElementById('timer-toggle');
const answeredSpan = document.getElementById('answered');
const totalSpan = document.getElementById('total');
const resultName = document.getElementById('result-name');
const resultId = document.getElementById('result-nim');
const totalScoreSpan = document.getElementById('total-score');
const maxScoreSpan = document.getElementById('max-score');
const restartBtn = document.getElementById('restart-btn');

// Initialize total questions count
if (totalSpan) {
    totalSpan.textContent = questions.length;
}

// Event Listeners

// Start button to navigate to User Data Page
if (startBtn) {
    startBtn.addEventListener('click', () => {
        showPage('userData');
    });
}

// Handle form submission (Optional: If you decide to handle form via JS instead of direct POST)
// Uncomment if you switch to JS-based form handling
/*
if (userForm) {
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userData.name = document.getElementById('username').value.trim();
        userData.id = document.getElementById('usernim').value.trim();

        if (userData.name === '' || userData.id === '') {
            alert('Please enter both Name and User ID.');
            return;
        }

        showPage('quiz');
        renderQuestion();
        updateProgress();
        updateNavigationButtons();
        startTimer();
    });
}
*/

// Previous button to navigate to the previous question
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        saveAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
            updateNavigationButtons();
            resetTimer();
        }
    });
}

// Next button to navigate to the next question or submit the quiz
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        saveAnswer();
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
            updateNavigationButtons();
            resetTimer();
        } else {
            calculateScore();
            showResults();
        }
    });
}

// Timer toggle to enable/disable the timer
if (timerToggle) {
    timerToggle.addEventListener('change', (e) => {
        timerEnabled = e.target.checked;
        if (timerEnabled) {
            startTimer();
        } else {
            clearInterval(timerInterval);
            if (timerDisplay) {
                timerDisplay.textContent = 'Off';
            }
        }
    });
}

// Restart button to reset the quiz
if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        userData = { name: '', id: '' };
        currentQuestionIndex = 0;
        answers = {};
        totalScore = 0;
        timerEnabled = true;
        timeLeft = 30;
        if (timerToggle) {
            timerToggle.checked = true;
        }
        // Reset any forms if present
        if (userForm) {
            userForm.reset();
        }
        showPage('home');
    });
}

// Functions

/**
 * Show the specified page and hide others
 * @param {string} page - The key of the page to show ('home', 'userData', 'quiz', 'results')
 */
function showPage(page) {
    for (let key in pages) {
        if (pages[key]) { // Only if the page exists
            if (key === page) {
                pages[key].classList.add('active');
            } else {
                pages[key].classList.remove('active');
            }
        }
    }
}

/**
 * Render the current question based on currentQuestionIndex
 */
function renderQuestion() {
    if (!questionContainer) return;
    const question = questions[currentQuestionIndex];
    let html = `<div class="question"><h3>Question ${currentQuestionIndex + 1}</h3><br><p>${question.question}</p><br></div>`;

    if (question.type === 'multiple') {
        html += '<ul class="options">';
        question.options.forEach(option => {
            const checked = answers[question.id] === option ? 'checked' : '';
            html += `
                <li>
                    <label>
                        <input type="radio" name="option" value="${option}" ${checked}>
                        ${option}
                    </label>
                </li>
            `;
        });
        html += '</ul>';
    } else if (question.type === 'essay') {
        const answerText = answers[question.id] ? answers[question.id] : '';
        html += `
            <textarea id="essay-answer" rows="5" placeholder="Masukkan Jawaban anda">${answerText}</textarea>
        `;
    }

    html += `<div class="question-score">Score: <strong>${question.score} pts</strong></div>`;

    questionContainer.innerHTML = html;
}

/**
 * Save the user's answer for the current question
 */
function saveAnswer() {
    const question = questions[currentQuestionIndex];
    if (question.type === 'multiple') {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            answers[question.id] = selectedOption.value;
        } else {
            delete answers[question.id];
        }
    } else if (question.type === 'essay') {
        const essayAnswer = document.getElementById('essay-answer').value.trim();
        if (essayAnswer) {
            answers[question.id] = essayAnswer;
        } else {
            delete answers[question.id];
        }
    }
    updateProgress();
}

/**
 * Update the state of navigation buttons based on the current question index
 */
function updateNavigationButtons() {
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    if (nextBtn) {
        nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next';
    }
}

/**
 * Update the progress display (number of answered questions)
 */
function updateProgress() {
    if (answeredSpan) {
        let answered = Object.keys(answers).length;
        answeredSpan.textContent = answered;
    }
}

/**
 * Calculate the total score based on the user's answers
 */
function calculateScore() {
    totalScore = 0;
    questions.forEach(q => {
        if (q.type === 'multiple') {
            if (answers[q.id] === q.answer) {
                totalScore += q.score;
            }
        } else if (q.type === 'essay') {
            // For essay questions, perform a case-insensitive comparison
            if (answers[q.id] && answers[q.id].toLowerCase() === q.answer.toLowerCase()) {
                totalScore += q.score;
            }
        }
    });
}

/**
 * Display the results page with the user's score and information
 */
function showResults() {
    if (resultName && resultId && totalScoreSpan && maxScoreSpan) {
        resultName.textContent = userData.name;
        resultId.textContent = userData.id;
        totalScoreSpan.textContent = totalScore;
        maxScoreSpan.textContent = questions.reduce((acc, q) => acc + q.score, 0);
    }
    showPage('results');
}

/**
 * Start the countdown timer
 */
function startTimer() {
    if (!timerEnabled || !timerDisplay) return;
    clearInterval(timerInterval);
    timeLeft = 30;
    timerDisplay.textContent = `Auto Next in ${timeLeft}s`;
    timerInterval = setInterval(() => {
        if (!timerEnabled) {
            clearInterval(timerInterval);
            return;
        }
        timeLeft--;
        timerDisplay.textContent = `Auto Next in ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            saveAnswer();
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
                updateNavigationButtons();
                startTimer();
            } else {
                calculateScore();
                showResults();
            }
        }
    }, 1000);
}

/**
 * Reset the timer when navigating between questions
 */
function resetTimer() {
    if (timerEnabled) {
        clearInterval(timerInterval);
        startTimer();
    }
}

// Initialization: Check if userData is present and set the current page accordingly
(function initializeQuiz() {
    // Check if userData is attached to the window object
    if (typeof window.userData !== 'undefined' && window.userData.name && window.userData.id) {
        userData.name = window.userData.name;
        userData.id = window.userData.id;
        currentPage = 'quiz';
    }

    // Wait for the DOM to load before rendering
    document.addEventListener('DOMContentLoaded', () => {
        if (currentPage === 'quiz') {
            showPage('quiz');
            renderQuestion();
            updateProgress();
            updateNavigationButtons();
            startTimer();
        } else if (currentPage === 'home-page') {
            showPage('home');
        }
    });
})();
