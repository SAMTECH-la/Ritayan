<?php
// backend/controllers/ActivityController.php

require_once __DIR__ . '/../config/database.php';

class ActivityController {
    public static function log($admin_id, $action, $details = '') {
        try {
            $db = Database::getConnection();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $stmt = $db->prepare("
                INSERT INTO activity_logs (admin_id, action, details, ip_address) 
                VALUES (:admin_id, :action, :details, :ip)
            ");
            $stmt->execute([
                'admin_id' => $admin_id,
                'action' => $action,
                'details' => $details,
                'ip' => $ip
            ]);
        } catch (Exception $e) {
            // Silently handle log insert errors if any
        }
    }

    public static function getLogs() {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT a.*, adm.username as admin_name 
            FROM activity_logs a 
            LEFT JOIN admins adm ON a.admin_id = adm.id 
            ORDER BY a.created_at DESC 
            LIMIT 50
        ");
        $logs = $stmt->fetchAll();

        echo json_encode(['success' => true, 'logs' => $logs]);
    }
}
