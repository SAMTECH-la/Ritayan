<?php
// backend/controllers/PageController.php

require_once __DIR__ . '/../config/database.php';

class PageController {
    private static function getBaseUrl() {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
            $protocol = 'https';
        }
        $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost:8000';
        return "$protocol://$host/uploads/";
    }

    public static function getPages($comic_id) {
        $db = Database::getConnection();

        // Support numeric ID or slug string
        if (!is_numeric($comic_id)) {
            $stmtSlug = $db->prepare("SELECT id FROM comics WHERE slug = :slug");
            $stmtSlug->execute(['slug' => $comic_id]);
            $comic_id = $stmtSlug->fetchColumn() ?: $comic_id;
        }

        $lang = strtoupper($_GET['lang'] ?? $_GET['language'] ?? 'HI');

        $stmt = $db->prepare("SELECT * FROM comic_pages WHERE comic_id = :comic_id AND language_code = :lang ORDER BY page_number ASC");
        $stmt->execute(['comic_id' => $comic_id, 'lang' => $lang]);
        $pages = $stmt->fetchAll();

        // Fallback if no pages match requested language
        if (empty($pages)) {
            $stmt = $db->prepare("SELECT * FROM comic_pages WHERE comic_id = :comic_id ORDER BY page_number ASC");
            $stmt->execute(['comic_id' => $comic_id]);
            $pages = $stmt->fetchAll();
        }

        $formatted = array_map(function($p) {
            $p['image_url'] = (strpos($p['image_path'], 'http') === 0) ? $p['image_path'] : PageController::getBaseUrl() . ltrim($p['image_path'], '/');
            return $p;
        }, $pages);

        echo json_encode(['success' => true, 'language' => $lang, 'pages' => $formatted]);
    }

    public static function uploadPages($comic_id) {
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT * FROM comics WHERE id = :id");
        $stmt->execute(['id' => $comic_id]);
        $comic = $stmt->fetch();

        if (!$comic) {
            http_response_code(404);
            echo json_encode(['error' => 'Comic not found']);
            return;
        }

        $lang = strtoupper($_POST['language_code'] ?? $_POST['lang'] ?? 'HI');
        if (!in_array($lang, ['HI', 'EN', 'MR'])) {
            $lang = 'HI';
        }

        // Get current max page_number for this comic and language
        $maxStmt = $db->prepare("SELECT MAX(page_number) as max_page FROM comic_pages WHERE comic_id = :comic_id AND language_code = :lang");
        $maxStmt->execute(['comic_id' => $comic_id, 'lang' => $lang]);
        $maxRow = $maxStmt->fetch();
        $currentMax = (int)($maxRow['max_page'] ?? 0);

        if (!isset($_FILES['pages'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No page files provided']);
            return;
        }

        $slug = $comic['slug'];
        $targetDir = __DIR__ . '/../uploads/comics/' . $slug . '/pages/' . strtolower($lang) . '/';
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $files = $_FILES['pages'];
        $insertedPages = [];

        // Handle single or multiple files array format in PHP
        $fileCount = is_array($files['name']) ? count($files['name']) : 1;

        for ($i = 0; $i < $fileCount; $i++) {
            $tmpName = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
            $origName = is_array($files['name']) ? $files['name'][$i] : $files['name'];
            $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

            if ($error === UPLOAD_ERR_OK && !empty($tmpName)) {
                $currentMax++;
                $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION)) ?: 'webp';
                $filename = 'page-' . str_pad($currentMax, 3, '0', STR_PAD_LEFT) . '.' . $ext;
                $targetPath = $targetDir . $filename;

                move_uploaded_file($tmpName, $targetPath);
                $relativePath = 'comics/' . $slug . '/pages/' . strtolower($lang) . '/' . $filename;

                $pageTitle = 'Page ' . $currentMax;

                $insertStmt = $db->prepare("
                    INSERT INTO comic_pages (comic_id, page_number, language_code, image_path, page_title) 
                    VALUES (:comic_id, :page_number, :language_code, :image_path, :page_title)
                ");
                $insertStmt->execute([
                    'comic_id' => $comic_id,
                    'page_number' => $currentMax,
                    'language_code' => $lang,
                    'image_path' => $relativePath,
                    'page_title' => $pageTitle
                ]);

                $pageId = $db->lastInsertId();
                $insertedPages[] = [
                    'id' => $pageId,
                    'comic_id' => $comic_id,
                    'page_number' => $currentMax,
                    'language_code' => $lang,
                    'image_path' => $relativePath,
                    'image_url' => self::getBaseUrl() . $relativePath,
                    'page_title' => $pageTitle
                ];
            }
        }

        echo json_encode([
            'success' => true,
            'message' => count($insertedPages) . ' pages uploaded successfully for language ' . $lang,
            'uploaded_pages' => $insertedPages
        ]);
    }

    public static function reorderPages() {
        $db = Database::getConnection();
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['pages']) || !is_array($input['pages'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid reorder data']);
            return;
        }

        $stmt = $db->prepare("UPDATE comic_pages SET page_number = :page_number WHERE id = :id");

        foreach ($input['pages'] as $pageItem) {
            if (isset($pageItem['id']) && isset($pageItem['page_number'])) {
                $stmt->execute([
                    'page_number' => (int)$pageItem['page_number'],
                    'id' => (int)$pageItem['id']
                ]);
            }
        }

        echo json_encode(['success' => true, 'message' => 'Page order updated successfully']);
    }

    public static function deletePage($page_id) {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM comic_pages WHERE id = :id");
        $stmt->execute(['id' => $page_id]);
        $page = $stmt->fetch();

        if (!$page) {
            http_response_code(404);
            echo json_encode(['error' => 'Page not found']);
            return;
        }

        // Remove image file if it exists locally
        $filePath = __DIR__ . '/../uploads/' . ltrim($page['image_path'], '/');
        if (file_exists($filePath) && is_file($filePath)) {
            @unlink($filePath);
        }

        $delStmt = $db->prepare("DELETE FROM comic_pages WHERE id = :id");
        $delStmt->execute(['id' => $page_id]);

        // Re-index remaining pages sequentially for this comic AND language_code
        $comic_id = $page['comic_id'];
        $lang = $page['language_code'] ?? 'HI';
        $remainingStmt = $db->prepare("SELECT id FROM comic_pages WHERE comic_id = :comic_id AND language_code = :lang ORDER BY page_number ASC");
        $remainingStmt->execute(['comic_id' => $comic_id, 'lang' => $lang]);
        $remaining = $remainingStmt->fetchAll();

        $updateStmt = $db->prepare("UPDATE comic_pages SET page_number = :num WHERE id = :id");
        foreach ($remaining as $idx => $r) {
            $updateStmt->execute(['num' => $idx + 1, 'id' => $r['id']]);
        }

        echo json_encode(['success' => true, 'message' => 'Page deleted and reindexed successfully']);
    }
}
