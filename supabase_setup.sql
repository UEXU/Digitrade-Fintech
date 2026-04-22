-- Supabase Setup SQL

-- Site Configuration Table
CREATE TABLE site_config (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial Hero Text
INSERT INTO site_config (key, value) VALUES 
('hero_title', '让中国企业在澳洲 真正落地与增长'),
('hero_subtitle', '从合规准入到商业策略，我们填补“落地后增长赋能”的市场空白，担任您的外部首席增长官（CGO），助您在澳洲市场扎根。');

-- Products/Services Table
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image_url TEXT,
  stage TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial Seed Data for Products
INSERT INTO products (title, description, price, image_url, stage, features) VALUES
('战略入市服务', '解决赴澳初期最紧迫的基础挑战，建立合法运营实体。', '$3,800+', 'strategy', '第一阶段：快速变现', '["市场调研报告", "商业模式设计", "合规路径规划", "公司注册与税务登记"]'),
('本地化运营服务', '解决深层次运营挑战，实现品牌在澳洲的真正扎根。', '$5,000+', 'localization', '第二阶段：增长型产品', '["品牌本地化改造", "数字营销全案", "渠道建设与对接", "人才招聘与管理"]'),
('增长赋能服务', '深度聚焦重点产业，助力企业实现从落地到扎根的质变。', '项目制', 'growth', '第三阶段：高价值产品', '["政府资源嫁接", "产业基金申请支持", "财税外包服务", "战略合作撮合"]');


-- Enable Row Level Security (RLS)
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Site Config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Allow authenticated admin to modify
CREATE POLICY "Admin CRUD Site Config" ON site_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Products" ON products FOR ALL USING (auth.role() = 'authenticated');
