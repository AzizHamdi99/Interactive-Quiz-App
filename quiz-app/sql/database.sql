CREATE DATABASE IF NOT EXISTS quiz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_db;

DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS scores;

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  type ENUM('mcq','tf') NOT NULL DEFAULT 'mcq'
);

CREATE TABLE answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  text VARCHAR(255) NOT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  position TINYINT NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player VARCHAR(30) NOT NULL,
  points INT NOT NULL,
  correct INT NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO questions (id, question, type) VALUES (1, 'What does HTML stand for?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (1, 'Hyper Text Markup Language', 1, 0),
  (1, 'High Tech Modern Language', 0, 1),
  (1, 'Hyperlinks and Text Markup Language', 0, 2),
  (1, 'Home Tool Markup Language', 0, 3);

INSERT INTO questions (id, question, type) VALUES (2, 'Which HTML element marks the main content of a page as an accessibility landmark?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (2, '<section>', 0, 0),
  (2, '<main>', 1, 1),
  (2, '<div>', 0, 2),
  (2, '<article>', 0, 3);

INSERT INTO questions (id, question, type) VALUES (3, 'Which CSS property changes the text color of an element?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (3, 'font-color', 0, 0),
  (3, 'text-style', 0, 1),
  (3, 'color', 1, 2),
  (3, 'foreground', 0, 3);

INSERT INTO questions (id, question, type) VALUES (4, 'Which CSS layout module is designed for two-dimensional layouts (rows and columns)?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (4, 'Flexbox', 0, 0),
  (4, 'Float', 0, 1),
  (4, 'Grid', 1, 2),
  (4, 'Table-layout', 0, 3);

INSERT INTO questions (id, question, type) VALUES (5, 'How do you declare a CSS variable?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (5, '$main: blue;', 0, 0),
  (5, '--main: blue;', 1, 1),
  (5, '@main: blue;', 0, 2),
  (5, 'var main = blue;', 0, 3);

INSERT INTO questions (id, question, type) VALUES (6, 'Which keyword declares a variable that cannot be reassigned in JavaScript?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (6, 'var', 0, 0),
  (6, 'let', 0, 1),
  (6, 'static', 0, 2),
  (6, 'const', 1, 3);

INSERT INTO questions (id, question, type) VALUES (7, 'Which method adds an event listener to an element?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (7, 'addEventListener()', 1, 0),
  (7, 'attachEvent()', 0, 1),
  (7, 'onEvent()', 0, 2),
  (7, 'listen()', 0, 3);

INSERT INTO questions (id, question, type) VALUES (8, 'Which method returns the first element matching a CSS selector?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (8, 'getElement()', 0, 0),
  (8, 'querySelector()', 1, 1),
  (8, 'selectAll()', 0, 2),
  (8, 'findElement()', 0, 3);

INSERT INTO questions (id, question, type) VALUES (9, 'Which Web Storage API keeps data even after the browser is closed?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (9, 'sessionStorage', 0, 0),
  (9, 'window.name', 0, 1),
  (9, 'localStorage', 1, 2),
  (9, 'history.state', 0, 3);

INSERT INTO questions (id, question, type) VALUES (10, 'What does the media query @media (max-width: 768px) target?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (10, 'Screens wider than 768px', 0, 0),
  (10, 'Screens 768px wide or narrower', 1, 1),
  (10, 'Only print layouts', 0, 2),
  (10, 'Only 768px tall screens', 0, 3);

INSERT INTO questions (id, question, type) VALUES (11, 'Which HTTP status code means the page was not found?', 'mcq');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (11, '200', 0, 0),
  (11, '301', 0, 1),
  (11, '500', 0, 2),
  (11, '404', 1, 3);

INSERT INTO questions (id, question, type) VALUES (12, 'CSS stands for Cascading Style Sheets.', 'tf');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (12, 'True', 1, 0),
  (12, 'False', 0, 1);

INSERT INTO questions (id, question, type) VALUES (13, 'JavaScript and Java are the same language.', 'tf');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (13, 'True', 0, 0),
  (13, 'False', 1, 1);

INSERT INTO questions (id, question, type) VALUES (14, 'localStorage data is deleted when the tab is closed.', 'tf');
INSERT INTO answers (question_id, text, is_correct, position) VALUES
  (14, 'True', 0, 0),
  (14, 'False', 1, 1);

