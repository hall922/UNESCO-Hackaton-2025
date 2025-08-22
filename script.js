// ===== Load Questions =====
let questions = [];
let currentQuestion = 0;
let score = 0;

// Fetch questions from JSON
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion();
    })
    .catch(err => console.error("Error loading questions:", err));

// ===== Show Question =====
function showQuestion() {
    if (currentQuestion >= questions.length) {
        showScore();
        return;
    }

    const q = questions[currentQuestion];
    document.getElementById('question').textContent = q.question;

    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = ''; // clear previous buttons

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(option));
        answersDiv.appendChild(btn);
    });

    document.getElementById('feedback').textContent = '';
}

// ===== Check Answer =====
function checkAnswer(selected) {
    const q = questions[currentQuestion];
    const feedback = document.getElementById('feedback');

    if (selected === q.answer) {
        feedback.textContent = 'Correct! ✅';
        feedback.className = 'feedback correct';
        score++;
    } else {
        feedback.textContent = `Wrong! ❌ Correct: ${q.answer}`;
        feedback.className = 'feedback wrong';
    }

    document.getElementById('score').textContent = `Score: ${score} / ${questions.length}`;

    currentQuestion++;
    setTimeout(showQuestion, 1500); // move to next question after 1.5s
}

// ===== Show Final Score =====
function showScore() {
    document.getElementById('quiz-container').innerHTML = `
        <h2>Your final score: ${score} / ${questions.length}</h2>
        <button onclick="saveScore()">Save Score & View Leaderboard</button>
    `;
}

// ===== Leaderboard =====
function saveScore() {
    let name = prompt("Enter your name for the leaderboard:") || "Anonymous";
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: name, score: score });
    leaderboard.sort((a, b) => b.score - a.score); // highest first
    leaderboard = leaderboard.slice(0, 5); // top 5 only
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    window.location.href = 'pages/leaderboard.html';
}

// ===== Display Leaderboard (in leaderboard.html) =====
function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';

    if (leaderboard.length === 0) {
        list.innerHTML = '<li>No scores yet!</li>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
        list.appendChild(li);
    });
}

// If this is leaderboard.html, display the leaderboard on load
if (document.getElementById('leaderboard-list')) {
    displayLeaderboard();
}
