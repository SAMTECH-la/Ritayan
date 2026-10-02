<?php
// backend/api/index.php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ComicController.php';
require_once __DIR__ . '/../controllers/PageController.php';
require_once __DIR__ . '/../controllers/CharacterController.php';
require_once __DIR__ . '/../controllers/SettingsController.php';
require_once __DIR__ . '/../controllers/AnalyticsController.php';
require_once __DIR__ . '/../controllers/ActivityController.php';

handleCors();

$method = $_SERVER['REQUEST_METHOD'];
$fullUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Normalize URI path: strip leading path segments up to /api
$uri = preg_replace('#^.*?/api#', '', $fullUri);
$uri = preg_replace('#^/index\.php#', '', $uri);
if (empty($uri)) $uri = '/';

// Simple URL Matcher helper
function matchRoute($pattern, $uri, &$params = []) {
    $regex = preg_replace('#:([a-zA-Z0-9_]+)#', '(?P<$1>[^/]+)', $pattern);
    $regex = '#^' . $regex . '$#';
    if (preg_match($regex, $uri, $matches)) {
        $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
        return true;
    }
    return false;
}

// ROUTING MATRIX

// --- PUBLIC ENDPOINTS ---
if ($method === 'GET' && ($uri === '/comics' || $uri === '/comics/')) {
    ComicController::getPublicComics();
    exit;
}

if ($method === 'GET' && matchRoute('/comics/:slug/pages', $uri, $params)) {
    PageController::getPages($params['slug']);
    exit;
}

if ($method === 'GET' && matchRoute('/comics/:slug', $uri, $params)) {
    ComicController::getComicBySlug($params['slug']);
    exit;
}

if ($method === 'GET' && ($uri === '/characters' || $uri === '/characters/')) {
    CharacterController::getCharacters();
    exit;
}

if ($method === 'GET' && matchRoute('/characters/:identifier', $uri, $params)) {
    CharacterController::getCharacter($params['identifier']);
    exit;
}

if ($method === 'GET' && ($uri === '/settings' || $uri === '/settings/')) {
    SettingsController::getSettings();
    exit;
}

if ($method === 'POST' && $uri === '/progress') {
    AnalyticsController::saveReadingProgress();
    exit;
}

if ($method === 'GET' && $uri === '/progress') {
    AnalyticsController::getReadingProgress();
    exit;
}

// --- ADMIN AUTH (PUBLIC) ---
if ($method === 'POST' && ($uri === '/admin/login' || $uri === '/admin/login/')) {
    AuthController::adminLogin();
    exit;
}

