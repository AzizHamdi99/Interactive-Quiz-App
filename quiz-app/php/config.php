<?php
// Database connection + helpers (included by every endpoint)
session_start();
header('Content-Type: application/json; charset=utf-8');

function out($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo = new PDO(
    'mysql:host=127.0.0.1;port=3306;dbname=quiz_db;charset=utf8mb4',
    'root', '0000',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);
} catch (PDOException $e) {
    out(['error' => $e->getMessage()], 500);
}

const TIME_LIMIT = 20, MAX_POINTS = 100, MIN_POINTS = 40, PENALTY = 3;
