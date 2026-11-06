/**
 * IndieThai Hub - Enhanced Mock Data
 * รวมข้อมูลเกมอินดี้ WebGL/HTML5 พร้อม Media Gallery, Controls Guide, System Requirements และ Patch Notes
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
      }
    ],
    // itch.io & CrazyGames style controls
    controls: [
      { key: 'ปุ่มลูกศร (Arrow Keys)', action: 'เลื่อนบล็อกตัวเลข ขึ้น/ลง/ซ้าย/ขวา' },
      { key: '[ W ] [ A ] [ S ] [ D ]', action: 'เลื่อนบล็อกตัวเลขทางเลือก' },
      { key: '[ R ]', action: 'รีสตาร์ตกระดานใหม่' }
    ],
    // Steam style requirements
    requirements: {
      os: 'Windows 10 / 11, macOS, Linux',
      browser: 'Google Chrome, Microsoft Edge, Firefox, Safari (รองรับ WebGL 2.0)',
      memory: 'RAM 2 GB ขึ้นไป',
      graphics: 'รองรับการเรนเดอร์ WebGL / Hardware Acceleration'
    },
    // itch.io & Steam devlog patch notes
    patchNotes: [
      {
        version: 'v1.4.2',
        date: '2026-10-25',
        title: 'แพตช์ปรับปรุงประสิทธิภาพและเสียงสังเคราะห์',
        details: 'เพิ่มเพลงพื้นหลังแบบ Thai Synthwave 2 เพลงใหม่, ปรับปรุงการตอบสนองของการสัมผัสบนมือถือ และลดการใช้หน่วยความจำลง 20%'
      },
      {
        version: 'v1.0.0',
        date: '2026-10-15',
        title: 'เปิดตัวเกมเวอร์ชันแรก (First Release)',
        details: 'เปิดให้ทดลองเล่นเกมพัซเซิล 2048 สไตล์ไซเบอร์สยามบนเบราว์เซอร์อย่างเป็นทางการ'
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
      }
    ],
    controls: [
      { key: '[ ลูกศรซ้าย / ขวา ]', action: 'หมุนแกนหกเหลี่ยมตามหรือทวนเข็มนาฬิกา' },
      { key: '[ ลูกศรลง ]', action: 'เร่งความเร็วการหล่นของบล็อก' }
    ],
    requirements: {
      os: 'Windows 10 / 11, macOS, Linux',
      browser: 'เบราว์เซอร์ทุกตัวที่รองรับ HTML5 Canvas & WebGL',
      memory: 'RAM 2 GB',
      graphics: 'Graphics card มาตรฐานทั่วไป'
    },
    patchNotes: [
      {
        version: 'v2.0.1',
        date: '2026-10-20',
        title: 'Neon Pulse Update 2.0',
        details: 'เพิ่มระบบ Dynamic Lighting, ดนตรี Synthwave ปรับจังหวะตามความเร็วเกม และแก้ปัญหาเฟรมตกบนจอ 144Hz'
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
      }
    ],
    controls: [
      { key: '[ ลูกศรขึ้น / ลง ]', action: 'ปรับระดับความสูงของเครื่องบิน (Pitch)' },
      { key: '[ ลูกศรซ้าย / ขวา ]', action: 'เลี้ยวทิศทางซ้ายและขวา (Roll & Yaw)' },
      { key: '[ Spacebar ]', action: 'บูสต์ไอพ่นความเร็วสูง (Nitro Boost)' }
    ],
    requirements: {
      os: 'Windows 10 / 11 64-bit',
      browser: 'Google Chrome หรือ Edge แนะนำเปิด Hardware Acceleration',
      memory: 'RAM 4 GB ขึ้นไป',
      graphics: 'NVIDIA GTX 750 / AMD Radeon หรือเทียบเท่า'
    },
    patchNotes: [
      {
        version: 'v1.1.0',
        date: '2026-10-30',
        title: 'อัปเดตระบบไอพ่นบูสต์และมุมกล้องใหม่',
        details: 'เพิ่มมุมกล้อง First-person ภายในห้องนักบิน, ปรับปรุงฟิสิกส์การร่อนของเครื่องบิน และแก้ปัญหาเสียงหลุดใน WebAssembly'
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
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    role: 'player',
    title: '🎮 เกมโปรดอัปเดตใหม่!',
    message: 'เกม 2048 Cyber Siam ปล่อยแพตช์ v1.4.2 พร้อมเพลงประกอบใหม่แล้ว',
    time: '10 นาทีที่แล้ว',
    isRead: false
  },
  {
    id: 'notif-2',
    role: 'developer',
    title: '✅ อนุมัติเกมขึ้นสโตร์เรียบร้อย!',
    message: 'แอดมินได้ทำการอนุมัติเกม "2048 Cyber Siam" ขึ้นหน้า Storefront แล้ว',
    time: '1 ชั่วโมงที่แล้ว',
    isRead: false
  },
  {
    id: 'notif-3',
    role: 'developer',
    title: '🐛 มีผู้เล่นรายงานบั๊กใหม่',
    message: 'มีผู้ใช้แจ้งปัญหาในเกม Swoop 3D Siam Flight (เสียงกระตุกเล็กน้อย)',
    time: '2 ชั่วโมงที่แล้ว',
    isRead: true
  },
  {
    id: 'notif-4',
    role: 'admin',
    title: '🛡️ มีเกมใหม่รอการตรวจสอบ',
    message: 'สตูดิโอ GhostByte ได้ส่งเกม Krasue: The Night Flight เข้าคิวตรวจสอบ',
    time: '30 นาทีที่แล้ว',
    isRead: false
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
