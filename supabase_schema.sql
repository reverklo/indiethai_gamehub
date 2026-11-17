-- ==============================================================================
-- IndieThaiHub - Supabase Production Database Schema
-- Run this script in the Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE (User profiles linked to auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'developer', 'admin')),
  wallet_balance NUMERIC DEFAULT 350.00,
  dev_quota INTEGER DEFAULT 100,
  studio_name TEXT,
  promptpay_number TEXT DEFAULT '089-765-4321',
  bio TEXT,
  level INTEGER DEFAULT 1,
  badge TEXT DEFAULT 'Beta Tester',
  is_verified_dev BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatic Profile Creation Trigger on New Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    display_name, 
    avatar_url, 
    role, 
    studio_name
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'player'),
    COALESCE(NEW.raw_user_meta_data->>'studio_name', 'Indie Studio')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. GAMES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  developer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  developer_name TEXT NOT NULL DEFAULT 'SiamPixel Studio',
  category TEXT NOT NULL DEFAULT 'Puzzle',
  engine TEXT NOT NULL DEFAULT 'Phaser.js',
  version TEXT NOT NULL DEFAULT 'v1.0.0',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC DEFAULT 0,
  discount_percent INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  rating_count INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  download_size TEXT DEFAULT '50 MB',
  has_webgl BOOLEAN DEFAULT true,
  has_pc_download BOOLEAN DEFAULT false,
  webgl_url TEXT,
  download_url TEXT,
  thumbnail TEXT,
  header_image TEXT,
  media_gallery JSONB DEFAULT '[]'::jsonb,
  controls JSONB DEFAULT '[]'::jsonb,
  system_requirements JSONB DEFAULT '{}'::jsonb,
  features_list JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. GAME PATCHES (Patch notes / version history)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.game_patches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  release_date TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. REVIEWS & RATINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  user_avatar TEXT,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  playtime_hours NUMERIC DEFAULT 1.0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. BUG REPORTS (Feedback & Bug Tracker)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bug_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL DEFAULT 'ผู้เล่นทั่วไป',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'fixed')),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. USER LIBRARY (Owned Games) & WISHLISTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  price_paid NUMERIC DEFAULT 0,
  UNIQUE(user_id, game_id)
);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- ==============================================================================
-- 8. WALLET TRANSACTIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('topup', 'game_purchase', 'payout', 'refund')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_patches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view public profiles; users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Games: Anyone can read approved games; developers can view and manage their own
CREATE POLICY "Anyone can view approved games" ON public.games FOR SELECT USING (status = 'approved' OR auth.uid() = developer_id);
CREATE POLICY "Authenticated users can create games" ON public.games FOR INSERT WITH CHECK (auth.uid() = developer_id);
CREATE POLICY "Developers can update their own games" ON public.games FOR UPDATE USING (auth.uid() = developer_id);

-- Game Patches: Viewable by all; manageable by game developer
CREATE POLICY "Patches viewable by everyone" ON public.game_patches FOR SELECT USING (true);
CREATE POLICY "Developers can insert patches" ON public.game_patches FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.games WHERE games.id = game_patches.game_id AND games.developer_id = auth.uid())
);

-- Reviews: Viewable by all; authenticated users can write reviews
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bug Reports: Viewable by all; developers can update bug status
CREATE POLICY "Bug reports viewable by everyone" ON public.bug_reports FOR SELECT USING (true);
CREATE POLICY "Users can submit bug reports" ON public.bug_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Developers can update bug status" ON public.bug_reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.games WHERE games.id = bug_reports.game_id AND games.developer_id = auth.uid())
);

-- Library & Wishlists: Users manage their own
CREATE POLICY "Users can view own library" ON public.user_library FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into own library" ON public.user_library FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Transactions: Private to owner
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);

