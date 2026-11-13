/**
 * IndieThai Hub - Enhanced Mock Data (Steam Standard)
 * ข้อมูลเกมอินดี้ WebGL/PC พร้อม Media Gallery, System Requirements, Patch Notes, และระบบราคา Token/Wallet
 */

export const INITIAL_GAMES = [
  {
    id: 'game-1',
    title: '2048 Cyber Siam',
    slug: '2048-cyber-siam',
    tagline: 'เกมพัซเซิลตัวเลขสไตล์ไซเบอร์พังก์ ผสมผสานศิลปะไทยร่วมสมัย รันบน WebGL ลื่นไหล',
    description: 'ท้าทายสมองด้วยการรวมบล็อกตัวเลขไซเบอร์พังก์สัญชาติไทย รวบรวมคะแนนสู่หลัก 2048 พร้อมเสียงซาวด์แทร็กอิเล็กทรอนิกส์ไทยเดิมเร้าใจ รันบน WebGL ลื่นไหล 60 FPS ปราศจากอาการกระตุก ออกแบบมาให้เล่นง่าย เข้าใจไว แต่ท้าทายการวางแผนของผู้เล่นระดับสูง',
    developer: 'SiamPixel Studio',
    developerId: 'usr-dev-1',
    category: 'Puzzle',
    engine: 'Phaser.js',
    version: 'v1.4.2',
    price: 0, // เล่นฟรี (Free to Play)
    originalPrice: 0,
    discountPercent: 0,
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
    headerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
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
    controls: [
      { key: 'ปุ่มลูกศร (Arrow Keys)', action: 'เลื่อนบล็อกตัวเลข ขึ้น/ลง/ซ้าย/ขวา' },
      { key: '[ W ] [ A ] [ S ] [ D ]', action: 'เลื่อนบล็อกตัวเลขทางเลือก' },
      { key: '[ R ]', action: 'รีสตาร์ตกระดานใหม่' }
    ],
    requirements: {
      os: 'Windows 10 / 11, macOS, Linux',
      browser: 'Google Chrome, Microsoft Edge, Firefox, Safari (รองรับ WebGL 2.0)',
      memory: 'RAM 2 GB ขึ้นไป',
      graphics: 'รองรับการเรนเดอร์ WebGL / Hardware Acceleration'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit หรือ macOS 11+',
        processor: 'Intel Core i3 / AMD Ryzen 3 ขึ้นไป',
        memory: '2 GB RAM',
        graphics: 'Intel HD Graphics 4000 หรือการ์ดจอที่รองรับ WebGL 2.0',
        directx: 'เวอร์ชัน 11',
        storage: '50 MB พื้นที่ว่างบนฮาร์ดไดรฟ์'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5 หรือ AMD Ryzen 5',
        memory: '4 GB RAM',
        graphics: 'NVIDIA GeForce GT 1030 / AMD Radeon RX 550',
        directx: 'เวอร์ชัน 12',
        storage: '100 MB SSD'
      }
    },
    featuresList: [
      'เล่นผ่านเว็บได้ทันที (WebGL Instant Play)',
      'ผู้เล่นคนเดียว (Single-player)',
      'รองรับจอยสติ๊กและคีย์บอร์ด (Controller & Keyboard)',
      'มีเวอร์ชันดาวน์โหลด PC สำหรับเล่นออฟไลน์',
      'กระดานผู้นำคะแนนออนไลน์ (Online Leaderboards)'
    ],
    socialLinks: {
      discord: 'https://discord.gg/indiethai',
      twitter: 'https://twitter.com/siampixel',
      youtube: 'https://youtube.com',
      website: 'https://siampixel.indiethai.hub'
    },
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
    tags: ['เล่นฟรี', 'WebGL', 'Puzzle', 'Cyberpunk', 'Thai Audio'],
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
    tagline: 'เกมพัซเซิลหกเหลี่ยมจับจังหวะแสงสีนีออน หมุนและต่อคอมโบ 360 องศา',
    description: 'ท้าทายไหวพริบและความเร็วในการควบคุมแท่นหกเหลี่ยมหมุนเพื่อรับแท่งสีนีออนที่พุ่งเข้ามาจากทุกทิศทาง คอมโบสีเดียวกัน 3 ชิ้นขึ้นไปเพื่อระเบิดแต้ม ปลดล็อกเอฟเฟกต์ภาพและซาวด์แทร็กอิเล็กทรอนิกส์สุดมันส์',
    developer: 'NeonWave TH',
    developerId: 'usr-dev-2',
    category: 'Arcade',
    engine: 'HTML5 Canvas',
    version: 'v2.0.1',
    price: 89, // 89 Tokens (฿89)
    originalPrice: 89,
    discountPercent: 0,
    rating: 4.8,
    ratingCount: 195,
    playCount: 12200,
    downloadCount: 1890,
    downloadSize: '32 MB',
    hasWebgl: true,
    hasPcDownload: true,
    webglUrl: 'https://hextris.io/',
    downloadUrl: 'https://github.com/Hextris/hextris/archive/refs/heads/gh-pages.zip',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    headerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    mediaGallery: [
      {
        id: 'm1',
        type: 'video',
        url: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
        title: 'ตัวอย่างการเล่น Neon Combo 360'
      },
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
        title: 'โหมด Extreme Speed'
      }
    ],
    controls: [
      { key: '[ ลูกศรซ้าย / A ]', action: 'หมุนแกนหกเหลี่ยมไปทางซ้าย' },
      { key: '[ ลูกศรขวา / D ]', action: 'หมุนแกนหกเหลี่ยมไปทางขวา' },
      { key: '[ Spacebar ]', action: 'เร่งความเร็วของบล็อกนีออน' }
    ],
    requirements: {
      os: 'Windows, macOS, Linux, iOS, Android',
      browser: 'เบราว์เซอร์ทุกตัวที่รองรับ HTML5 Canvas',
      memory: 'RAM 1 GB ขึ้นไป',
      graphics: 'การ์ดจอออนบอร์ดทั่วไป'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 7 / 8 / 10 / 11 64-bit',
        processor: '1.8 GHz Dual Core Processor',
        memory: '1 GB RAM',
        graphics: 'OpenGL 2.0 compatible graphics card',
        directx: 'เวอร์ชัน 10',
        storage: '50 MB พื้นที่ว่าง'
      },
      recommended: {
        os: 'Windows 10 / 11 64-bit',
        processor: 'Intel Core i3 2.0 GHz ขึ้นไป',
        memory: '2 GB RAM',
        graphics: 'Intel UHD Graphics 630 ขึ้นไป',
        directx: 'เวอร์ชัน 11',
        storage: '100 MB SSD'
      }
    },
    featuresList: [
      'ผู้เล่นคนเดียว (Single-player)',
      'รองรับเมาส์และคีย์บอร์ด (Mouse & Keyboard)',
      'การจัดอันดับคะแนนทั่วโลก (Global Ranking)',
      'ระบบเสียงไดนามิกตอบสนองการเล่น (Dynamic Audio)'
    ],
    socialLinks: {
      discord: 'https://discord.gg/indiethai',
      twitter: 'https://twitter.com/neonwave',
      youtube: 'https://youtube.com',
      website: 'https://neonwave.indiethai.hub'
    },
    patchNotes: [
      {
        version: 'v2.0.1',
        date: '2026-10-20',
        title: 'อัปเกรดเอนจินกราฟิก Canvas 60FPS',
        details: 'ปรับปรุง Particle Effect ให้ลื่นไหลขึ้น 50% และแก้ปัญหาบล็อกเหลื่อมในจอ 144Hz'
      }
    ],
    promptPayNumber: '081-234-5678',
    status: 'approved',
    createdAt: '2026-10-18',
    tags: ['อาร์เคด', 'Neon', 'Fast-Paced', 'HTML5', 'เพลงมันส์'],
    featured: false,
    securityScan: {
      status: 'Clean',
      details: 'ผ่านการตรวจสอบความปลอดภัยของสคริปต์ Canvas สมบูรณ์',
      scannedAt: '2026-10-20 09:12'
    },
    reviews: [
      { id: 'rev-3', user: 'SpeedRunner_TH', rating: 5, comment: 'เกมดูดเวลามากกก เล่นเพลินทั้งวัน คุ้มราคาครับ', date: '2026-10-28' }
    ],
    bugReports: []
  },
  {
    id: 'game-3',
    title: 'Swoop 3D Siam Flight',
    slug: 'swoop-3d-siam-flight',
    tagline: 'บินทะยานผ่านเกาะลอยฟ้าและวิหารโบราณ กราฟิก 3D WebGL เต็มรูปแบบ',
    description: 'ควบคุมเครื่องบินเล็กโฉบเฉี่ยวเก็บไอเทมและทำเวลาในโลกเสมือนจริง 3 มิติ รันบนเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้ง พัฒนาด้วยเทคโนโลยี Unity WebGL ขั้นสูง รองรับทั้งจอยสติ๊กและคีย์บอร์ด มีระบบฟิสิกส์การร่อนที่สมจริงและมุมมองห้องนักบินอันตระการตา',
    developer: 'CyberChon Dev',
    developerId: 'usr-dev-3',
    category: 'Action / Flight',
    engine: 'Unity WebGL',
    version: 'v1.1.0',
    price: 119, // ลดราคาจาก 149 เหลือ 119 Tokens
    originalPrice: 149,
    discountPercent: 20,
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
    headerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    mediaGallery: [
      {
        id: 'm1',
        type: 'video',
        url: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&mute=1',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
        title: 'วิดีโอเที่ยวบินสาธิตเกาะลอยฟ้า 60FPS'
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
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
        title: 'วิหารลอยฟ้าโบราณกลางม่านเมฆ'
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
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i3-4160 / AMD FX-6300',
        memory: '4 GB RAM',
        graphics: 'NVIDIA GeForce GTX 750 Ti / AMD Radeon R7 260X',
        directx: 'เวอร์ชัน 11',
        storage: '500 MB พื้นที่ว่างบนฮาร์ดไดรฟ์'
      },
      recommended: {
        os: 'Windows 11 64-bit',
        processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580',
        directx: 'เวอร์ชัน 12',
        storage: '500 MB SSD'
      }
    },
    featuresList: [
      'ผู้เล่นคนเดียว (Single-player)',
      'รองรับจอยสติ๊ก Xbox & PlayStation (Full Controller Support)',
      'ความสำเร็จบนแพลตฟอร์ม (Achievements)',
      'ภาพ 3D Full HD 60FPS',
      'มุมมอง First Person ห้องนักบิน'
    ],
    socialLinks: {
      discord: 'https://discord.gg/indiethai',
      twitter: 'https://twitter.com/cyberchon',
      youtube: 'https://youtube.com',
      website: 'https://swoop.seromi.net'
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
    tags: ['3D WebGL', 'Flight Simulator', 'Unity', 'Action', 'ลดราคาพิเศษ'],
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
    title: 'Bangkok Drift 2088',
    slug: 'bangkok-drift-2088',
    tagline: 'ซิ่งรถตุ๊กตุ๊กติดไอพ่นดริฟต์บนทางด่วนลอยฟ้ากรุงเทพมหานครแห่งอนาคต',
    description: 'เร่งสปีดสู่ความเร็วแสงในโลก Cyberpunk Bangkok ยุค 2088 ดัดแปลงรถตุ๊กตุ๊กไฮเปอร์ไดรฟ์ของคุณ หลบหลีกสิ่งกีดขวางบนทางด่วนลอยฟ้าทะลุหมอกนีออน แข่งขันชิงจ้าวความเร็วบน WebGL 60 FPS และมีเวอร์ชันดาวน์โหลด PC กราฟิกจัดเต็ม Ray Tracing',
    developer: 'SiamPixel Studio',
    developerId: 'usr-dev-1',
    category: 'Racing',
    engine: 'Unity WebGL',
    version: 'v0.9.8-beta',
    price: 199, // 199 Tokens (฿199)
    originalPrice: 249,
    discountPercent: 20,
    rating: 4.95,
    ratingCount: 512,
    playCount: 31200,
    downloadCount: 8400,
    downloadSize: '350 MB',
    hasWebgl: true,
    hasPcDownload: true,
    webglUrl: 'https://play2048.co/',
    downloadUrl: 'https://github.com/gabrielecirulli/2048/archive/refs/heads/master.zip',
    thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    headerImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    mediaGallery: [
      {
        id: 'm1',
        type: 'video',
        url: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1',
        thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80',
        title: 'เกมเพลย์ดริฟต์บนทางด่วนอโศกลอยฟ้า'
      },
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80',
        title: 'รถซิ่งตุ๊กตุ๊กติดไนตรัส 2088'
      }
    ],
    controls: [
      { key: '[ W ] [ A ] [ S ] [ D ]', action: 'เร่งความเร็ว / เบรก / เลี้ยวซ้ายขวา' },
      { key: '[ Shift ]', action: 'ดริฟต์เข้าโค้งความเร็วสูง (Drift Mode)' },
      { key: '[ Spacebar ]', action: 'ฉีดไนตรัสไอพ่นบูสต์ (Nitro Jet)' }
    ],
    requirements: {
      os: 'Windows 10 / 11 64-bit',
      browser: 'Google Chrome หรือ Edge แนะนำการ์ดจอแยก',
      memory: 'RAM 4 GB ขึ้นไป',
      graphics: 'NVIDIA GTX 960 / AMD Radeon RX 460'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-4460 / AMD FX-8350',
        memory: '6 GB RAM',
        graphics: 'NVIDIA GeForce GTX 960 / AMD Radeon R9 280X',
        directx: 'เวอร์ชัน 11',
        storage: '1 GB พื้นที่ว่าง'
      },
      recommended: {
        os: 'Windows 11 64-bit',
        processor: 'Intel Core i7-8700K / AMD Ryzen 7 2700X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5600 XT',
        directx: 'เวอร์ชัน 12',
        storage: '2 GB NVMe SSD'
      }
    },
    featuresList: [
      'ผู้เล่นหลายคนออนไลน์ (Online Multiplayer PvP)',
      'รองรับจอยพวงมาลัยและคอนโทรลเลอร์ (Wheel & Controller Support)',
      'ระบบแต่งรถตุ๊กตุ๊กไซเบอร์ (Deep Vehicle Customization)',
      'รางวัลความสำเร็จบน Hub (24 Achievements)'
    ],
    socialLinks: {
      discord: 'https://discord.gg/indiethai',
      twitter: 'https://twitter.com/siampixel',
      youtube: 'https://youtube.com',
      website: 'https://siampixel.indiethai.hub'
    },
    patchNotes: [
      {
        version: 'v0.9.8-beta',
        date: '2026-11-06',
        title: 'เปิดช่วง Early Access ทางด่วนพระรามเก้า',
        details: 'เพิ่มแผนที่สนามแข่งใหม่ 2 เส้นทาง, ปรับฟิสิกส์แรงยึดเกาะยางรถขณะดริฟต์'
      }
    ],
    promptPayNumber: '089-765-4321',
    status: 'approved',
    createdAt: '2026-11-06',
    tags: ['แข่งรถ', 'Racing', 'Cyberpunk', 'Multiplayer', 'Early Access'],
    featured: true,
    securityScan: {
      status: 'Clean',
      details: 'ผ่านการทดสอบ WebGL 60FPS และสแกนไวรัสไฟล์ PC สะอาด 100%',
      scannedAt: '2026-11-06 11:20'
    },
    reviews: [
      { id: 'rev-5', user: 'DriftKing_BKK', rating: 5, comment: 'ตุ๊กตุ๊กติดเจ็ตโครตมันส์ ดริฟต์เนียนมาก ฟิสิกส์ดีเกินคาด!', date: '2026-11-08' }
    ],
    bugReports: []
  },
  {
    id: 'game-5',
    title: 'Krasue: Night Shadows',
    slug: 'krasue-night-shadows',
    tagline: 'เกมสยองขวัญเอาชีวิตรอดในหมู่บ้านชนบทไทย ท่ามกลางเสียงหัวเราะยามราตรี',
    description: 'คุณตื่นขึ้นมาในหมู่บ้านแถบชนบทภาคอีสานที่ถูกตัดขาดจากโลกภายนอก ค้นหาเบาะแส ซ่อนตัวจากแสงไฟสีเขียวที่ลอยอยู่เหนือยอดไม้ และเอาชีวิตรอดก่อนที่รุ่งสางจะมาถึง สร้างบรรยากาศน่าสะพรึงกลัวด้วยระบบเสียง 3D Binaural Audio สุดสมจริง',
    developer: 'GhostByte Studio',
    developerId: 'usr-dev-4',
    category: 'Horror',
    engine: 'Unreal Web / PC',
    version: 'v1.0.2',
    price: 249, // 249 Tokens (฿249)
    originalPrice: 299,
    discountPercent: 17,
    rating: 4.88,
    ratingCount: 380,
    playCount: 15400,
    downloadCount: 4200,
    downloadSize: '1.2 GB',
    hasWebgl: false,
    hasPcDownload: true, // ดาวน์โหลด PC เท่านั้น
    downloadUrl: 'https://github.com/seromi/swoop/archive/refs/heads/master.zip',
    thumbnail: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80',
    headerImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80',
    mediaGallery: [
      {
        id: 'm1',
        type: 'video',
        url: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1',
        thumbnail: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&auto=format&fit=crop&q=80',
        title: 'คลิปตัวอย่างความสยองขวัญยามราตรี'
      },
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&auto=format&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&auto=format&fit=crop&q=80',
        title: 'แสงไฟลึกลับกลางทุ่งนา'
      }
    ],
    controls: [
      { key: '[ W ] [ A ] [ S ] [ D ]', action: 'เคลื่อนที่ / ย่องเบา' },
      { key: '[ F ]', action: 'เปิด/ปิดไฟฉาย (ระวังไฟจะดึงดูดสิ่งนั้น)' },
      { key: '[ C ]', action: 'ก้มตัวหมอบซ่อนในพุ่มไม้' }
    ],
    requirements: {
      os: 'Windows 10 / 11 64-bit',
      browser: 'ต้องดาวน์โหลดไฟล์ติดตั้ง PC เพื่อสัมผัสกราฟิกเต็มรูปแบบ',
      memory: 'RAM 8 GB ขึ้นไป',
      graphics: 'NVIDIA GTX 1060 / AMD RX 580 ขึ้นไป'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-6400 / AMD Ryzen 5 1400',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1050 Ti (4GB) / AMD Radeon RX 570',
        directx: 'เวอร์ชัน 11',
        storage: '2 GB พื้นที่ว่าง'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-8700 / AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700',
        directx: 'เวอร์ชัน 12',
        storage: '2 GB SSD (แนะนำเพื่อโหลดฉากไว)'
      }
    },
    featuresList: [
      'ผู้เล่นคนเดียว (Single-player)',
      'เสียงรอบทิศทาง 3D Binaural Audio (แนะนำใส่หูฟัง)',
      'ระบบซ่อนตัวและ AI ล่าเหยื่ออัจฉริยะ',
      'รองรับจอยคอนโทรลเลอร์ PlayStation & Xbox'
    ],
    socialLinks: {
      discord: 'https://discord.gg/indiethai',
      twitter: 'https://twitter.com/ghostbyte',
      youtube: 'https://youtube.com',
      website: 'https://ghostbyte.indiethai.hub'
    },
    patchNotes: [
      {
        version: 'v1.0.2',
        date: '2026-11-10',
        title: 'ปรับความยากของ AI กระสือ และเพิ่มเสียงกระซิบ',
        details: 'ปรับระยะสายตาการมองเห็นของ AI ในที่มืด และเพิ่มซาวด์เอฟเฟกต์บรรยากาศหมู่บ้านยามดึก'
      }
    ],
    promptPayNumber: '083-999-8877',
    status: 'approved',
    createdAt: '2026-11-10',
    tags: ['สยองขวัญ', 'Horror', 'Survival', 'PC Download', 'ผีไทย'],
    featured: true,
    securityScan: {
      status: 'Clean',
      details: 'ผ่านการตรวจสอบไฟล์ PC ปลอดภัย ไร้มัลแวร์ 100%',
      scannedAt: '2026-11-10 16:45'
    },
    reviews: [
      { id: 'rev-6', user: 'ScaredGamer99', rating: 5, comment: 'หลอนจนไม่กล้าปิดไฟนอน ซาวด์ดีมากครับ!', date: '2026-11-11' }
    ],
    bugReports: []
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
    username: 'tsukiko_83',
    name: 'Tsukiko_83',
    email: 'tsukiko@indiethai.hub',
    role: 'player',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    tokenBalance: 0,
    walletBalance: 350, // วอลเล็ต 350 Tokens (฿350) พร้อมซื้อเกม
    ownedGames: ['game-1'], // เป็นเจ้าของเกม 2048 Cyber Siam แล้ว
    bio: 'คุณสามารถนำเสนอหนึ่งในเหรียญตราของคุณได้ที่นี่ เลือกเหรียญตราได้จากหน้าแก้ไขโปรไฟล์ของคุณ',
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
    tokenBalance: 150, // เหรียญ Dev สำหรับลงเกม
    walletBalance: 500, // วอลเล็ตสำหรับซื้อเกม
    salesRevenue: 4250, // ยอดรายได้ขายเกมสะสม
    ownedGames: ['game-1', 'game-4'], // เป็นเจ้าของเกมในคลัง
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
    walletBalance: 9999,
    ownedGames: ['game-1', 'game-2', 'game-3', 'game-4', 'game-5'],
    bio: 'เจ้าหน้าที่ตรวจสอบคุณภาพ ความปลอดภัยของ WebGL Build และอนุมัติเกมขึ้นระบบ',
    superAdmin: true,
    isBanned: false
  }
};

