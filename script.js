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
        options: ['Javascipt', 'HTML', 'Python', 'CSS'],
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
        question: 'Apa nama hewan yang menjad simbol angkatan 22?',
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

const pages = {
    home: document.getElementById('home-page'),
    userData: document.getElementById('user-data-page'),
    quiz: document.getElementById('quiz-page'),
    results: document.getElementById('results-page')
};

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

document.getElementById('total').textContent = questions.length;

startBtn.addEventListener('click', () => {
    showPage('userData');
});

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

prevBtn.addEventListener('click', () => {
    saveAnswer(); 
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        updateNavigationButtons();
        resetTimer();
    }
});

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

timerToggle.addEventListener('change', (e) => {
    timerEnabled = e.target.checked;
    if (timerEnabled) {
        startTimer();
    } else {
        clearInterval(timerInterval);
        timerDisplay.textContent = 'Off';
    }
});

restartBtn.addEventListener('click', () => {
    userData = { name: '', id: '' };
    currentQuestionIndex = 0;
    answers = {};
    totalScore = 0;
    timerEnabled = true;
    timeLeft = 30;
    timerToggle.checked = true;
    document.getElementById('user-form').reset();
    showPage('home');
});

function showPage(page) {
    for (let key in pages) {
        if (key === page) {
            pages[key].classList.add('active');
        } else {
            pages[key].classList.remove('active');
        }
    }
}

function renderQuestion() {
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

function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next';
}

function updateProgress() {
    let answered = Object.keys(answers).length;
    answeredSpan.textContent = answered;
}

function calculateScore() {
    totalScore = 0;
    questions.forEach(q => {
        if (q.type === 'multiple') {
            if (answers[q.id] === q.answer) {
                totalScore += q.score;
            }
        } else if (q.type === 'essay') {
            if (answers[q.id] === q.answer) {
                totalScore += q.score;
            }
        }
    });
}

function showResults() {
    resultName.textContent = userData.name;
    resultId.textContent = userData.id;
    totalScoreSpan.textContent = totalScore;
    maxScoreSpan.textContent = questions.reduce((acc, q) => acc + q.score, 0);
    showPage('results');
}

function startTimer() {
    if (!timerEnabled) return;
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

function resetTimer() {
    if (timerEnabled) {
        clearInterval(timerInterval);
        startTimer();
    }
}