-- ==============================================================================
-- 10. SEED INITIAL GAMES (ข้อมูลเกมเริ่มต้น)
-- ==============================================================================
INSERT INTO public.games (
  id, title, slug, tagline, description, developer_name, category, engine, version, 
  price, original_price, discount_percent, rating, rating_count, play_count, download_count, 
  download_size, has_webgl, has_pc_download, webgl_url, download_url, thumbnail, header_image,
  media_gallery, system_requirements, features_list, status
) VALUES 
(
  'e1a00001-0000-0000-0000-000000000001',
  '2048 Cyber Siam',
  '2048-cyber-siam',
  'เกมพัซเซิลตัวเลขสไตล์ไซเบอร์พังก์ ผสมผสานศิลปะไทยร่วมสมัย รันบน WebGL ลื่นไหล',
  'ท้าทายสมองด้วยการรวมบล็อกตัวเลขไซเบอร์พังก์สัญชาติไทย รวบรวมคะแนนสู่หลัก 2048 พร้อมเสียงซาวด์แทร็กอิเล็กทรอนิกส์ไทยเดิมเร้าใจ รันบน WebGL ลื่นไหล 60 FPS ปราศจากอาการกระตุก ออกแบบมาให้เล่นง่าย เข้าใจไว แต่ท้าทายการวางแผนของผู้เล่นระดับสูง',
  'SiamPixel Studio',
  'Puzzle',
  'Phaser.js',
  'v1.4.2',
  0, 0, 0, 4.9, 328, 18450, 3420, '45 MB', true, true,
  'https://play2048.co/',
  'https://github.com/gabrielecirulli/2048/archive/refs/heads/master.zip',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  '[
    {"id": "m1", "type": "image", "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200", "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400", "title": "โหมด Cyber Siam"},
    {"id": "m2", "type": "image", "url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200", "thumbnail": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400", "title": "ศิลปะไทยร่วมสมัย"}
  ]'::jsonb,
  '{
    "minimum": {"os": "Windows 10 64-bit", "processor": "Intel i3", "memory": "2 GB RAM", "graphics": "Intel HD 4000", "storage": "50 MB"},
    "recommended": {"os": "Windows 10/11", "processor": "Intel i5", "memory": "4 GB RAM", "graphics": "GT 1030", "storage": "100 MB"}
  }'::jsonb,
  '["เล่นผ่านเว็บทันที (WebGL 60FPS)", "รองรับคีย์บอร์ด & ทัชสกรีน", "มีตัวดาวน์โหลด PC สำหรับเล่นออฟไลน์"]'::jsonb,
  'approved'
),
(
  'e1a00001-0000-0000-0000-000000000002',
  'Ayutthaya Cyber Samurai: Prototype',
  'ayutthaya-cyber-samurai',
  'เกมแอ็กชัน 2D Side-scrolling ฟันดาบพลาสม่าในกรุงศรีอยุธยาโลกอนาคต',
  'สวมบทซามูไรรับจ้างไซเบอร์เนติกส์ บุกทะลวงป้อมปราการคูเมืองอยุธยาปี 2599 ฟาดฟันกองทัพหุ่นยนต์สังหารด้วยดาบพลาสม่าประจุแสง และวิชาเพลงดาบโบราณประยุกต์ ระบบคอมโบต่อเนื่องและการปัดป้อง (Parry) ที่แม่นยำระดับเสี้ยววินาที',
  'NeonAyodhya Games',
  'Action',
  'Godot HTML5',
  'v0.8.5-alpha',
  199, 299, 33, 4.8, 142, 5200, 1850, '120 MB', true, true,
  'https://godotengine.org',
  'https://github.com/godotengine/godot-demo-projects/archive/refs/heads/master.zip',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
  '[
    {"id": "m1", "type": "image", "url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200", "thumbnail": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400", "title": "ศึกดาบพลาสม่า"}
  ]'::jsonb,
  '{
    "minimum": {"os": "Windows 10 64-bit", "processor": "Intel i3", "memory": "4 GB RAM", "graphics": "GTX 750 Ti", "storage": "200 MB"},
    "recommended": {"os": "Windows 10/11", "processor": "Intel i5", "memory": "8 GB RAM", "graphics": "GTX 1060", "storage": "500 MB"}
  }'::jsonb,
  '["เพลงดาบพลาสม่าสุดมันส์", "บอสไฟต์สุดท้าทาย 3 ตัว", "รองรับคอนโทรลเลอร์ Xbox/PlayStation เต็มรูปแบบ"]'::jsonb,
  'approved'
),
(
  'e1a00001-0000-0000-0000-000000000003',
  'Bangkok Drift 2088',
  'bangkok-drift-2088',
  'ดริฟต์รถตุ๊กตุ๊กพลังไอพ่นและแท็กซี่ไซเบอร์บนทางด่วนลอยฟ้ากรุงเทพฯ ยุค 2088',
  'สัมผัสความเร็วสุดขั้วกับการดริฟต์รถพลังงานไฟฟ้าความเร็วสูงบนทางด่วนลอยฟ้าระดับเมกะโครงสร้าง ข้ามผ่านแม่น้ำเจ้าพระยาและตึกระฟ้าใจกลางกรุงเทพมหานครยุคอนาคต พร้อมการปรับแต่งชิ้นส่วนและระบบฟิสิกส์การดริฟต์ที่สมจริง',
  'BKK Speed Syndicate',
  'Racing',
  'Unity WebGL',
  'v0.5.0-beta',
  89, 89, 0, 4.5, 96, 3100, 920, '210 MB', true, true,
  'https://unity.com',
  'https://github.com/Unity-Technologies',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80',
  '[
    {"id": "m1", "type": "image", "url": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200", "thumbnail": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400", "title": "ดริฟต์ทางด่วนกรุงเทพ 2088"}
  ]'::jsonb,
  '{
    "minimum": {"os": "Windows 10 64-bit", "processor": "Intel i5", "memory": "8 GB RAM", "graphics": "GTX 1050 Ti", "storage": "500 MB"},
    "recommended": {"os": "Windows 11", "processor": "Intel i7", "memory": "16 GB RAM", "graphics": "RTX 2060", "storage": "1 GB SSD"}
  }'::jsonb,
  '["สนามแข่งทางด่วนลอยฟ้า 4 เส้นทาง", "ปรับแต่งรถตุ๊กตุ๊กไอพ่นและแท็กซี่พลังนิวเคลียร์", "ระบบฟิสิกส์ดริฟต์สมจริง"]'::jsonb,
  'approved'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Patch Notes
