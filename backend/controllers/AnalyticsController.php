<?php
// backend/controllers/AnalyticsController.php

require_once __DIR__ . '/../config/database.php';

class AnalyticsController {
    public static function getDashboardStats() {
        $db = Database::getConnection();

        // Compute numbers directly from MySQL query aggregates
        $totalComics = (int)$db->query("SELECT COUNT(*) FROM comics")->fetchColumn();
        $publishedComics = (int)$db->query("SELECT COUNT(*) FROM comics WHERE status = 'published'")->fetchColumn();
        $draftComics = (int)$db->query("SELECT COUNT(*) FROM comics WHERE status = 'draft'")->fetchColumn();
        $unpublishedComics = (int)$db->query("SELECT COUNT(*) FROM comics WHERE status = 'unpublished'")->fetchColumn();
        $totalPages = (int)$db->query("SELECT COUNT(*) FROM comic_pages")->fetchColumn();
        $totalUsers = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();
        $totalReads = (int)$db->query("SELECT COUNT(*) FROM reading_history")->fetchColumn();
        if ($totalReads === 0) {
            $totalReads = (int)$db->query("SELECT COUNT(*) FROM reading_progress")->fetchColumn();
        }

        // Recent Activity
        $recentStmt = $db->query("
            SELECT a.*, adm.username as admin_name 
            FROM activity_logs a 
            LEFT JOIN admins adm ON a.admin_id = adm.id 
            ORDER BY a.created_at DESC LIMIT 10
        ");
        $recentActivity = $recentStmt->fetchAll();

        // Top Read Comics
        $topComicsStmt = $db->query("
            SELECT c.id, c.title, c.issue_number, c.cover_image, COUNT(rh.id) as read_count 
            FROM comics c 
            LEFT JOIN reading_history rh ON c.id = rh.comic_id 
            GROUP BY c.id 
            ORDER BY read_count DESC 
            LIMIT 5
        ");
        $topComics = $topComicsStmt->fetchAll();

        echo json_encode([
            'success' => true,
            'stats' => [
                'total_comics' => $totalComics,
                'published_comics' => $publishedComics,
                'draft_comics' => $draftComics,
                'unpublished_comics' => $unpublishedComics,
                'total_pages' => $totalPages,
                'total_users' => $totalUsers,
                'total_reads' => $totalReads
            ],
            'recent_activity' => $recentActivity,
            'top_comics' => $topComics
        ]);
    }

    public static function saveReadingProgress() {
        $db = Database::getConnection();
        $input = json_decode(file_get_contents('php://input'), true);

        $comic_id = (int)($input['comic_id'] ?? 0);
        $current_page = (int)($input['current_page'] ?? 1);
        $session_token = trim($input['session_token'] ?? 'guest_' . md5($_SERVER['REMOTE_ADDR']));
        $user_id = isset($input['user_id']) ? (int)$input['user_id'] : null;

        if ($comic_id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid comic_id']);
            return;
        }

        // Upsert reading_progress
        $stmt = $db->prepare("
            INSERT INTO reading_progress (user_id, session_token, comic_id, current_page, updated_at) 
            VALUES (:user_id, :session_token, :comic_id, :current_page, NOW()) 
            ON DUPLICATE KEY UPDATE current_page = :current_page, updated_at = NOW()
        ");
        $stmt->execute([
            'user_id' => $user_id,
            'session_token' => $session_token,
            'comic_id' => $comic_id,
            'current_page' => $current_page
        ]);

        // Record history entry
        $histStmt = $db->prepare("
            INSERT INTO reading_history (user_id, session_token, comic_id, page_reached, read_at) 
            VALUES (:user_id, :session_token, :comic_id, :page_reached, NOW())
        ");
        $histStmt->execute([
            'user_id' => $user_id,
            'session_token' => $session_token,
            'comic_id' => $comic_id,
            'page_reached' => $current_page
        ]);

        echo json_encode(['success' => true, 'message' => 'Progress saved']);
    }

    public static function getReadingProgress() {
        $db = Database::getConnection();
        $comic_id = (int)($_GET['comic_id'] ?? 0);
        $session_token = trim($_GET['session_token'] ?? 'guest_' . md5($_SERVER['REMOTE_ADDR']));

        $stmt = $db->prepare("
            SELECT * FROM reading_progress 
            WHERE comic_id = :comic_id AND session_token = :session_token 
            LIMIT 1
        ");
        $stmt->execute(['comic_id' => $comic_id, 'session_token' => $session_token]);
        $progress = $stmt->fetch();

        echo json_encode(['success' => true, 'progress' => $progress]);
    }
}
