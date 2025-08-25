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

  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("next-btn").style.display = "inline-block";

  // Disable buttons after answering
  let buttons = document.querySelectorAll(".buttons button");
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = "0.6"; // faded look to show they're inactive
  });
}

function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

function saveToLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: playerName, score: score });

  // ✅ Keep only top 10 scores
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Show button to view leaderboard
  let feedback = document.getElementById("feedback");
  feedback.innerHTML += `<br><br><a href="pages/leaderboard.html"><button>View Leaderboard</button></a>`;
}
