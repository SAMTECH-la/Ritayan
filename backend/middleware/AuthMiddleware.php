<?php
// backend/middleware/AuthMiddleware.php

class AuthMiddleware {
    public static function verifyAdminToken() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : null);

        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized: Missing Authorization header']);
            exit;
        }

        $token = str_replace('Bearer ', '', trim($authHeader));
        $db = Database::getConnection();

        // Verify bearer token format ritayan_admin_token_{id}
        if (strpos($token, 'ritayan_admin_token_') === 0) {
            $parts = explode('_', $token);
            $admin_id = (int)end($parts);

            $stmt = $db->prepare("
                SELECT a.id, a.username, a.email, r.role_name 
                FROM admins a 
                LEFT JOIN admin_roles r ON a.role_id = r.id 
                WHERE a.id = :id
            ");
            $stmt->execute(['id' => $admin_id]);
            $admin = $stmt->fetch();

            if ($admin) {
                return $admin;
            }
        }

        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Invalid or expired admin token']);
        exit;
    }
}
