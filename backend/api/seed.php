<?php
// backend/api/seed.php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
handleCors();

try {
    $db = Database::getConnection();

    // 1. CREATE TABLES
    $queries = [
        "CREATE TABLE IF NOT EXISTS admin_roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role_name VARCHAR(50) NOT NULL UNIQUE,
            permissions TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role_id INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (role_id) REFERENCES admin_roles(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS comics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            issue_number INT NOT NULL UNIQUE,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            slug VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            author VARCHAR(100) DEFAULT 'Ritayan Studio',
            status ENUM('draft', 'published', 'unpublished') DEFAULT 'draft',
            cover_image VARCHAR(255),
            release_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS comic_pages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            comic_id INT NOT NULL,
            page_number INT NOT NULL,
            language_code VARCHAR(10) DEFAULT 'HI',
            image_path VARCHAR(255) NOT NULL,
            page_title VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS characters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            title VARCHAR(150),
            avatar_type VARCHAR(50) DEFAULT 'Avatar',
            character_category VARCHAR(50) DEFAULT 'FISH',
            yuga VARCHAR(50) DEFAULT 'Satya Yuga',
            theme_color VARCHAR(50) DEFAULT '#F59E0B',
            bg_gradient TEXT,
            avatar_image VARCHAR(255),
            weapon_symbol VARCHAR(100),
            power_level INT DEFAULT 95,
            description TEXT,
            lore_details TEXT,
            associated_slug VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS comic_metadata (
            id INT AUTO_INCREMENT PRIMARY KEY,
            comic_id INT NOT NULL,
            key_name VARCHAR(50) NOT NULL,
            value_content TEXT,
            FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS media (
            id INT AUTO_INCREMENT PRIMARY KEY,
            file_name VARCHAR(255) NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            file_size INT,
            file_type VARCHAR(50),
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS reading_progress (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            session_token VARCHAR(255),
            comic_id INT NOT NULL,
            current_page INT DEFAULT 1,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY user_comic_idx (session_token, comic_id),
            FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS reading_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            session_token VARCHAR(255),
            comic_id INT NOT NULL,
            page_reached INT DEFAULT 1,
            completed TINYINT(1) DEFAULT 0,
            read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS analytics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_type VARCHAR(50) NOT NULL,
            comic_id INT,
            user_id INT,
            ip_address VARCHAR(45),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS website_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(100) NOT NULL UNIQUE,
            setting_value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT,
            action VARCHAR(100) NOT NULL,
            details TEXT,
            ip_address VARCHAR(45),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
    ];

    foreach ($queries as $q) {
        $db->exec($q);
    }

    // Ensure character_category column exists on existing table
    try {
        $db->exec("ALTER TABLE characters ADD COLUMN character_category VARCHAR(50) DEFAULT 'FISH' AFTER avatar_type");
    } catch (Exception $e) {
        // Column already exists
    }

    try {
        $db->exec("ALTER TABLE comic_pages ADD COLUMN language_code VARCHAR(10) DEFAULT 'HI' AFTER page_number");
    } catch (Exception $e) {
        // Column already exists
    }

    // 2. SEED ADMIN ROLE & ADMIN USER
    $db->exec("INSERT IGNORE INTO admin_roles (id, role_name, permissions) VALUES (1, 'Super Admin', '*');");
    
    $adminPasswordHash = password_hash('admin123', PASSWORD_BCRYPT);
    $adminStmt = $db->prepare("
        INSERT INTO admins (username, email, password_hash, role_id) 
        VALUES ('admin', 'admin@ritayan.com', :pwd, 1) 
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    ");
    $adminStmt->execute(['pwd' => $adminPasswordHash]);

    // Seed Sample Users
    $userPwd = password_hash('user123', PASSWORD_BCRYPT);
    $userStmt = $db->prepare("
        INSERT INTO users (name, email, password_hash) 
        VALUES ('Aarav Sharma', 'aarav@example.com', :pwd1), ('Ananya Roy', 'ananya@example.com', :pwd2) 
        ON DUPLICATE KEY UPDATE name=VALUES(name)
    ");
    $userStmt->execute(['pwd1' => $userPwd, 'pwd2' => $userPwd]);

    // 3. SEED SETTINGS
    $settings = [
        'site_title' => 'RITAYAN — युगों की गाथा',
        'hero_title' => 'RITAYAN: युगों की गाथा',
        'hero_subtitle' => 'Experience the grand epic of Indian mythology brought to life in interactive digital 3D graphic novels.',
        'featured_issue_id' => '1',
        'about_text' => 'RITAYAN is a landmark digital comic platform dedicated to rendering ancient Vedic and Puranic chronicles into breathtaking visual graphic novel format.',
        'contact_email' => 'contact@ritayan.com',
        'instagram_url' => 'https://instagram.com/ritayan_comics',
        'twitter_url' => 'https://twitter.com/ritayan_comics',
        'youtube_url' => 'https://youtube.com/@ritayan'
    ];

    $setStmt = $db->prepare("INSERT INTO website_settings (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
    foreach ($settings as $k => $v) {
        $setStmt->execute(['k' => $k, 'v' => $v]);
    }

    // 4. SEED CHARACTER CODEX DATA
    $db->exec("TRUNCATE TABLE characters");
    $characters = [
        [
            'name' => 'MATSYA',
            'title' => 'The Primordial Fish Avatar',
            'avatar_type' => 'Dashavatara #1',
            'character_category' => 'FISH',
            'yuga' => 'Satya Yuga',
            'theme_color' => '#0284C7',
            'bg_gradient' => 'linear-gradient(135deg, #020617 0%, #0369A1 50%, #0284C7 100%)',
            'weapon_symbol' => 'Golden Horn & Sacred Vedas',
            'power_level' => 98,
            'description' => 'The divine fish incarnation who glides through the primordial ocean, creating water bubbles and light rays while rescuing King Manu\'s ark during Mahapralaya.',
            'lore_details' => 'When the demonic titan Hayagriva stole the Vedas, dark chaos threatened creation. Appearing initially as a tiny golden fish in King Manu\'s palms, Matsya grew exponentially into a colossal horned leviathan. Tying the ark to His horn using serpent Vasuki, He navigated the deluge and vanquished the demon to restore divine wisdom.',
            'avatar_image' => 'characters/matsya.jpg',
            'associated_slug' => 'ritayan-001'
        ],
        [
            'name' => 'KURMA',
            'title' => 'The Cosmic Tortoise',
            'avatar_type' => 'Dashavatara #2',
            'character_category' => 'TORTOISE',
            'yuga' => 'Satya Yuga',
            'theme_color' => '#F59E0B',
            'bg_gradient' => 'linear-gradient(135deg, #180202 0%, #78350F 50%, #B45309 100%)',
            'weapon_symbol' => 'Indestructible Shell & Vortex',
            'power_level' => 97,
            'description' => 'The divine tortoise avatar whose impenetrable golden shell bears the staggering weight of Mount Mandara during the churning of the Ocean of Milk.',
            'lore_details' => 'As Devas and Asuras attempted to churn the Ocean of Milk to extract Amrita, the massive pivot of Mount Mandara began sinking into the ocean bed. Lord Vishnu assumed the indestructible Kurma incarnation spanning millions of leagues, bearing the staggering friction of the churning mountain upon His shell.',
            'avatar_image' => 'characters/kurma.jpg',
            'associated_slug' => 'ritayan-002'
        ],
        [
            'name' => 'VARAHA',
            'title' => 'The Mighty Earth Boar',
            'avatar_type' => 'Dashavatara #3',
            'character_category' => 'BOAR',
            'yuga' => 'Satya Yuga',
            'theme_color' => '#10B981',
            'bg_gradient' => 'linear-gradient(135deg, #022C22 0%, #064E3B 50%, #047857 100%)',
            'weapon_symbol' => 'Golden Tusks & Bedrock Tremors',
            'power_level' => 99,
            'description' => 'The mighty boar incarnation who ruptures Rasatala with seismic earth cracking shockwaves to rescue Mother Earth from the abyssal ocean.',
            'lore_details' => 'Emerging as a microscopic form from Brahma\'s nostril, Varaha expanded to cosmic magnitude with a roar that vibrated across realms. Plunging into Rasatala, He fought the tyrant Hiranyaksha in underwater combat lasting a thousand years before gently carrying Mother Earth upon His gleaming tusks.',
            'avatar_image' => 'characters/varaha.jpg',
            'associated_slug' => 'ritayan-003'
        ],
        [
            'name' => 'NARASIMHA',
            'title' => 'The Invincible Lion Avatar',
            'avatar_type' => 'Dashavatara #4',
            'character_category' => 'LION',
            'yuga' => 'Satya Yuga',
            'theme_color' => '#EF4444',
            'bg_gradient' => 'linear-gradient(135deg, #450A0A 0%, #991B1B 50%, #DC2626 100%)',
            'weapon_symbol' => 'Fiery Mane & Lion Claws',
            'power_level' => 100,
            'description' => 'The fierce lion-man avatar who bursts from a stone pillar with roaring flames and lion claw slashes to vanquish Hiranyakashipu at twilight.',
            'lore_details' => 'Bound by Brahma\'s boon that he could not be killed by man or beast, inside or outside, by day or night, nor by any weapon, Hiranyakashipu tormented devout Prahlada. At dusk, Lord Narasimha erupted from a stone pillar — neither man nor beast — placing the demon on His lap at the threshold to tear him with His bare claws.',
            'avatar_image' => 'characters/narasimha.jpg',
            'associated_slug' => 'ritayan-004'
        ],
        [
            'name' => 'VASUKI',
            'title' => 'The King of Serpents',
            'avatar_type' => 'Naga King',
            'character_category' => 'SERPENT',
            'yuga' => 'Satya Yuga',
            'theme_color' => '#14B8A6',
            'bg_gradient' => 'linear-gradient(135deg, #042F2E 0%, #115E59 50%, #0D9488 100%)',
            'weapon_symbol' => 'Slithering Serpent Coils & Venom Hiss',
            'power_level' => 93,
            'description' => 'The magnificent thousand-hooded Naga King whose slithering serpents and venomous hiss wrapped around Mount Mandara for Samudra Manthan.',
            'lore_details' => 'Demonstrating heroic fortitude, Vasuki allowed Himself to be wrapped around Mount Mandara. As the Devas pulled His tail and Asuras His head, the slithering friction caused Him to emit noxious venom, testing the endurance of the universe before Shiva drank the poison.',
            'avatar_image' => 'characters/vasuki.jpg',
            'associated_slug' => 'ritayan-002'
        ],
        [
            'name' => 'KING PARIKSHIT',
            'title' => 'Last Pandava King & Great Devotee',
            'avatar_type' => 'Kuru Dynasty King',
            'character_category' => 'ROYAL_DEVOTEE',
            'yuga' => 'Dvapara / Kali Yuga',
            'theme_color' => '#8B5CF6',
            'bg_gradient' => 'linear-gradient(135deg, #2E1065 0%, #5B21B6 50%, #7C3AED 100%)',
            'weapon_symbol' => 'Royal Pandava Crown & Sacred Lotus',
            'power_level' => 91,
            'description' => 'The noble son of Abhimanyu and last ruler of the Pandava lineage, famed for his unwavering devotion and listening to Shrimad Bhagavata Purana at Sukatal.',
            'lore_details' => 'Saved in Uttara\'s womb by Lord Krishna\'s Sudarshana Chakra, King Parikshit ruled Hastinapur with supreme righteousness. When cursed to be bitten by serpent Takshaka in seven days, he renounced his throne and sat on the banks of the Ganga to absorb the sublime nectar of Krishna\'s leelas from Sage Shukadeva.',
            'avatar_image' => 'characters/parikshit.jpg',
            'associated_slug' => 'ritayan-001'
        ]
    ];

    $charStmt = $db->prepare("
        INSERT INTO characters (name, title, avatar_type, character_category, yuga, theme_color, bg_gradient, avatar_image, weapon_symbol, power_level, description, lore_details, associated_slug)
        VALUES (:name, :title, :avatar_type, :character_category, :yuga, :theme_color, :bg_gradient, :avatar_image, :weapon_symbol, :power_level, :description, :lore_details, :associated_slug)
        ON DUPLICATE KEY UPDATE title=VALUES(title), character_category=VALUES(character_category), avatar_image=VALUES(avatar_image), description=VALUES(description), lore_details=VALUES(lore_details)
    ");

    foreach ($characters as $ch) {
        $charStmt->execute([
            'name' => $ch['name'],
            'title' => $ch['title'],
            'avatar_type' => $ch['avatar_type'],
            'character_category' => $ch['character_category'],
            'yuga' => $ch['yuga'],
            'theme_color' => $ch['theme_color'],
            'bg_gradient' => $ch['bg_gradient'],
            'avatar_image' => $ch['avatar_image'],
            'weapon_symbol' => $ch['weapon_symbol'],
            'power_level' => $ch['power_level'],
            'description' => $ch['description'],
            'lore_details' => $ch['lore_details'],
            'associated_slug' => $ch['associated_slug']
        ]);
    }

    // 5. HELPER FUNCTION TO GENERATE STYLISH SVG COMIC PAGES
    function generateComicSvg($title, $subtitle, $pageNo, $totalPages, $bgGradient, $themeColor, $dialogue, $narrative) {
        $width = 800;
        $height = 1130;

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $width $height" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{$bgGradient[0]}"/>
      <stop offset="50%" stop-color="{$bgGradient[1]}"/>
      <stop offset="100%" stop-color="{$bgGradient[2]}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="$width" height="$height" fill="url(#bg)"/>

  <rect x="25" y="25" width="750" height="1080" fill="none" stroke="url(#gold)" stroke-width="4" rx="10"/>
  <rect x="35" y="35" width="730" height="1060" fill="none" stroke="{$themeColor}" stroke-width="1.5" rx="8" opacity="0.6"/>

  <circle cx="45" cy="45" r="12" fill="url(#gold)" opacity="0.8"/>
  <circle cx="755" cy="45" r="12" fill="url(#gold)" opacity="0.8"/>
  <circle cx="45" cy="1085" r="12" fill="url(#gold)" opacity="0.8"/>
  <circle cx="755" cy="1085" r="12" fill="url(#gold)" opacity="0.8"/>

  <path d="M 150 40 L 650 40 L 630 85 L 170 85 Z" fill="#111827" stroke="url(#gold)" stroke-width="2"/>
  <text x="400" y="68" fill="#FDE68A" font-family="'Cinzel', 'Georgia', serif" font-size="22" font-weight="bold" text-anchor="middle" letter-spacing="3">$title — $subtitle</text>

  <g transform="translate(60, 110)">
    <rect width="680" height="380" fill="#030712" rx="6" stroke="#4B5563" stroke-width="2"/>
    <circle cx="340" cy="190" r="140" fill="{$themeColor}" opacity="0.15" filter="url(#glow)"/>
    <path d="M 340 70 L 420 310 L 260 310 Z" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.4"/>
    <circle cx="340" cy="190" r="60" fill="none" stroke="#FDE68A" stroke-width="2"/>
    <circle cx="340" cy="190" r="12" fill="#F59E0B"/>
    
    <rect x="40" y="30" width="300" height="85" fill="#1F2937" rx="8" stroke="url(#gold)" stroke-width="1.5" opacity="0.95"/>
    <text x="55" y="55" fill="#F3F4F6" font-family="sans-serif" font-size="14" font-weight="bold">CHAPTER VOICE</text>
    <text x="55" y="80" fill="#9CA3AF" font-family="sans-serif" font-size="13">"$narrative"</text>

    <path d="M 360 260 Q 400 230 460 240 Q 520 250 560 290 Q 500 310 440 295 Z" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
    <text x="460" y="275" fill="#78350F" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">"$dialogue"</text>
  </g>

  <g transform="translate(60, 510)">
    <rect width="330" height="480" fill="#030712" rx="6" stroke="#4B5563" stroke-width="2"/>
    <path d="M 50 120 C 120 40, 210 200, 280 100" fill="none" stroke="{$themeColor}" stroke-width="4"/>
    <circle cx="165" cy="240" r="80" fill="none" stroke="url(#gold)" stroke-dasharray="8 4" stroke-width="2"/>
    <text x="165" y="440" fill="#E5E7EB" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">RITAYAN MYTHOS PANEL A</text>
  </g>

  <g transform="translate(410, 510)">
    <rect width="330" height="480" fill="#030712" rx="6" stroke="#4B5563" stroke-width="2"/>
    <rect x="30" y="30" width="270" height="200" fill="{$themeColor}" opacity="0.2" rx="4"/>
    <polygon points="165,50 240,180 90,180" fill="url(#gold)" opacity="0.5"/>
    <rect x="20" y="360" width="290" height="90" fill="#111827" rx="6" stroke="#D97706" stroke-width="1"/>
    <text x="35" y="388" fill="#FDE68A" font-family="sans-serif" font-size="13" font-weight="bold">GAATHA ARCHIVE</text>
    <text x="35" y="412" fill="#D1D5DB" font-family="sans-serif" font-size="12">When dark clouds gather over time, the eternal avatar emerges.</text>
  </g>

  <line x1="60" y1="1055" x2="740" y2="1055" stroke="url(#gold)" stroke-width="1.5"/>
  <text x="400" y="1078" fill="#F3F4F6" font-family="'Cinzel', Georgia, serif" font-size="15" font-weight="bold" text-anchor="middle">— Page $pageNo of $totalPages —</text>
</svg>
SVG;
    }

    // HELPER TO GENERATE COVER SVG
    function generateCoverSvg($title, $subtitle, $issueNo, $bgGrad, $accentColor) {
        $width = 800;
        $height = 1130;

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $width $height" width="100%" height="100%">
  <defs>
    <linearGradient id="coverBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{$bgGrad[0]}"/>
      <stop offset="40%" stop-color="{$bgGrad[1]}"/>
      <stop offset="100%" stop-color="{$bgGrad[2]}"/>
    </linearGradient>
    <linearGradient id="goldCover" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <filter id="dropGlow">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#F59E0B" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="$width" height="$height" fill="url(#coverBg)"/>
  
  <rect x="20" y="20" width="760" height="1090" fill="none" stroke="url(#goldCover)" stroke-width="6" rx="12"/>
  <rect x="32" y="32" width="736" height="1066" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.5" rx="8"/>

  <rect x="50" y="50" width="700" height="90" fill="#0F172A" rx="8" stroke="url(#goldCover)" stroke-width="2"/>
  <text x="400" y="90" fill="#FDE68A" font-family="Georgia, serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="4">R I T A Y A N</text>
  <text x="400" y="120" fill="#9CA3AF" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="6">CONNECTED DIGITAL COMIC PLATFORM</text>

  <circle cx="400" cy="520" r="230" fill="none" stroke="url(#goldCover)" stroke-width="3" filter="url(#dropGlow)"/>
  <circle cx="400" cy="520" r="210" fill="{$accentColor}" opacity="0.2"/>
  <polygon points="400,340 520,620 280,620" fill="url(#goldCover)" opacity="0.75"/>
  <polygon points="400,700 280,420 520,420" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.6"/>

  <rect x="60" y="160" width="130" height="50" fill="#DC2626" rx="6"/>
  <text x="125" y="192" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">ISSUE #$issueNo</text>

  <rect x="50" y="800" width="700" height="230" fill="#0B0F19" fill-opacity="0.9" rx="12" stroke="url(#goldCover)" stroke-width="2"/>
  <text x="400" y="870" fill="#FFFFFF" font-family="Georgia, serif" font-size="52" font-weight="bold" text-anchor="middle" letter-spacing="2">$title</text>
  <text x="400" y="930" fill="#F59E0B" font-family="'Noto Sans Devanagari', sans-serif" font-size="34" font-weight="bold" text-anchor="middle">$subtitle</text>
  <text x="400" y="980" fill="#9CA3AF" font-family="sans-serif" font-size="16" text-anchor="middle">RITAYAN STUDIOS GRAPHIC NOVEL</text>
</svg>
SVG;
    }

    // 6. SEED COMICS & GENERATE MULTI-LINGUAL FILES (HI, EN, MR)
    $comicsData = [
        [
            'issue_number' => 1,
            'title' => 'MATSYA',
            'subtitle' => 'प्रलय से पहले',
            'slug' => 'ritayan-001',
            'description' => 'As the cosmic deluge threatens all life, Manu meets a small golden fish that grows into the mighty avatar destined to save creation.',
            'status' => 'published',
            'release_date' => '2026-01-15',
            'bgGrad' => ['#020617', '#0F172A', '#1E3A8A'],
            'themeColor' => '#2563EB',
            'pages_multilingual' => [
                'HI' => [
                    ['title' => 'राजकीय तर्पण', 'dialogue' => 'हे सूक्ष्म मत्स्य! डरो मत, मैं तुम्हारी रक्षा करूंगा।', 'narrative' => 'राजा मनु कृतमाला नदी में अर्घ्य दे रहे थे, इस अलौकिक चमत्कार से अनभिज्ञ।'],
                    ['title' => 'मत्स्य का तीव्र विकास', 'dialogue' => 'हे राजन! यह कमंडल मेरे लिए छोटा पड़ रहा है, मुझे विशाल सरोवर में रखो!', 'narrative' => 'रातों-रात मत्स्य भगवान का आकार दिव्य रूप से बढ़ता गया।'],
                    ['title' => 'महाप्रलय की चेतावनी', 'dialogue' => 'विशाल नौका बनाओ, सात दिनों में प्रलय का जल तीनों लोकों को डुबा देगा।', 'narrative' => 'भगवान ने अपने विशाल शृंगयुक्त मत्स्य रूप के दर्शन दिए और सृष्टि के बीज संचित करने का आदेश दिया।'],
                    ['title' => 'महाप्रलय का तूफान', 'dialogue' => 'नागपाश से इस नौका को मेरे सींग पर बांध दो!', 'narrative' => 'ब्रह्मांडीय प्रलय का जल चारों ओर उमड़ पड़ा, और भगवान मत्स्य ने नौका का मार्गदर्शन किया।'],
                    ['title' => 'वेदों का पुनरुद्धार', 'dialogue' => 'सत्य ज्ञान पुनः सुरक्षित हो गया!', 'narrative' => 'मत्स्य रूप में भगवान विष्णु ने हयग्रीव दानव का वध कर वेदों की पुनर्स्थापना की।']
                ],
                'EN' => [
                    ['title' => 'The Royal Ritual', 'dialogue' => 'O Little Fish, fear not! I shall protect you in my vessel.', 'narrative' => 'King Manu gathered sacred water from the river Kritamala, unaware of the cosmic miracle in his hands.'],
                    ['title' => 'The Rapid Growth', 'dialogue' => 'King! The pitcher is too small for me now. Grant me a lake!', 'narrative' => 'Overnight, the divine Matsya expanded beyond the bounds of mortal vessels.'],
                    ['title' => 'The Great Warning', 'dialogue' => 'Build a vast ship, for seven days hence, cosmic waters will engulf the three worlds.', 'narrative' => 'The Lord revealed His majestic horned form and commanded Manu to gather the seeds of life.'],
                    ['title' => 'The Cosmic Storm', 'dialogue' => 'Bind the vessel to my horn using the serpent king Vasuki!', 'narrative' => 'Dark thunder roared across space as the primordial ocean dissolved creation.'],
                    ['title' => 'Recovery of Vedas', 'dialogue' => 'The sacred knowledge is preserved for the next Manvantara!', 'narrative' => 'Matsya vanquished the demon Hayagriva and restored light to the cosmos.']
                ],
                'MR' => [
                    ['title' => 'राजकीय तर्पण विधी', 'dialogue' => 'हे लहान माशा, घाबरू नकोस! मी माझे पात्रामध्ये तुझे रक्षण करेन.', 'narrative' => 'राजा मनु कृतमाला नदीत अर्घ्य देत होते, या अलौकिक चमत्काराची त्यांना कल्पना नव्हती.'],
                    ['title' => 'मत्स्याची जलद वाढ', 'dialogue' => 'हे राजा! हे भांडे आता माझ्यासाठी खूप लहान आहे. मला मोठ्या तलावात ठेवा!', 'narrative' => 'एका रात्रीत मत्स्य भगवंताचा आकार अद्भूतपणे वाढत गेला.'],
                    ['title' => 'महाप्रलयाची चेतावणी', 'dialogue' => 'एक मोठी नौका तयार करा, सात दिवसांनी प्रलयाचे पाणी तिन्ही लोकांस कवेत घेईल.', 'narrative' => 'भगवंतांनी आपल्या विशाल शिंग असलेल्या मत्स्य रूपाचे दर्शन दिले व सृष्टीचे बीज साठवण्याची आज्ञा दिली.'],
                    ['title' => 'महाप्रलयाचे वादळ', 'dialogue' => 'नागराज वासुकीच्या साहाय्याने ही नौका माझ्या शिंगाला बांधा!', 'narrative' => 'प्रलयाच्या महासागरात मत्स्य भगवंतांनी नौकेला सुखरूप मार्ग दाखवला.'],
                    ['title' => 'वेदांचे पुनरुज्जीवन', 'dialogue' => 'पवित्र ज्ञान पुढील मन्वंतरासाठी सुरक्षित झाले आहे!', 'narrative' => 'मत्स्य अवतारात श्रीविष्णूंनी हयग्रीव राक्षसाचा वध करून वेदांची पुनर्रचना केली.']
                ]
            ]
        ],
        [
            'issue_number' => 2,
            'title' => 'KURMA',
            'subtitle' => 'समुद्र मंथन',
            'slug' => 'ritayan-002',
            'description' => 'The Devas and Asuras churn the ocean of milk using Mount Mandara, supported on the indestructible back of the divine Tortoise.',
            'status' => 'published',
            'release_date' => '2026-03-10',
            'bgGrad' => ['#180202', '#450A0A', '#78350F'],
            'themeColor' => '#D97706',
            'pages_multilingual' => [
                'HI' => [
                    ['title' => 'महा संधि', 'dialogue' => 'अमृत प्राप्ति के लिए हमें क्षीर सागर का मंथन करना होगा!', 'narrative' => 'देवराज इंद्र और राजा बलि ने अमृत प्राप्त करने के लिए संधि की।'],
                    ['title' => 'मंदराचल का डूबना', 'dialogue' => 'पर्वत समुद्र की गहराई में डूब रहा है! सब व्यर्थ हो जाएगा!', 'narrative' => 'मंथन के भार से मंदराचल पर्वत रसातल में धंसने लगा।'],
                    ['title' => 'अक्षय पृष्ठ का आधार', 'dialogue' => 'मेरी पीठ पर मंदराचल को स्थापित करो, मंथन प्रारंभ करो!', 'narrative' => 'भगवान विष्णु ने विशाल कछुए का रूप धारण कर पर्वत को अपनी पीठ पर धारण किया।'],
                    ['title' => 'हलाहल विष पान', 'dialogue' => 'हे महादेव! इस भयंकर विष की ज्वाला से हमारी रक्षा करें!', 'narrative' => 'सृष्टि की रक्षा के लिए भगवान शिव ने हलाहल विष को अपने कंठ में धारण किया।']
                ],
                'EN' => [
                    ['title' => 'The Great Alliance', 'dialogue' => 'We must churn the Ocean of Milk to regain Amrita!', 'narrative' => 'Indra and Bali agreed to unite their forces to extract the elixir of immortality.'],
                    ['title' => 'Sinking of Mandara', 'dialogue' => 'The mountain sinks into the seabed! All hope is lost!', 'narrative' => 'Mount Mandara cracked the earth as it collapsed under immense weight.'],
                    ['title' => 'The Shell of Salvation', 'dialogue' => 'Rest the cosmic pivot upon my back. Churn with all your might!', 'narrative' => 'Lord Vishnu assumed the massive Kurma incarnation to stabilize the axis.'],
                    ['title' => 'Halahala Poison', 'dialogue' => 'Mahadeva! Save us from the burning venom!', 'narrative' => 'Lord Shiva drank the deadly poison to protect the universe.']
                ],
                'MR' => [
                    ['title' => 'महा युती', 'dialogue' => 'अमृतासाठी आपल्याला समुद्र मंथन करावेच लागेल!', 'narrative' => 'देवराज इंद्र व राजा बली यांनी अमृत मिळवण्यासाठी युती केली.'],
                    ['title' => 'मंदराचल पर्वत बुडणे', 'dialogue' => 'पर्वत समुद्राच्या तळाशी बुडत आहे! सर्व प्रयत्न निष्फळ ठरतील!', 'narrative' => 'मंदराचल पर्वत महासागराच्या तळाशी खचू लागला.'],
                    ['title' => 'अजिंक्य पाठीचा आधार', 'dialogue' => 'माझ्या पाठीवर पर्वताची स्थापना करा, मंथन पुन्हा सुरू करा!', 'narrative' => 'श्रीविष्णूंनी विशाल कूर्म अवतार धारण करून पर्वताचा तोल सावरला.'],
                    ['title' => 'हलाहल विष प्राशन', 'dialogue' => 'हे महादेवा! या भयंकर विषाच्या ज्वालांपासून आमचे रक्षण करा!', 'narrative' => 'सृष्टीच्या रक्षणासाठी भगवान शिवांनी हलाहल विष प्राशन केले.']
                ]
            ]
        ],
        [
            'issue_number' => 3,
            'title' => 'VARAHA',
            'subtitle' => 'भू-उद्धार',
            'slug' => 'ritayan-003',
            'description' => 'When Hiranyaksha drags Mother Earth into the depths of the cosmic abyss, the mighty Boar avatar descends to rescue her.',
            'status' => 'draft',
            'release_date' => '2026-06-01',
            'bgGrad' => ['#022C22', '#064E3B', '#14532D'],
            'themeColor' => '#16A34A',
            'pages_multilingual' => [
                'HI' => [
                    ['title' => 'पृथ्वी का रसातल गमन', 'dialogue' => 'हिरण्याक्ष ने भूदेवी को रसातल में बंद कर दिया है!', 'narrative' => 'असुर हिरण्याक्ष ने संपूर्ण ब्रह्मांड की शांति को चुनौती दी।'],
                    ['title' => 'वराह अवतार का प्राकट्य', 'dialogue' => 'वराह भगवान की गर्जना से दिशाएं कांप उठीं!', 'narrative' => 'ब्रह्मा जी की नासिका से दिव्य वराह रूप प्रकट हुआ और पृथ्वी का उद्धार किया।']
                ],
                'EN' => [
                    ['title' => 'Earth Plunged', 'dialogue' => 'Bhudevi is locked beneath the abyssal cosmic waters!', 'narrative' => 'The tyrant Hiranyaksha challenged the authority of the universe.'],
                    ['title' => 'Descent of Varaha', 'dialogue' => 'Roar of the cosmic Boar shakes the cosmos!', 'narrative' => 'From Brahma\'s nostril emerged the formidable Varaha incarnation.']
                ],
                'MR' => [
                    ['title' => 'पृथ्वीचे रसातळ गमन', 'dialogue' => 'हिरण्याक्षाने भूदेवीला अथांग समुद्राच्या तळाशी लपवले आहे!', 'narrative' => 'दैत्य हिरण्याक्षाने पृथ्वीला रसातळाला नेले.'],
                    ['title' => 'वराह अवताराचे आगमन', 'dialogue' => 'वराह भगवंतांच्या गर्जनेने ब्रह्मांड थरथरले!', 'narrative' => 'ब्रह्मदेवांच्या नासिकेतून वराह रूप प्रकट झाले आणि त्यांनी पृथ्वीचा उद्धार केला.']
                ]
            ]
        ]
    ];

    $comicStmt = $db->prepare("
        INSERT INTO comics (issue_number, title, subtitle, slug, description, author, status, cover_image, release_date) 
        VALUES (:issue_number, :title, :subtitle, :slug, :description, 'Ritayan Studio', :status, :cover_image, :release_date) 
        ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), description=VALUES(description), status=VALUES(status), cover_image=VALUES(cover_image)
    ");

    $pageClearStmt = $db->prepare("DELETE FROM comic_pages WHERE comic_id = :comic_id");
    $pageInsertStmt = $db->prepare("
        INSERT INTO comic_pages (comic_id, page_number, language_code, image_path, page_title) 
        VALUES (:comic_id, :page_number, :language_code, :image_path, :page_title)
    ");

    foreach ($comicsData as $c) {
        $slug = $c['slug'];
        $comicDir = __DIR__ . '/../uploads/comics/' . $slug;
        
        $coverSvgContent = generateCoverSvg($c['title'], $c['subtitle'], $c['issue_number'], $c['bgGrad'], $c['themeColor']);
        $coverPath = $comicDir . '/cover.svg';
        if (!file_exists($comicDir)) {
            mkdir($comicDir, 0777, true);
        }
        file_put_contents($coverPath, $coverSvgContent);
        $relativeCover = 'comics/' . $slug . '/cover.svg';

        $comicStmt->execute([
            'issue_number' => $c['issue_number'],
            'title' => $c['title'],
            'subtitle' => $c['subtitle'],
            'slug' => $slug,
            'description' => $c['description'],
            'status' => $c['status'],
            'cover_image' => $relativeCover,
            'release_date' => $c['release_date']
        ]);

        $getIdStmt = $db->prepare("SELECT id FROM comics WHERE slug = :slug");
        $getIdStmt->execute(['slug' => $slug]);
        $comicId = $getIdStmt->fetchColumn();

        $pageClearStmt->execute(['comic_id' => $comicId]);

        foreach ($c['pages_multilingual'] as $langCode => $pageList) {
            $langDir = $comicDir . '/pages/' . strtolower($langCode);
            if (!file_exists($langDir)) {
                mkdir($langDir, 0777, true);
            }

            $totalPages = count($pageList);
            foreach ($pageList as $idx => $p) {
                $pageNo = $idx + 1;
                $pageSvgContent = generateComicSvg($c['title'], $c['subtitle'], $pageNo, $totalPages, $c['bgGrad'], $c['themeColor'], $p['dialogue'], $p['narrative']);
                $pageFilename = 'page-' . str_pad($pageNo, 3, '0', STR_PAD_LEFT) . '.svg';
                file_put_contents($langDir . '/' . $pageFilename, $pageSvgContent);
                $relativePagePath = 'comics/' . $slug . '/pages/' . strtolower($langCode) . '/' . $pageFilename;

                $pageInsertStmt->execute([
                    'comic_id' => $comicId,
                    'page_number' => $pageNo,
                    'language_code' => $langCode,
                    'image_path' => $relativePagePath,
                    'page_title' => $p['title']
                ]);
            }
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Database initialized, character codex seeded with King Parikshit, Vasuki, Matsya, Kurma, Varaha, Narasimha!'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Seed script failed: ' . $e->getMessage()]);
}
