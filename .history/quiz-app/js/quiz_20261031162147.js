/* Quiz engine: shuffling, timer, feedback, score, progress, localStorage */
const TOTAL = 10,
  TIME_LIMIT = 20;
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

// Fisher-Yates shuffle (returns a new array)
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Randomize question order and answer order; remember which answer is correct
const quiz = shuffle(questions)
  .slice(0, TOTAL)
  .map((q) => {
    const list = q.answers.map((text, i) => ({
      text,
      isCorrect: i === q.correct,
    }));
    return {
      question: q.question,
      type: q.type || "mcq",
      answers: q.type === "tf" ? list : shuffle(list), // Vrai/Faux : on ne mélange pas
    };
  });

let current = 0,
  timeLeft = TIME_LIMIT,
  timerId = null,
  advanceId = null;
const picked = new Array(quiz.length).fill(undefined); // chosen index, -1 = timed out

const score = () =>
  picked.filter((p, i) => p >= 0 && quiz[i].answers[p].isCorrect).length;

function setProgress() {
  const answered = picked.filter((p) => p !== undefined).length;
  const pct = Math.round((answered / quiz.length) * 100);
  bar.style.width = pct + "%";
  percent.textContent = pct + "%";
  progress.setAttribute("aria-valuenow", pct);
}

function stopTimer() {
  clearInterval(timerId);
  timerEl.parentElement.classList.remove("low");
}

function startTimer() {
  stopTimer();
  timeLeft = TIME_LIMIT;
  timerEl.textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    timerEl.parentElement.classList.toggle("low", timeLeft <= 5);
    if (timeLeft <= 0) timeUp();
  }, 1000);
}

function timeUp() {
  stopTimer();
  picked[current] = -1;
  App.playWrong();
  reveal();
  setProgress();
  advanceId = setTimeout(goNext, 1500); // auto move on
}

function render() {
  clearTimeout(advanceId);
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
  if (picked[current] === undefined) {
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

function choose(i) {
  if (picked[current] !== undefined) return; // already answered
  picked[current] = i;
  stopTimer();
  quiz[current].answers[i].isCorrect ? App.playCorrect() : App.playWrong();
  reveal();
  setProgress();
}

// Show colors, icons and message for the current question
function reveal() {
  const choice = picked[current];
  answersEl.querySelectorAll(".answer").forEach((btn, i) => {
    const isCorrect = quiz[current].answers[i].isCorrect;
    btn.classList.add("locked");
    btn.setAttribute("aria-disabled", "true");
    if (isCorrect) {
      btn.classList.add("correct");
      btn.querySelector(".icon").textContent = "\u2713";
    } else if (i === choice) {
      btn.classList.add("wrong");
      btn.querySelector(".icon").textContent = "\u2717";
    }
  });
  const ok = choice >= 0 && quiz[current].answers[choice].isCorrect;
  feedback.textContent = ok
    ? "Correct!"
    : choice === -1
      ? "Time's up!"
      : "Wrong!";
  feedback.classList.add(ok ? "ok" : "bad");
  nextBtn.disabled = false;
}

function goNext() {
  clearTimeout(advanceId);
  if (current < quiz.length - 1) {
    current++;
    render();
  } else finish();
}

function finish() {
  stopTimer();
  const final = score();
  sessionStorage.setItem("quizScore", final);
  sessionStorage.setItem("quizTotal", quiz.length);
  if (final > (Number(localStorage.getItem("quizBest")) || 0))
    localStorage.setItem("quizBest", final);
  App.go("result.html");
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
  // keys 1-4 pick answers
  const n = Number(e.key);
  if (n >= 1 && n <= 4 && picked[current] === undefined) choose(n - 1);
});

render();
