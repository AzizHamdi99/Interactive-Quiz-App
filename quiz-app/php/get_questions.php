<?php
// Returns 10 random questions with shuffled answers. NEVER sends the correct answer.
require 'config.php';

$questions = $pdo->query("SELECT id, question, type FROM questions ORDER BY RAND() LIMIT 10")->fetchAll();
$stmt = [
    'mcq' => $pdo->prepare("SELECT id, text FROM answers WHERE question_id = ? ORDER BY RAND()"),
    'tf'  => $pdo->prepare("SELECT id, text FROM answers WHERE question_id = ? ORDER BY position"),
];
foreach ($questions as &$q) {
    $s = $stmt[$q['type']];
    $s->execute([$q['id']]);
    $q['answers'] = $s->fetchAll();
}
unset($q);

// New quiz session: remember which questions were served, reset results
$_SESSION['quiz'] = [
    'ids'     => array_map('intval', array_column($questions, 'id')),
    'results' => [],   // question_id => ['ok'=>bool,'points'=>int,'correct_id'=>int]
    'saved'   => null,
];
out($questions);
