<?php
// backend/config/database.php

class Database {
    private static $conn = null;

    public static function getConnection() {
        if (self::$conn === null) {
            $host     = getenv('DB_HOST') ?: '127.0.0.1';
            $port     = getenv('DB_PORT') ?: '3306';
            $db_name  = getenv('DB_NAME') ?: 'ritayan_db';
            $username = getenv('DB_USER') ?: 'root';
            $password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';

            try {
                // First try creating DB if permitted (for local dev)
                if ($host === '127.0.0.1' || $host === 'localhost') {
                    $dsn_no_db = "mysql:host={$host};port={$port};charset=utf8mb4";
                    $pdo_temp = new PDO($dsn_no_db, $username, $password, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                    ]);
                    $pdo_temp->exec("CREATE DATABASE IF NOT EXISTS `" . $db_name . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                }

                // Connect to the database
                $dsn = "mysql:host={$host};port={$port};dbname={$db_name};charset=utf8mb4";
                self::$conn = new PDO($dsn, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database Connection Failed: ' . $e->getMessage()]);
                exit;
            }
        }
        return self::$conn;
    }
}
