/**
 * IndieThai Hub - Enhanced Mock Data
 * รวมข้อมูลเกมอินดี้ WebGL/HTML5 พร้อม Media Gallery รวมรูปและวิดีโอสำหรับ Dev
 */

export const INITIAL_GAMES = [
  {
    id: 'game-1',
    title: '2048 Cyber Siam',
    slug: '2048-cyber-siam',
    tagline: 'เกมพัซเซิลตัวเลขสไตล์ไซเบอร์พังก์ ผสมผสานศิลปะไทยร่วมสมัย',
    description: 'ท้าทายสมองด้วยการรวมบล็อกตัวเลขไซเบอร์พังก์สัญชาติไทย รวบรวมคะแนนสู่หลัก 2048 พร้อมเสียงซาวด์แทร็กอิเล็กทรอนิกส์ไทยเดิมเร้าใจ รันบน WebGL ลื่นไหล 60 FPS ปราศจากอาการกระตุก',
    developer: 'SiamPixel Studio',
    developerId: 'usr-dev-1',
    category: 'Puzzle',
    engine: 'Phaser.js',
    version: 'v1.4.2',
    rating: 4.9,
    ratingCount: 328,
    playCount: 18450,
    downloadCount: 3420,
    downloadSize: '45 MB',
    hasWebgl: true,
    hasPcDownload: true,
    webglUrl: 'https://play2048.co/',
    downloadUrl: 'https://github.com/gabrielecirulli/2048/archive/refs/heads/master.zip',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    // Media Gallery รวมทั้งวิดีโอและรูปภาพไว้ด้วยกัน ให้ Dev จัดการได้เอง
    mediaGallery: [
      {
        id: 'm1',
        type: 'video',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        title: 'วิดีโอตัวอย่างเกมเพลย์ 60FPS'
      },
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        title: 'หน้าจอหลักและโหมด Cyber Synth'
      },
      {
        id: 'm3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
        title: 'บรรยากาศศิลปะไทยร่วมสมัย'
      },
      {
        id: 'm4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
        title: 'ระบบการรวมบล็อก 2048'
      }
    ],
    promptPayNumber: '089-765-4321',
    status: 'approved',
    createdAt: '2026-10-15',
    tags: ['WebGL', 'Puzzle', 'Cyberpunk', 'Thai Audio'],
    featured: true,
    securityScan: {
      status: 'Clean',
      details: 'ผ่านการสแกนโค้ด WebGL และ Sandbox Security 100%',
      scannedAt: '2026-10-15 14:20'
    },
    reviews: [
      { id: 'rev-1', user: 'SomchaiGamer', rating: 5, comment: 'เกมลื่นมากครับ เพลงไทยประยุกต์เพราะสุดๆ ขอให้พัฒนาต่อไปครับ!', date: '2026-10-18' },
      { id: 'rev-2', user: 'ThaiCyberDev', rating: 5, comment: 'พัซเซิลสนุก สีสัน Cyberpunk ทำได้ดีมาก โดเนทสนับสนุนไปแล้วครับ', date: '2026-10-22' }
    ],
    bugReports: [
      { id: 'bug-1', user: 'TesterNoob', title: 'กดปุ่ม R รีสตาร์ตเร็วเกินไปอาจทำให้แต้มค้าง', status: 'fixed', date: '2026-10-25' }
    ]
  },
  {
    id: 'game-2',
    title: 'Hextris Neon Pulse',
    slug: 'hextris-neon-pulse',
    tagline: 'เกมหมุนหกเหลี่ยมจับคู่สีความเร็วสูง แสงนีออนสุดมันส์',
    description: 'ทดสอบปฏิกิริยาตอบสนองในการหมุนแกนหกเหลี่ยมเพื่อทำลายบล็อกนีออนก่อนที่พื้นที่จะเต็ม พัฒนาด้วย Canvas WebGL ลื่นไหล 60FPS มาพร้อมระบบ Combo เสียงบีตสังเคราะห์',
    developer: 'Bangkok Arcade Labs',
    developerId: 'usr-dev-2',
    category: 'Arcade',
    engine: 'Three.js / WebGL',
    version: 'v2.0.1',
    rating: 4.8,
    ratingCount: 215,
    playCount: 12600,
    downloadCount: 1850,
    downloadSize: '28 MB',
    hasWebgl: true,
    hasPcDownload: true,
    webglUrl: 'https://hextris.io/',
    downloadUrl: 'https://github.com/Hextris/hextris/archive/refs/heads/gh-pages.zip',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    mediaGallery: [
      {
        id: 'm1',
        type: 'video',
        url: 'https://www.youtube.com/embed/fJ9rUzIMcZQ?autoplay=1&mute=1',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
        title: 'Trailer จังหวะนีออนสุดมันส์'
      },
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
        title: 'แกนหมุนหกเหลี่ยมความเร็วสูง'
      },
      {
        id: 'm3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
        title: 'เอฟเฟกต์การระเบิดบล็อก'
      }
    ],
    promptPayNumber: '081-999-8877',
    status: 'approved',
    createdAt: '2026-10-20',
    tags: ['WebGL', 'Fast-paced', 'Arcade', 'Neon'],
    featured: true,
    securityScan: {
      status: 'Clean',
      details: 'ไม่พบโค้ดอันตราย รันใน Web Sandbox ได้อย่างปลอดภัย',
      scannedAt: '2026-10-20 09:12'
    },
    reviews: [
      { id: 'rev-3', user: 'SpeedRunner_TH', rating: 5, comment: 'เกมดูดเวลามากกก เล่นเพลินทั้งวัน', date: '2026-10-28' }
    ],
    bugReports: []
  },
  {
    id: 'game-3',
    title: 'Swoop 3D Siam Flight',
    slug: 'swoop-3d-siam-flight',
    tagline: 'บินทะยานผ่านเกาะลอยฟ้าและวิหารโบราณ กราฟิก 3D WebGL เต็มรูปแบบ',
    description: 'ควบคุมเครื่องบินเล็กโฉบเฉี่ยวเก็บไอเทมและทำเวลาในโลกเสมือนจริง 3 มิติ รันบนเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้ง พัฒนาด้วยเทคโนโลยี Unity WebGL ขั้นสูง รองรับทั้งจอยสติ๊กและคีย์บอร์ด',
    developer: 'CyberChon Dev',
    developerId: 'usr-dev-3',
    category: 'Action / Flight',
    engine: 'Unity WebGL',
    version: 'v1.1.0',
    rating: 4.9,
    ratingCount: 450,
    playCount: 24100,
    downloadCount: 5120,
    downloadSize: '210 MB',
    hasWebgl: true,
    hasPcDownload: true,
    webglUrl: 'https://swoop.seromi.net/',
    downloadUrl: 'https://github.com/seromi/swoop/archive/refs/heads/master.zip',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    mediaGallery: [
      {
        id: 'm1',
        type: 'video',
        url: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&mute=1',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
        title: 'วิดีโอเที่ยวบินสาธิตเกาะลอยฟ้า'
      },
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
        title: 'เครื่องบินเรโทรไซเบอร์ 3D'
      },
      {
        id: 'm3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
        title: 'วิหารลอยฟ้ายามพระอาทิตย์ตก'
      }
    ],
    promptPayNumber: '095-444-3322',
    status: 'approved',
    createdAt: '2026-10-25',
    tags: ['WebGL', '3D', 'Unity', 'Flight Simulator'],
    featured: true,
    securityScan: {
      status: 'Clean',
      details: 'ผ่านการตรวจสอบ WebAssembly และ Memory Leak ต่ำ',
      scannedAt: '2026-10-25 18:30'
    },
    reviews: [
      { id: 'rev-4', user: 'PilotKorn', rating: 5, comment: 'กราฟิก 3D บนเว็บทำได้ขนาดนี้เจ๋งมาก ภูมิใจกับผู้พัฒนาไทยครับ', date: '2026-10-30' }
    ],
    bugReports: [
      { id: 'bug-2', user: 'SkyWalker', title: 'เสียงเอฟเฟกต์ลมกระตุกเล็กน้อยเมื่อสลับหน้าจอ', status: 'investigating', date: '2026-11-02' }
    ]
  },
  {
    id: 'game-4',
    title: 'Ayutthaya Cyber Samurai: Prototype',
    slug: 'ayutthaya-cyber-samurai-prototype',
    tagline: 'เกมแอ็กชัน 2D Side-scroller ในบรรยากาศอยุธยาปี 2099',
    description: 'ตัวอย่างเกมต้นแบบ (Prototype) โครงการเกมสัญชาติไทยที่นำเสนอการต่อสู้ด้วยดาบไซเบอร์และเวทมนตร์โบราณ รันด้วย Godot 4 WebGL',
    developer: 'SiamPixel Studio',
    developerId: 'usr-dev-1',
    category: 'Action',
    engine: 'Godot HTML5',
    version: 'v0.8.5-alpha',
    rating: 4.6,
    ratingCount: 88,
    playCount: 5200,
    downloadCount: 940,
    downloadSize: '85 MB',
    hasWebgl: true,
    hasPcDownload: true,
    webglUrl: 'https://play2048.co/',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    mediaGallery: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
        title: 'ภาพคอนเซปต์ซามูไรอยุธยา 2099'
      },
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80',
        title: 'ฉากเมืองโบราณนีออน'
      }
    ],
    promptPayNumber: '089-765-4321',
    status: 'approved',
    createdAt: '2026-11-01',
    tags: ['Godot', 'Cyberpunk', 'Action', 'Thai Lore'],
    featured: false,
    securityScan: {
      status: 'Clean',
      details: 'ผ่านเกณฑ์ความปลอดภัย Godot Web Export',
      scannedAt: '2026-11-01 11:00'
    },
    reviews: [],
    bugReports: []
  }
];