INSERT INTO public.game_patches (game_id, version, title, details)
VALUES 
(
  'e1a00001-0000-0000-0000-000000000001',
  'v1.4.2',
  'ปรับปรุง WebGL Engine 60FPS และแก้บั๊ก',
  '1. ปรับปรุงการเรนเดอร์ WebGL บนจอ 144Hz ให้เสถียร\n2. รองรับคีย์ลัด [W][A][S][D]\n3. ปรับปรุงขนาดไฟล์ดาวน์โหลด PC ให้เล็กลง 15%'
)
ON CONFLICT DO NOTHING;

-- Seed Sample Bug Reports
INSERT INTO public.bug_reports (game_id, reporter_name, title, description, status, severity)
VALUES
(
  'e1a00001-0000-0000-0000-000000000001',
  'Somchai_Gamer',
  'ปุ่มเสียงดนตรีประกอบบางครั้งไม่เล่นอัตโนมัติบน Safari',
  'เมื่อเปิดเกมผ่านเบราว์เซอร์ Safari บน macOS เสียงเพลงธีมหลักไม่เริ่มเล่นอัตโนมัติจนกว่าจะกดคลิกบนหน้าจอเกมหนึ่งครั้ง',
  'fixed',
  'low'
),
(
  'e1a00001-0000-0000-0000-000000000001',
  'BkkPilot',
  'กดลูกศรเร็วๆ ในจังหวะคอมโบแล้วบล็อกกระตุกเล็กน้อย',
  'เมื่อกดสลับทิศทางอย่างรวดเร็วติดกัน 3 ครั้งในจังหวะกระดานใกล้เต็ม พบเฟรมดรอปประมาณ 2 วินาที',
  'open',
  'medium'
)
ON CONFLICT DO NOTHING;
