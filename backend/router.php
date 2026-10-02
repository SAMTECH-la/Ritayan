<?php
// backend/router.php - Unified Router script for PHP server

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Helper function for serving files with MIME types
function serveStaticFile($filePath) {
    if (file_exists($filePath) && is_file($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimes = [
            'html' => 'text/html; charset=utf-8',
            'css' => 'text/css; charset=utf-8',
            'js' => 'application/javascript; charset=utf-8',
            'svg' => 'image/svg+xml',
            'webp' => 'image/webp',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'json' => 'application/json; charset=utf-8',
            'woff2' => 'font/woff2',
            'woff' => 'font/woff',
            'ttf' => 'font/ttf',
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav'
        ];
        if (isset($mimes[$ext])) {
            header('Content-Type: ' . $mimes[$ext]);
        }
        readfile($filePath);
        exit;
    }
}

// 1. Uploaded Files
if (strpos($uri, '/uploads/') === 0) {
    serveStaticFile(__DIR__ . $uri);
}

// 2. API Routes
if (strpos($uri, '/api') === 0) {
    require __DIR__ . '/api/index.php';
    exit;
}

// 3. Admin Panel Static Assets & SPA Routing (/admin/*)
if (strpos($uri, '/admin') === 0) {
    $adminDist = __DIR__ . '/../admin-panel/dist';
    $relPath = preg_replace('#^/admin#', '', $uri);
    if (!empty($relPath) && $relPath !== '/') {
        serveStaticFile($adminDist . $relPath);
    }
    serveStaticFile($adminDist . '/index.html');
}

// 4. Public Website Static Assets & SPA Routing (/*)
$publicDist = __DIR__ . '/../public-website/dist';
if ($uri !== '/' && file_exists($publicDist . $uri) && is_file($publicDist . $uri)) {
    serveStaticFile($publicDist . $uri);
}

// SPA fallback for public website
if (file_exists($publicDist . '/index.html')) {
    serveStaticFile($publicDist . '/index.html');
}

// Fallback to API router if no dist found
require __DIR__ . '/api/index.php';
