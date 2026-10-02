<?php
// backend/controllers/AuthController.php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/ActivityController.php';

class AuthController {
    public static function adminLogin() {
        $db = Database::getConnection();
        $input = json_decode(file_get_contents('php://input'), true);

        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }

        $stmt = $db->prepare("
            SELECT a.*, r.role_name 
            FROM admins a 
            LEFT JOIN admin_roles r ON a.role_id = r.id 
            WHERE a.username = :username OR a.email = :email
        ");
        $stmt->execute([
            'username' => $username,
            'email' => $username
        ]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password_hash'])) {
            $token = 'ritayan_admin_token_' . $admin['id'];
            
            // Log activity
            ActivityController::log($admin['id'], 'LOGIN', 'Admin logged in: ' . $admin['username']);

            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'admin' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'email' => $admin['email'],
                    'role' => $admin['role_name'] ?? 'Super Admin'
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid username or password']);
        }
    }

    public static function getAdminProfile() {
        $admin = AuthMiddleware::verifyAdminToken();
        echo json_encode(['success' => true, 'admin' => $admin]);
    }

    public static function getUsers() {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT u.id, u.name, u.email, u.created_at, COUNT(DISTINCT rp.comic_id) as comics_started 
            FROM users u 
            LEFT JOIN reading_progress rp ON u.id = rp.user_id 
            GROUP BY u.id 
            ORDER BY u.created_at DESC
        ");
        $users = $stmt->fetchAll();

        echo json_encode(['success' => true, 'users' => $users]);
    }
}
