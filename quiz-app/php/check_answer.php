<?php
// Server-side validation of one answer. Returns the correction and the points.
require 'config.php';

$qid     = (int)($_POST['question_id'] ?? 0);
$aid     = (int)($_POST['answer_id'] ?? 0);          // 0 = time out
$elapsed = max(0, min(TIME_LIMIT, (int)($_POST['elapsed'] ?? TIME_LIMIT)));

$quiz = $_SESSION['quiz'] ?? null;
if (!$quiz || !in_array($qid, $quiz['ids'], true)) out(['error' => 'Invalid question'], 400);

// Already answered: return the stored result (no second try)
if (isset($quiz['results'][$qid])) out($quiz['results'][$qid]);

$stmt = $pdo->prepare("SELECT id FROM answers WHERE question_id = ? AND is_correct = 1");
$stmt->execute([$qid]);
$correctId = (int)$stmt->fetchColumn();

$ok = ($aid === $correctId);
$result = [
    'ok'         => $ok,
    'correct_id' => $correctId,
    'points'     => $ok ? max(MIN_POINTS, MAX_POINTS - PENALTY * $elapsed) : 0,
];
$_SESSION['quiz']['results'][$qid] = $result;
out($result);
