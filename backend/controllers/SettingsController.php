<?php
// backend/controllers/SettingsController.php

require_once __DIR__ . '/../config/database.php';

class SettingsController {
    public static function getSettings() {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT setting_key, setting_value FROM website_settings");
        $rows = $stmt->fetchAll();

        $settings = [];
        foreach ($rows as $r) {
            $settings[$r['setting_key']] = $r['setting_value'];
        }

        // Defaults if database empty
        $defaults = [
            'site_title' => 'RITAYAN — युगों की गाथा',
            'hero_title' => 'RITAYAN: युगों की गाथा',
            'hero_subtitle' => 'Explore the timeless Indian mythological graphic novels in interactive digital 3D.',
            'featured_issue_id' => '1',
            'about_text' => 'RITAYAN is a next-generation connected digital comic platform dedicated to retelling ancient Vedic & Puranic epics through immersive visual storytelling.',
            'contact_email' => 'contact@ritayan.com',
            'instagram_url' => 'https://instagram.com/ritayan_comics',
            'twitter_url' => 'https://twitter.com/ritayan_comics',
            'youtube_url' => 'https://youtube.com/@ritayan'
        ];

        $finalSettings = array_merge($defaults, $settings);

        echo json_encode(['success' => true, 'settings' => $finalSettings]);
    }

    public static function updateSettings() {
        $db = Database::getConnection();
        $input = json_decode(file_get_contents('php://input'), true);

        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid settings data']);
            return;
        }

        $stmt = $db->prepare("
            INSERT INTO website_settings (setting_key, setting_value) 
            VALUES (:key, :val) 
            ON DUPLICATE KEY UPDATE setting_value = :val
        ");

        foreach ($input as $key => $val) {
            $stmt->execute(['key' => $key, 'val' => (string)$val]);
        }

        echo json_encode(['success' => true, 'message' => 'Website settings updated successfully']);
    }
}