export const MOCK_USERS_LIST = [
  {
    id: 'usr-player-1',
    username: 'tsukiko_83',
    name: 'Tsukiko_83',
    email: 'tsukiko@indiethai.hub',
    role: 'player',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    tokenBalance: 0,
    walletBalance: 350,
    ownedGames: ['game-1'],
    gamesPlayed: 42,
    isBanned: false,
    registeredAt: '2026-08-10'
  },
  {
    id: 'usr-dev-1',
    username: 'SiamPixelDev',
    name: 'สมชาย ผู้สร้างเกม',
    email: 'dev@indiethai.hub',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    tokenBalance: 150,
    walletBalance: 500,
    ownedGames: ['game-1', 'game-4'],
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
    walletBalance: 9999,
    ownedGames: ['game-1', 'game-2', 'game-3', 'game-4', 'game-5'],
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
  'Racing',
  'Horror',
  'Action',
  'Adventure'
];

export const GAME_JAM_DATA = {
  title: 'Thai Cyber Indie Game Jam 2026',
  theme: 'ธีมการแข่งขัน: Siam Cyberpunk — ผสานอารยธรรมไทยสู่โลกไซเบอร์',
  deadline: 'ปิดรับผลงาน WebGL ในอีก 5 วัน 14 ชั่วโมง',
  prizePool: '100,000 บาท + 2,000 Hub Tokens',
  submissionsCount: 28,
  badge: 'Game Jam Event'
};

export const TOKEN_COST_PER_GAME = 50;