export const MOCK_USERS = {
  player: {
    id: 'usr-player-1',
    username: 'NeonPlayer_TH',
    name: 'กิตติศักดิ์ นักเล่น',
    email: 'player@indiethai.hub',
    role: 'player',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 0,
    bio: 'ผู้เล่นเกมสายทดสอบ ชื่นชอบเกมอินดี้ฝีมือคนไทยและพร้อมซัพพอร์ต!',
    level: 12,
    badge: 'Beta Tester',
    isBanned: false
  },
  developer: {
    id: 'usr-dev-1',
    username: 'SiamPixelDev',
    name: 'สมชาย ผู้สร้างเกม',
    email: 'dev@indiethai.hub',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 150,
    studioName: 'SiamPixel Studio',
    promptPayNumber: '089-765-4321',
    bio: 'สตูดิโอเกมอินดี้ไทย มุ่งมั่นพัฒนาเกม WebGL คุณภาพสูงสู่ระดับสากล',
    verifiedDev: true,
    publishedGamesCount: 2,
    isBanned: false
  },
  admin: {
    id: 'usr-admin-1',
    username: 'IndieThaiAdmin',
    name: 'ผู้ดูแลระบบ IndieThai',
    email: 'admin@indiethai.hub',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 9999,
    bio: 'เจ้าหน้าที่ตรวจสอบคุณภาพ ความปลอดภัยของ WebGL Build และอนุมัติเกมขึ้นระบบ',
    superAdmin: true,
    isBanned: false
  }
};

