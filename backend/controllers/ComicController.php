<?php
// backend/controllers/ComicController.php

require_once __DIR__ . '/../config/database.php';

class ComicController {
    private static function getBaseUrl() {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
            $protocol = 'https';
        }
        $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost:8000';
        return "$protocol://$host/uploads/";
    }

    private static function formatComic($comic) {
        if (!$comic) return null;
        if (!empty($comic['cover_image']) && strpos($comic['cover_image'], 'http') !== 0) {
            $comic['cover_url'] = self::getBaseUrl() . ltrim($comic['cover_image'], '/');
        } else {
            $comic['cover_url'] = $comic['cover_image'] ?? null;
        }
        return $comic;
    }

    public static function getPublicComics() {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT c.*, COUNT(DISTINCT p.page_number) as total_pages 
            FROM comics c 
            LEFT JOIN comic_pages p ON c.id = p.comic_id 
            WHERE c.status = 'published' 
            GROUP BY c.id 
            ORDER BY c.issue_number ASC
        ");
        $comics = $stmt->fetchAll();
        $formatted = array_map([self::class, 'formatComic'], $comics);
        
        echo json_encode(['success' => true, 'comics' => $formatted]);
    }

    public static function getComicBySlug($slug) {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM comics WHERE slug = :slug OR id = :id");
        $stmt->execute(['slug' => $slug, 'id' => $slug]);
        $comic = $stmt->fetch();

        if (!$comic) {
            http_response_code(404);
            echo json_encode(['error' => 'Comic not found']);
            return;
        }

        $formatted = self::formatComic($comic);

        $lang = strtoupper($_GET['lang'] ?? $_GET['language'] ?? 'HI');

        // Fetch pages ordered by page_number filtered by requested language
        $pageStmt = $db->prepare("SELECT * FROM comic_pages WHERE comic_id = :comic_id AND language_code = :lang ORDER BY page_number ASC");
        $pageStmt->execute(['comic_id' => $comic['id'], 'lang' => $lang]);
        $pages = $pageStmt->fetchAll();

        if (empty($pages)) {
            $pageStmt = $db->prepare("SELECT * FROM comic_pages WHERE comic_id = :comic_id ORDER BY page_number ASC");
            $pageStmt->execute(['comic_id' => $comic['id']]);
            $pages = $pageStmt->fetchAll();
        }

        $formattedPages = array_map(function($page) {
            if (!empty($page['image_path']) && strpos($page['image_path'], 'http') !== 0) {
                $page['image_url'] = ComicController::getBaseUrl() . ltrim($page['image_path'], '/');
            } else {
                $page['image_url'] = $page['image_path'];
            }
            return $page;
        }, $pages);

        $formatted['language'] = $lang;
        $formatted['pages'] = $formattedPages;
        $formatted['total_pages'] = count($formattedPages);

        echo json_encode(['success' => true, 'comic' => $formatted]);
    }

    public static function getAdminComics() {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT c.*, COUNT(DISTINCT p.page_number) as total_pages 
            FROM comics c 
            LEFT JOIN comic_pages p ON c.id = p.comic_id 
            GROUP BY c.id 
            ORDER BY c.issue_number ASC
        ");
        $comics = $stmt->fetchAll();
        $formatted = array_map([self::class, 'formatComic'], $comics);

        echo json_encode(['success' => true, 'comics' => $formatted]);
    }

    public static function createComic() {
        $db = Database::getConnection();
        
        // Merge $_POST and php://input json data
        $input = $_POST;
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $json = json_decode($raw, true);
            if (is_array($json)) {
                $input = array_merge($input, $json);
            }
        }

        $issue_number = (int)($input['issue_number'] ?? 0);
        $title = trim($input['title'] ?? '');
        $subtitle = trim($input['subtitle'] ?? '');
        $description = trim($input['description'] ?? '');
        $author = trim($input['author'] ?? 'Ritayan Studio');
        $status = in_array($input['status'] ?? '', ['draft', 'published', 'unpublished']) ? $input['status'] : 'draft';
        $release_date = !empty($input['release_date']) ? $input['release_date'] : date('Y-m-d');
        
        $slug = 'ritayan-' . str_pad($issue_number, 3, '0', STR_PAD_LEFT);
        if (!empty($input['slug'])) {
            $slug = preg_replace('/[^a-z0-9-]/', '-', strtolower($input['slug']));
        }

        if (empty($title) || $issue_number <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid Title and Issue Number are required']);
            return;
        }

        // Check uniqueness of issue_number and slug
        $checkStmt = $db->prepare("SELECT id, issue_number, slug FROM comics WHERE issue_number = :issue_number OR slug = :slug");
        $checkStmt->execute(['issue_number' => $issue_number, 'slug' => $slug]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            http_response_code(400);
            if ((int)$existing['issue_number'] === $issue_number) {
                echo json_encode(['error' => "Issue #{$issue_number} already exists in database. Please use a unique issue number."]);
            } else {
                echo json_encode(['error' => "Slug '{$slug}' already exists."]);
            }
            return;
        }

        $stmt = $db->prepare("
            INSERT INTO comics (issue_number, title, subtitle, slug, description, author, status, release_date) 
            VALUES (:issue_number, :title, :subtitle, :slug, :description, :author, :status, :release_date)
        ");

        $stmt->execute([
            'issue_number' => $issue_number,
            'title' => $title,
            'subtitle' => $subtitle,
            'slug' => $slug,
            'description' => $description,
            'author' => $author,
            'status' => $status,
            'release_date' => $release_date
        ]);

        $comic_id = $db->lastInsertId();

        // Handle cover file if uploaded
        if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
            self::saveCoverImage($comic_id, $slug, $_FILES['cover']);
        }

        $fetchStmt = $db->prepare("SELECT * FROM comics WHERE id = :id");
        $fetchStmt->execute(['id' => $comic_id]);
        $newComic = self::formatComic($fetchStmt->fetch());

        echo json_encode(['success' => true, 'message' => 'Comic created successfully', 'comic' => $newComic]);
    }

    public static function updateComic($id) {
        $db = Database::getConnection();
        
        $input = $_POST;
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $json = json_decode($raw, true);
            if (is_array($json)) {
                $input = array_merge($input, $json);
            }
        }

        $stmt = $db->prepare("SELECT * FROM comics WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $comic = $stmt->fetch();

        if (!$comic) {
            http_response_code(404);
            echo json_encode(['error' => 'Comic not found']);
            return;
        }

        $issue_number = isset($input['issue_number']) ? (int)$input['issue_number'] : $comic['issue_number'];
        $title = isset($input['title']) ? trim($input['title']) : $comic['title'];
        $subtitle = isset($input['subtitle']) ? trim($input['subtitle']) : $comic['subtitle'];
        $description = isset($input['description']) ? trim($input['description']) : $comic['description'];
        $author = isset($input['author']) ? trim($input['author']) : $comic['author'];
        $status = isset($input['status']) && in_array($input['status'], ['draft', 'published', 'unpublished']) ? $input['status'] : $comic['status'];
        $release_date = isset($input['release_date']) ? $input['release_date'] : $comic['release_date'];

        $updateStmt = $db->prepare("
            UPDATE comics 
            SET issue_number = :issue_number, title = :title, subtitle = :subtitle, description = :description, 
                author = :author, status = :status, release_date = :release_date 
            WHERE id = :id
        ");

        $updateStmt->execute([
            'issue_number' => $issue_number,
            'title' => $title,
            'subtitle' => $subtitle,
            'description' => $description,
            'author' => $author,
            'status' => $status,
            'release_date' => $release_date,
            'id' => $id
        ]);

        if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
            self::saveCoverImage($id, $comic['slug'], $_FILES['cover']);
        }

        $fetchStmt = $db->prepare("SELECT * FROM comics WHERE id = :id");
        $fetchStmt->execute(['id' => $id]);
        $updatedComic = self::formatComic($fetchStmt->fetch());

        echo json_encode(['success' => true, 'message' => 'Comic updated successfully', 'comic' => $updatedComic]);
    }

    public static function uploadCover($id) {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM comics WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $comic = $stmt->fetch();

        if (!$comic) {
            http_response_code(404);
            echo json_encode(['error' => 'Comic not found']);
            return;
        }

        if (!isset($_FILES['cover']) || $_FILES['cover']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid cover file uploaded']);
            return;
        }

        $cover_path = self::saveCoverImage($id, $comic['slug'], $_FILES['cover']);

        echo json_encode(['success' => true, 'message' => 'Cover image updated', 'cover_image' => $cover_path, 'cover_url' => self::getBaseUrl() . $cover_path]);
    }

    private static function saveCoverImage($comic_id, $slug, $file) {
        $targetDir = __DIR__ . '/../uploads/comics/' . $slug . '/';
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'webp';
        $filename = 'cover.' . $ext;
        $targetPath = $targetDir . $filename;

        move_uploaded_file($file['tmp_name'], $targetPath);
        $relativePath = 'comics/' . $slug . '/' . $filename;

        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE comics SET cover_image = :cover_image WHERE id = :id");
        $stmt->execute(['cover_image' => $relativePath, 'id' => $comic_id]);

        return $relativePath;
    }

    public static function updateStatus($id, $status) {
        $db = Database::getConnection();
        if (!in_array($status, ['draft', 'published', 'unpublished'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status']);
            return;
        }

        $stmt = $db->prepare("UPDATE comics SET status = :status WHERE id = :id");
        $stmt->execute(['status' => $status, 'id' => $id]);

        echo json_encode(['success' => true, 'message' => "Comic status updated to $status", 'status' => $status]);
    }

    public static function deleteComic($id) {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM comics WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $comic = $stmt->fetch();

        if (!$comic) {
            http_response_code(404);
            echo json_encode(['error' => 'Comic not found']);
            return;
        }

        $slug = $comic['slug'];
        $comicDir = __DIR__ . '/../uploads/comics/' . $slug;
        if (file_exists($comicDir)) {
            self::recursiveDeleteDir($comicDir);
        }

        $deleteStmt = $db->prepare("DELETE FROM comics WHERE id = :id");
        $deleteStmt->execute(['id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Comic deleted successfully']);
    }

    private static function recursiveDeleteDir($dir) {
        if (!is_dir($dir)) return;
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? self::recursiveDeleteDir("$dir/$file") : unlink("$dir/$file");
        }
        rmdir($dir);
    }
}