// --- ADMIN PROTECTED ENDPOINTS ---
if (strpos($uri, '/admin') === 0) {
    // Verify Admin authentication header for all protected endpoints
    $admin = AuthMiddleware::verifyAdminToken();

    if ($method === 'GET' && $uri === '/admin/me') {
        echo json_encode(['success' => true, 'admin' => $admin]);
        exit;
    }

    if ($method === 'GET' && ($uri === '/admin/comics' || $uri === '/admin/comics/')) {
        ComicController::getAdminComics();
        exit;
    }

    if ($method === 'POST' && ($uri === '/admin/comics' || $uri === '/admin/comics/')) {
        ComicController::createComic();
        ActivityController::log($admin['id'], 'CREATE_COMIC', 'Created comic');
        exit;
    }

    if ($method === 'PUT' && matchRoute('/admin/comics/:id', $uri, $params)) {
        ComicController::updateComic($params['id']);
        ActivityController::log($admin['id'], 'UPDATE_COMIC', 'Updated comic ID: ' . $params['id']);
        exit;
    }

    if ($method === 'DELETE' && matchRoute('/admin/comics/:id', $uri, $params)) {
        ComicController::deleteComic($params['id']);
        ActivityController::log($admin['id'], 'DELETE_COMIC', 'Deleted comic ID: ' . $params['id']);
        exit;
    }

    if ($method === 'POST' && matchRoute('/admin/comics/:id/cover', $uri, $params)) {
        ComicController::uploadCover($params['id']);
        ActivityController::log($admin['id'], 'UPLOAD_COVER', 'Uploaded cover for comic ID: ' . $params['id']);
        exit;
    }

    if ($method === 'POST' && matchRoute('/admin/comics/:id/pages', $uri, $params)) {
        PageController::uploadPages($params['id']);
        ActivityController::log($admin['id'], 'UPLOAD_PAGES', 'Uploaded pages for comic ID: ' . $params['id']);
        exit;
    }

    if (($method === 'PUT' || $method === 'POST') && ($uri === '/admin/pages/reorder' || $uri === '/admin/pages/reorder/')) {
        PageController::reorderPages();
        ActivityController::log($admin['id'], 'REORDER_PAGES', 'Reordered comic pages');
        exit;
    }

    if ($method === 'DELETE' && matchRoute('/admin/pages/:id', $uri, $params)) {
        PageController::deletePage($params['id']);
        ActivityController::log($admin['id'], 'DELETE_PAGE', 'Deleted page ID: ' . $params['id']);
        exit;
    }

    if ($method === 'POST' && matchRoute('/admin/comics/:id/publish', $uri, $params)) {
        ComicController::updateStatus($params['id'], 'published');
        ActivityController::log($admin['id'], 'PUBLISH_COMIC', 'Published comic ID: ' . $params['id']);
        exit;
    }

    if ($method === 'POST' && matchRoute('/admin/comics/:id/unpublish', $uri, $params)) {
        ComicController::updateStatus($params['id'], 'unpublished');
        ActivityController::log($admin['id'], 'UNPUBLISH_COMIC', 'Unpublished comic ID: ' . $params['id']);
        exit;
    }

    if ($method === 'GET' && ($uri === '/admin/users' || $uri === '/admin/users/')) {
        AuthController::getUsers();
        exit;
    }

    // --- ADMIN CHARACTERS ---
    if ($method === 'GET' && ($uri === '/admin/characters' || $uri === '/admin/characters/')) {
        CharacterController::getCharacters();
        exit;
    }

    if ($method === 'POST' && ($uri === '/admin/characters' || $uri === '/admin/characters/')) {
        CharacterController::createCharacter();
        ActivityController::log($admin['id'], 'CREATE_CHARACTER', 'Created character');
        exit;
    }

    if (($method === 'PUT' || $method === 'POST') && matchRoute('/admin/characters/:id', $uri, $params)) {
        CharacterController::updateCharacter($params['id']);
        ActivityController::log($admin['id'], 'UPDATE_CHARACTER', 'Updated character ID: ' . $params['id']);
        exit;
    }

    if ($method === 'DELETE' && matchRoute('/admin/characters/:id', $uri, $params)) {
        CharacterController::deleteCharacter($params['id']);
        ActivityController::log($admin['id'], 'DELETE_CHARACTER', 'Deleted character ID: ' . $params['id']);
        exit;
    }

    if ($method === 'GET' && ($uri === '/admin/analytics' || $uri === '/admin/analytics/')) {
        AnalyticsController::getDashboardStats();
        exit;
    }

    if ($method === 'GET' && ($uri === '/admin/settings' || $uri === '/admin/settings/')) {
        SettingsController::getSettings();
        exit;
    }

    if ($method === 'PUT' && ($uri === '/admin/settings' || $uri === '/admin/settings/')) {
        SettingsController::updateSettings();
        ActivityController::log($admin['id'], 'UPDATE_SETTINGS', 'Updated website settings');
        exit;
    }

    if ($method === 'GET' && ($uri === '/admin/activity' || $uri === '/admin/activity/')) {
        ActivityController::getLogs();
        exit;
    }
}

// 404 Route Fallback
http_response_code(404);
echo json_encode(['error' => 'API endpoint not found', 'fullUri' => $fullUri, 'normalizedUri' => $uri, 'method' => $method]);
