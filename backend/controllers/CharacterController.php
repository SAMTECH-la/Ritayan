<?php
// backend/controllers/CharacterController.php

require_once __DIR__ . '/../config/database.php';

class CharacterController {
    private static function getBaseUrl() {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
            $protocol = 'https';
        }
        $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost:8000';
        return "$protocol://$host/uploads/";
    }

    private static function formatCharacter($ch) {
        if (!$ch) return null;
        if (!empty($ch['avatar_image']) && strpos($ch['avatar_image'], 'http') !== 0) {
            $ch['avatar_url'] = self::getBaseUrl() . ltrim($ch['avatar_image'], '/');
        } else {
            $ch['avatar_url'] = $ch['avatar_image'] ?? null;
        }
        return $ch;
    }

    public static function getCharacters() {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM characters ORDER BY id ASC");
        $characters = $stmt->fetchAll();
        $formatted = array_map([self::class, 'formatCharacter'], $characters);

        echo json_encode(['success' => true, 'characters' => $formatted]);
    }

    public static function getCharacter($identifier) {
        $db = Database::getConnection();
        if (is_numeric($identifier)) {
            $stmt = $db->prepare("SELECT * FROM characters WHERE id = :id");
            $stmt->execute(['id' => $identifier]);
        } else {
            $stmt = $db->prepare("SELECT * FROM characters WHERE LOWER(name) = LOWER(:name)");
            $stmt->execute(['name' => $identifier]);
        }
        $character = $stmt->fetch();

        if (!$character) {
            http_response_code(404);
            echo json_encode(['error' => 'Character not found']);
            return;
        }

        echo json_encode(['success' => true, 'character' => self::formatCharacter($character)]);
    }

    public static function createCharacter() {
        $db = Database::getConnection();

        $input = $_POST;
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $json = json_decode($raw, true);
            if (is_array($json)) {
                $input = array_merge($input, $json);
            }
        }

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['error' => 'Character name is required']);
            return;
        }

        $avatarImagePath = null;

        // Handle Image Upload if attached
        if (isset($_FILES['avatar_image']) && $_FILES['avatar_image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/characters';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $ext = strtolower(pathinfo($_FILES['avatar_image']['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'svg'])) {
                $ext = 'jpg';
            }
            $filename = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '', $name)) . '_' . time() . '.' . $ext;
            $targetFile = $uploadDir . '/' . $filename;

            if (move_uploaded_file($_FILES['avatar_image']['tmp_name'], $targetFile)) {
                $avatarImagePath = 'characters/' . $filename;
            }
        }

        $stmt = $db->prepare("
            INSERT INTO characters (name, title, avatar_type, character_category, yuga, theme_color, bg_gradient, avatar_image, weapon_symbol, power_level, description, lore_details, associated_slug)
            VALUES (:name, :title, :avatar_type, :character_category, :yuga, :theme_color, :bg_gradient, :avatar_image, :weapon_symbol, :power_level, :description, :lore_details, :associated_slug)
        ");

        $stmt->execute([
            'name' => $name,
            'title' => $input['title'] ?? '',
            'avatar_type' => $input['avatar_type'] ?? 'Avatar',
            'character_category' => $input['character_category'] ?? 'FISH',
            'yuga' => $input['yuga'] ?? 'Satya Yuga',
            'theme_color' => $input['theme_color'] ?? '#F59E0B',
            'bg_gradient' => $input['bg_gradient'] ?? 'linear-gradient(135deg, #020617 0%, #1E3A8A 50%, #0284C7 100%)',
            'avatar_image' => $avatarImagePath ?? ($input['avatar_image_path'] ?? null),
            'weapon_symbol' => $input['weapon_symbol'] ?? '',
            'power_level' => intval($input['power_level'] ?? 95),
            'description' => $input['description'] ?? '',
            'lore_details' => $input['lore_details'] ?? '',
            'associated_slug' => $input['associated_slug'] ?? ''
        ]);

        $id = $db->lastInsertId();
        echo json_encode(['success' => true, 'message' => 'Character created successfully', 'id' => $id]);
    }

    public static function updateCharacter($id) {
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT * FROM characters WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Character not found']);
            return;
        }

        $input = $_POST;
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $json = json_decode($raw, true);
            if (is_array($json)) {
                $input = array_merge($input, $json);
            }
        }

        $name = trim($input['name'] ?? $existing['name']);
        $avatarImagePath = $existing['avatar_image'];

        // Handle Image Upload if attached
        if (isset($_FILES['avatar_image']) && $_FILES['avatar_image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/characters';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $ext = strtolower(pathinfo($_FILES['avatar_image']['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'svg'])) {
                $ext = 'jpg';
            }
            $filename = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '', $name)) . '_' . time() . '.' . $ext;
            $targetFile = $uploadDir . '/' . $filename;

            if (move_uploaded_file($_FILES['avatar_image']['tmp_name'], $targetFile)) {
                $avatarImagePath = 'characters/' . $filename;
            }
        }

        $updateStmt = $db->prepare("
            UPDATE characters 
            SET name = :name,
                title = :title,
                avatar_type = :avatar_type,
                character_category = :character_category,
                yuga = :yuga,
                theme_color = :theme_color,
                bg_gradient = :bg_gradient,
                avatar_image = :avatar_image,
                weapon_symbol = :weapon_symbol,
                power_level = :power_level,
                description = :description,
                lore_details = :lore_details,
                associated_slug = :associated_slug
            WHERE id = :id
        ");

        $updateStmt->execute([
            'id' => $id,
            'name' => $name,
            'title' => $input['title'] ?? $existing['title'],
            'avatar_type' => $input['avatar_type'] ?? $existing['avatar_type'],
            'character_category' => $input['character_category'] ?? $existing['character_category'],
            'yuga' => $input['yuga'] ?? $existing['yuga'],
            'theme_color' => $input['theme_color'] ?? $existing['theme_color'],
            'bg_gradient' => $input['bg_gradient'] ?? $existing['bg_gradient'],
            'avatar_image' => $avatarImagePath,
            'weapon_symbol' => $input['weapon_symbol'] ?? $existing['weapon_symbol'],
            'power_level' => intval($input['power_level'] ?? $existing['power_level']),
            'description' => $input['description'] ?? $existing['description'],
            'lore_details' => $input['lore_details'] ?? $existing['lore_details'],
            'associated_slug' => $input['associated_slug'] ?? $existing['associated_slug']
        ]);

        echo json_encode(['success' => true, 'message' => 'Character updated successfully']);
    }

    public static function deleteCharacter($id) {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM characters WHERE id = :id");
        $stmt->execute(['id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Character deleted successfully']);
    }
}
