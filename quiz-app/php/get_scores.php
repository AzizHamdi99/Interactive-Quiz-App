<?php
// Leaderboard: top 5 scores + best score
require 'config.php';

$top = $pdo->query(
    "SELECT player, points, correct, total, DATE_FORMAT(created_at, '%d/%m/%Y') AS date
     FROM scores ORDER BY points DESC, id ASC LIMIT 5"
)->fetchAll();
out(['best' => $top ? (int)$top[0]['points'] : 0, 'top' => $top]);
