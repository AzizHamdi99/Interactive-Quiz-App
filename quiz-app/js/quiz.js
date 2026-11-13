/* Quiz engine: questions come from PHP, answers are validated by PHP */
const TIME_LIMIT = 20;
const $ = (s) => document.querySelector(s);
const counter = $("#counter"),
  bar = $("#bar"),
  progress = $("#progress"),
  percent = $("#percent");
const questionEl = $("#question"),
  answersEl = $("#answers"),
  feedback = $("#feedback");
const prevBtn = $("#prev"),
  nextBtn = $("#next"),
  timerEl = $("#timer");
const live = $("#live");

let quiz = [],
  results = [], // per question: {picked, ok, correct_id, points} (from PHP)
  current = 0,
  timeLeft = TIME_LIMIT,
  timerId = null,
  advanceId = null,
  busy = false;

const totalPoints = () => results.reduce((s, r) => s + (r ? r.points : 0), 0);
const score = () => results.filter((r) => r && r.ok).length;

async function post(url, data) {
  const res = await fetch(url, { method: "POST", body: new URLSearchParams(data) });
  if (!res.ok) throw new Error("Server error");
  return res.json();
}

function setProgress() {
  const answered = results.filter((r) => r !== undefined).length;
  const pct = Math.round((answered / quiz.length) * 100);
  bar.style.width = pct + "%";
  percent.textContent = pct + "%";
  progress.setAttribute("aria-valuenow", pct);
  live.textContent = totalPoints();
}

function stopTimer() {
  clearInterval(timerId);
  timerEl.parentElement.classList.remove("low");
}
function runTimer() {
  stopTimer();
  timerEl.textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    timerEl.parentElement.classList.toggle("low", timeLeft <= 5);
    if (timeLeft <= 0) timeUp();
  }, 1000);
}
function startTimer() {
  timeLeft = TIME_LIMIT;
  runTimer();
}

async function timeUp() {
  stopTimer();
  if (busy || results[current] !== undefined) return;
  busy = true;
  const idx = current;
  try {
    const r = await post("php/check_answer.php", {
      question_id: quiz[idx].id,
      answer_id: 0,
      elapsed: TIME_LIMIT,
    });
    results[idx] = { ...r, picked: -1 };
  } catch (e) {
    busy = false;
    feedback.textContent = "Server error.";
    return;
  }
  busy = false;
  App.playWrong();
  if (idx === current) {
    reveal();
    setProgress();
    advanceId = setTimeout(goNext, 1500);
  }
}

function render() {
  clearTimeout(advanceId);
  const card = document.querySelector(".quiz-card");
  card.classList.remove("swap");
  void card.offsetWidth;
  card.classList.add("swap");
  counter.textContent = `Question ${current + 1} / ${quiz.length} · ${quiz[current].type === "tf" ? "True/False" : "MCQ"}`;
  questionEl.textContent = quiz[current].question;
  answersEl.replaceChildren();
  feedback.textContent = "";
  feedback.className = "feedback";
  quiz[current].answers.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer";
    btn.dataset.index = i;
    btn.innerHTML = `<span class="letter" aria-hidden="true">${"ABCD"[i]}</span><span class="text"></span><span class="icon" aria-hidden="true"></span>`;
    btn.querySelector(".text").textContent = a.text;
    btn.setAttribute("aria-label", `Answer ${"ABCD"[i]}: ${a.text}`);
    btn.addEventListener("click", () => choose(i));
    answersEl.appendChild(btn);
  });
  prevBtn.disabled = current === 0;
  nextBtn.textContent = current === quiz.length - 1 ? "Finish" : "Next";
  if (results[current] === undefined) {
    nextBtn.disabled = true;
    startTimer();
  } else {
    stopTimer();
    timerEl.textContent = "-";
    reveal();
  }
  setProgress();
  questionEl.focus();
}

async function choose(i) {
  if (results[current] !== undefined || busy) return;
  busy = true;
  stopTimer();
  const idx = current,
    answer = quiz[idx].answers[i];
  try {
    const r = await post("php/check_answer.php", {
      question_id: quiz[idx].id,
      answer_id: answer.id,
      elapsed: TIME_LIMIT - timeLeft,
    });
    results[idx] = { ...r, picked: answer.id };
  } catch (e) {
    busy = false;
    feedback.textContent = "Server error, try again.";
    runTimer(); // resume the timer
    return;
  }
  busy = false;
  results[idx].ok ? App.playCorrect() : App.playWrong();
  if (idx === current) {
    reveal();
    setProgress();
  }
}

// Colors, icons and message for the current question (data comes from PHP)
function reveal() {
  const r = results[current];
  answersEl.querySelectorAll(".answer").forEach((btn, i) => {
    const id = quiz[current].answers[i].id;
    btn.classList.add("locked");
    btn.setAttribute("aria-disabled", "true");
    if (id === r.correct_id) {
      btn.classList.add("correct");
      btn.querySelector(".icon").textContent = "\u2713";
    } else if (id === r.picked) {
      btn.classList.add("wrong");
      btn.querySelector(".icon").textContent = "\u2717";
    }
  });
  feedback.textContent = r.ok
    ? `Correct! +${r.points} pts`
    : r.picked === -1
      ? "Time's up!"
      : "Wrong!";
  feedback.classList.add(r.ok ? "ok" : "bad");
  nextBtn.disabled = false;
}

function goNext() {
  clearTimeout(advanceId);
  if (current < quiz.length - 1) {
    current++;
    render();
  } else finish();
}

async function finish() {
  stopTimer();
  try {
    const r = await post("php/save_score.php", {
      player: localStorage.getItem("quizPlayer") || "",
    });
    sessionStorage.setItem("quizScore", r.score);
    sessionStorage.setItem("quizTotal", r.total);
    sessionStorage.setItem("quizPoints", r.points);
    App.go("result.html");
  } catch (e) {
    feedback.textContent = "Could not save your score. Try again.";
  }
}

nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", () => {
  if (current > 0) {
    clearTimeout(advanceId);
    current--;
    render();
  }
});
document.addEventListener("keydown", (e) => {
  const n = Number(e.key);
  if (n >= 1 && n <= 4 && quiz[current] && quiz[current].answers[n - 1]) choose(n - 1);
});

// Load the questions from PHP, then start
(async function init() {
  try {
    const res = await fetch("php/get_questions.php");
    if (!res.ok) throw new Error();
    quiz = await res.json();
    results = new Array(quiz.length).fill(undefined);
    render();
  } catch (e) {
    questionEl.textContent =
      "Could not load questions. Open the site through http://localhost (XAMPP/WAMP) and import sql/database.sql.";
    nextBtn.disabled = prevBtn.disabled = true;
    timerEl.textContent = "-";
  }
})();