export const MOCK_USERS_LIST = [
  {
    id: 'usr-player-1',
    username: 'NeonPlayer_TH',
    name: 'กิตติศักดิ์ นักเล่น',
    email: 'player@indiethai.hub',
    role: 'player',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 0,
    gamesPlayed: 42,
    isBanned: false,
    registeredAt: '2026-08-10'
  },
  {
    id: 'usr-dev-1',
    username: 'SiamPixelDev',
    name: 'สมชาย ผู้สร้างเกม (SiamPixel Studio)',
    email: 'dev@indiethai.hub',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 150,
    gamesPublished: 2,
    isBanned: false,
    registeredAt: '2026-09-01'
  },
  {
    id: 'usr-dev-2',
    username: 'BangkokArcade',
    name: 'วิชัย อาร์เคด (Bangkok Arcade Labs)',
    email: 'bkk.arcade@games.th',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 80,
    gamesPublished: 1,
    isBanned: false,
    registeredAt: '2026-09-15'
  },
  {
    id: 'usr-dev-3',
    username: 'CyberChonDev',
    name: 'ชลิต สายการบิน (CyberChon Dev)',
    email: 'chon.fly@cyber.th',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 40,
    gamesPublished: 1,
    isBanned: false,
    registeredAt: '2026-09-28'
  },
  {
    id: 'usr-admin-1',
    username: 'IndieThaiAdmin',
    name: 'ผู้ดูแลระบบ IndieThai',
    email: 'admin@indiethai.hub',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 9999,
    gamesPublished: 0,
    isBanned: false,
    registeredAt: '2026-01-01'
  }
];

export const GAME_ENGINES = [
  'All',
  'Unity WebGL',
  'Godot HTML5',
  'Phaser.js',
  'Three.js / WebGL',
  'Unreal Web'
];

export const GAME_CATEGORIES = [
  'All',
  'Puzzle',
  'Arcade',
  'Action / Flight',
  'Action',
  'Horror',
  'Racing',
  'Adventure'
];

export const GAME_JAM_DATA = {
  title: 'THAI CYBER INDIE GAME JAM 2026',
  theme: 'ธีมการแข่งขัน: "Siam Cyberpunk: ผสานอารยธรรมไทยสู่โลกไซเบอร์"',
  deadline: 'ปิดรับผลงาน WebGL ในอีก 5 วัน 14 ชั่วโมง',
  prizePool: 'รางวัลรวมมูลค่า 100,000 บาท + 2,000 Hub Tokens',
  submissionsCount: 28,
  badge: 'GAME JAM EVENT'
};

export const TOKEN_COST_PER_GAME = 50;
