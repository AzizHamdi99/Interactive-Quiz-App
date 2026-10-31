// All quiz questions. "correct" is the index of the right answer in "answers".
const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
    ],
    correct: 0,
  },
  {
    question:
      "Which HTML element marks the main content of a page as an accessibility landmark?",
    answers: ["<section>", "<main>", "<div>", "<article>"],
    correct: 1,
  },
  {
    question: "Which CSS property changes the text color of an element?",
    answers: ["font-color", "text-style", "color", "foreground"],
    correct: 2,
  },
  {
    question:
      "Which CSS layout module is designed for two-dimensional layouts (rows and columns)?",
    answers: ["Flexbox", "Float", "Grid", "Table-layout"],
    correct: 2,
  },
  {
    question: "How do you declare a CSS variable?",
    answers: [
      "$main: blue;",
      "--main: blue;",
      "@main: blue;",
      "var main = blue;",
    ],
    correct: 1,
  },
  {
    question:
      "Which keyword declares a variable that cannot be reassigned in JavaScript?",
    answers: ["var", "let", "static", "const"],
    correct: 3,
  },
  {
    question: "Which method adds an event listener to an element?",
    answers: ["addEventListener()", "attachEvent()", "onEvent()", "listen()"],
    correct: 0,
  },
  {
    question: "Which method returns the first element matching a CSS selector?",
    answers: [
      "getElement()",
      "querySelector()",
      "selectAll()",
      "findElement()",
    ],
    correct: 1,
  },
  {
    question:
      "Which Web Storage API keeps data even after the browser is closed?",
    answers: ["sessionStorage", "window.name", "localStorage", "history.state"],
    correct: 2,
  },
  {
    question: "What does the media query @media (max-width: 768px) target?",
    answers: [
      "Screens wider than 768px",
      "Screens 768px wide or narrower",
      "Only print layouts",
      "Only 768px tall screens",
    ],
    correct: 1,
  },
  {
    question: "Which HTTP status code means the page was not found?",
    answers: ["200", "301", "500", "404"],
    correct: 3,
  },
];
