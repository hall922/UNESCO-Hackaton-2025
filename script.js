let questions = [];
let currentQuestion = 0;
let score = 0;
let playerName = "";

// Ask for player name
window.onload = () => {
  playerName = prompt("Enter your name:") || "Player";
};

// Load questions
fetch("data/questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  document.getElementById("feedback").innerText = "";
  document.getElementById("next-btn").style.display = "none";
  
  if (currentQuestion < questions.length) {
    document.getElementById("question").innerText = questions[currentQuestion].question;
  } else {
    document.getElementById("question").innerText = "🎉 Quiz Finished!";
    document.getElementById("feedback").innerText = `Your final score is ${score}`;
    document.querySelector(".buttons").style.display = "none";

    saveToLeaderboard();
  }
}

function checkAnswer(answer) {
  let correct = questions[currentQuestion].answer;
  let feedback = document.getElementById("feedback");

  if (answer === correct) {
    score++;
    feedback.innerText = "✅ Correct! " + questions[currentQuestion].explanation;
    feedback.style.color = "green";
  } else {
    feedback.innerText = "❌ Wrong! " + questions[currentQuestion].explanation;
    feedback.style.color = "red";
  }

  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("next-btn").style.display = "inline-block";
}

function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

function saveToLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: playerName, score: score });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Show button to view leaderboard
  let feedback = document.getElementById("feedback");
  feedback.innerHTML += `<br><br><a href="pages/leaderboard.html"><button>View Leaderboard</button></a>`;
}
