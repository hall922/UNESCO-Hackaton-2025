// ===== Global Variables =====
let questions = [];
let currentQuestion = 0;
let score = 0;

// ===== Load Questions =====
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
    })
    .catch(err => console.error("Error loading questions:", err));

// ===== Start Quiz =====
function startQuiz() {
    document.getElementById('start-btn').style.display = "none"; // hide start button
    document.getElementById('quiz-container').style.display = "block"; // show quiz
    showQuestion();
}

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
    document.getElementById('mascot').innerHTML = ''; // clear mascot
}

// ===== Check Answer =====
function checkAnswer(selected) {
    const q = questions[currentQuestion];
    const feedback = document.getElementById('feedback');
    const mascotDiv = document.getElementById('mascot');

    if (selected === q.answer) {
        feedback.textContent = 'Correct! ✅';
        feedback.className = 'feedback correct';
        score++;
        mascotDiv.innerHTML = `<img src="assets/mascot-happy.png" alt="Happy Mascot" class="mascot-img">`;
    } else {
        feedback.textContent = `Wrong! ❌ Correct: ${q.answer}`;
        feedback.className = 'feedback wrong';
        mascotDiv.innerHTML = `<img src="assets/mascot-sad.png" alt="Sad Mascot" class="mascot-img">`;
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
