# Interactive Quiz App

A responsive multiple-choice quiz about HTML, CSS, JavaScript and web development, built with plain HTML5, CSS3 and Vanilla JavaScript (no frameworks).

## Features
- 10 randomized questions with randomized answers (question bank in `js/questions.js`)
- Instant feedback: green with a check mark for correct, red for wrong, correct answer always highlighted
- Next stays disabled until an answer is chosen; Previous lets you review earlier answers
- Progress bar with percentage, 20-second timer per question with auto-advance
- Score message by percentage, best score saved with `localStorage`
- Dark mode (remembered), sound effects (Web Audio), confetti above 80%, page transitions
- Accessible: semantic landmarks, ARIA labels and live regions, visible focus, keyboard support (keys 1-4 select answers), reduced-motion support

## Folder structure
```
quiz-app/
  index.html  quiz.html  result.html
  css/  style.css  quiz.css  result.css
  js/   app.js  quiz.js  questions.js
  assets/  images/  icons/
  README.md
```

## How to run
Open `index.html` in a modern browser, or serve the folder (for example `python -m http.server`) and visit `http://localhost:8000`. An internet connection is needed only for the Poppins font.

## Technologies
HTML5, CSS3 (variables, Flexbox, Grid, media queries, animations), Vanilla JavaScript (DOM, localStorage, sessionStorage, Web Audio, Canvas).

## Screenshots
- Home page: `assets/images/screenshot-home.png` (placeholder)
- Quiz page: `assets/images/screenshot-quiz.png` (placeholder)
- Result page: `assets/images/screenshot-result.png` (placeholder)

## Future improvements
Quiz categories and difficulty levels, a leaderboard, answer review on the result page, more languages, and a settings panel for timer length and sound.
