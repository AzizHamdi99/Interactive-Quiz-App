<?php
// Computes the final score FROM THE SERVER SESSION (client cannot fake it) and saves it.
require 'config.php';

$quiz = $_SESSION['quiz'] ?? null;
if (!$quiz || count($quiz['results']) < count($quiz['ids'])) out(['error' => 'Quiz not finished'], 400);

if ($quiz['saved']) out($quiz['saved']);   // already saved: no duplicates

$player = trim(strip_tags($_POST['player'] ?? ''));
$player = substr($player !== '' ? $player : 'Anonymous', 0, 30);
$correct = 0; $points = 0;
foreach ($quiz['results'] as $r) { $correct += $r['ok'] ? 1 : 0; $points += $r['points']; }
$total = count($quiz['ids']);

$pdo->prepare("INSERT INTO scores (player, points, correct, total) VALUES (?, ?, ?, ?)")
    ->execute([$player, $points, $correct, $total]);

$saved = ['score' => $correct, 'total' => $total, 'points' => $points];
$_SESSION['quiz']['saved'] = $saved;
out($saved);
