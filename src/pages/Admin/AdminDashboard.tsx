import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, 
  LogOut, 
  LayoutDashboard, 
  Type, 
  DollarSign, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Briefcase,
  Mail,
  Phone,
  Layers,
  ChevronRight,
  Zap,
  Activity,
  Info,
  FileText,
  BarChart3,
  Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safeJsonParse } from '../../lib/utils';
import { DEFAULT_PRODUCTS } from '../../constants';

const STANDARD_PRODUCT_TEMPLATE = DEFAULT_PRODUCTS.map(p => ({
  ...p,
  features: JSON.stringify(p.features)
}));

const ImageUploadField = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "输入图片 URL 或点击上传",
}: { 
  value: string; 
  onChange: (val: string) => void; 
  label?: string;
  placeholder?: string;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('图片大小不能超过 4MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
          {label}
        </label>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow group relative">
          <input 
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all font-mono text-xs pr-12"
            placeholder={placeholder}
            value={value?.startsWith('data:') ? '已上传本地图片文件 (Base64)' : (value || '')}
            onChange={(e) => onChange(e.target.value)}
            disabled={value?.startsWith('data:')}
          />
          {value?.startsWith('data:') && (
            <div className="absolute inset-y-0 left-0 flex items-center px-6 pointer-events-none w-full bg-slate-100 rounded-2xl border border-blue-200">
              <span className="bg-blue-600 text-white text-[10px] items-center px-2 py-1 rounded font-black uppercase tracking-widest h-fit shadow-sm">
                LOCAL IMAGE
              </span>
              <span className="ml-3 text-slate-500 text-[10px] font-mono truncate max-w-[200px]">
                {value.substring(0, 40)}...
              </span>
            </div>
          )}
          {value && (
            <button 
              onClick={() => onChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors z-10"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <label className="cursor-pointer bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-blue-600/20">
          <ImageIcon size={18} />
          上传本地文件
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const [siteConfig, setSiteConfig] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [deletedProductIds, setDeletedProductIds] = useState<number[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connStatus, setConnStatus] = useState<'connected' | 'error' | 'unknown'>('unknown');
  const [activeTab, setActiveTab] = useState<'navbar' | 'hero' | 'about' | 'service-path' | 'products' | 'industries' | 'contact' | 'pain-points' | 'footer' | 'leads'>('navbar');
  const navigate = useNavigate();

  const AVAILABLE_ICONS = [
    { name: 'Search', label: '搜索 (Search)' },
    { name: 'Globe', label: '全球 (Globe)' },
    { name: 'ShieldCheck', label: '安全合规 (Shield)' },
    { name: 'TrendingUp', label: '增长 (Growth)' },
    { name: 'Users', label: '团队/伙伴 (Users)' },
    { name: 'Building2', label: '产业/企业 (Building)' },
    { name: 'Briefcase', label: '业务/方案 (Briefcase)' },
    { name: 'Zap', label: '加速 (Zap)' },
    { name: 'MapPin', label: '定位 (MapPin)' },
    { name: 'Heart', label: '服务/关怀 (Heart)' },
    { name: 'Star', label: '核心/星级 (Star)' },
    { name: 'Award', label: '荣誉/品质 (Award)' },
    { name: 'Clock', label: '效率 (Clock)' },
    { name: 'MessageSquare', label: '咨询 (Chat)' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const [lastError, setLastError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setLastError(null);
    try {
      // 1. 连通性测试
      const { error: pingError } = await supabase.from('site_config').select('key').limit(1);
      if (pingError) {
        console.error('DB Ping Error:', pingError);
        setConnStatus('error');
        setLastError(pingError.message);
      } else {
        setConnStatus('connected');
      }

      // 2. 获取配置
      const { data: configData } = await supabase.from('site_config').select('*');
      if (configData) {
        const configObj = configData.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setSiteConfig(configObj);
      }
      
      // 3. 获取产品 (服务矩阵)
      const { data: productsData, error: pErr } = await supabase
        .from('products')
        .select('*')
        .order('id');
      
      if (pErr) throw pErr;

      if (productsData && productsData.length > 0) {
        setProducts(productsData.map(p => ({
          ...p,
          id: Number(p.id),
          features: typeof p.features === 'string' ? p.features : JSON.stringify(p.features)
        })));
      } else {
        // 如果云端是空的，本地展示标准 6 模块
        console.log('Database empty, initializing with defaults');
        setProducts(STANDARD_PRODUCT_TEMPLATE.map(p => ({ ...p, id: Number(p.id) })));
      }
      
      // 4. 获取线索
      try {
        setLeadsError(null);
        const { data: leadsData, error: leadsFetchError } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (leadsFetchError) {
          console.error('Leads fetch error with ordering:', leadsFetchError.message);
          // 尝试无序获取
          const { data: unorderedLeads, error: unorderedError } = await supabase
            .from('leads')
            .select('*');
            
          if (!unorderedError && unorderedLeads) {
            setLeads(unorderedLeads);
          } else if (unorderedError) {
            console.error('Totally failed to fetch leads:', unorderedError.message);
            setLeadsError(`数据库读取失败: ${unorderedError.message}。请检查 'leads' 表是否存在，且是否在 Supabase 后台开启了正确的 RLS (Row Level Security) 读取权限。`);
          } else {
            // 成功但可能为空
            setLeads([]);
          }
        } else if (leadsData) {
          setLeads(leadsData);
        }
      } catch (leadsErr: any) {
        console.error('Leads overall fetch error:', leadsErr);
        setLeadsError(`读取异常: ${leadsErr.message || '未知错误'}`);
      }
      
      // 清空本地删除记录
      setDeletedProductIds([]);
    } catch (error: any) {
      console.error('Fetch error:', error);
      setConnStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = (key: string, value: any) => {
    setSiteConfig({ ...siteConfig, [key]: typeof value === 'string' ? value : JSON.stringify(value) });
  };

  const getConfig = (key: string, defaultVal: any = []) => {
    const val = siteConfig[key];
    if (!val) return defaultVal;
    return safeJsonParse(val, defaultVal);
  };

  const handleGlobalSync = async () => {
    // Basic connectivity check
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project')) {
      alert('【连接受限】检测到 VITE_SUPABASE_URL 尚未正确配置。请在 Settings -> Secrets 菜单中填入真实的 Supabase 项目地址与 API Key。');
      return;
    }

    setSaving(true);
    let successCount = 0;
    
    try {
      console.log('--- 启动全量镜像同步 ---');

      // 1. 同步全站基础配置 (Site Config) - 使用 Upsert 保持增量更新
      const configEntries = Object.keys(siteConfig).map(key => ({ 
        key, 
        value: siteConfig[key] 
      }));
      
      const { error: configError } = await supabase.from('site_config').upsert(configEntries, { onConflict: 'key' });
      if (configError) throw new Error(`站点基础配置同步出错: ${configError.message}`);
      
      // 2. 产品矩阵镜像同步 (Resilient Mirror Sync)
      // 策略：不再暴力全量清空（避免触发 Identity 列插入限制），而是：
      // (1) 获取云端所有可用 ID
      // (2) 找出云端多余的 ID 并删除
      // (3) 对本地所有项执行 Upsert (有就更，没就加)
      
      console.log('正在获取云端现有数据现状...');
      const { data: cloudProducts, error: fetchCloudError } = await supabase.from('products').select('id');
      let cloudIds: number[] = [];
      
      if (!fetchCloudError && cloudProducts) {
        cloudIds = cloudProducts.map(cp => Number(cp.id));
        const localIds = products.map(p => Number(p.id));
        const idsToDelete = cloudIds.filter(cid => !localIds.includes(cid));
        
        if (idsToDelete.length > 0) {
          console.log('清理云端冗余模块:', idsToDelete);
          await supabase.from('products').delete().in('id', idsToDelete);
        }
      }

      console.log('正在并行分发产品矩阵数据...', products.length);
      const syncPayloads = products.map(p => {
        const { created_at, _isNew, ...rest } = p;
        const features = typeof rest.features === 'string' 
          ? safeJsonParse(rest.features, []) 
          : rest.features;

        return {
          id: Number(p.id),
          title: rest.title || '未命名模块',
          description: rest.description || '',
          price: rest.price || '咨询洽谈',
          image_url: rest.image_url || 'Briefcase',
          stage: rest.stage || '',
          features: Array.isArray(features) ? features : []
        };
      });

      if (syncPayloads.length > 0) {
        console.log('正在执行增量保护式同步...');
        
        for (const payload of syncPayloads) {
          const { id, ...dataWithoutId } = payload;
          
          // 检查该 ID 在云端是否存在
          const existsInCloud = cloudIds.includes(Number(id));
          
          if (existsInCloud) {
            // 已存在：使用 update 且不传送 id 字段本身
            const { error: updErr } = await supabase
              .from('products')
              .update(dataWithoutId)
              .eq('id', id);
            
            if (updErr) {
              console.error(`模块 [${id}] 更新失败:`, updErr.message);
            } else {
              successCount++;
            }
          } else {
            // 不存在：使用 insert 且不传送 id (让数据库自增)
            // 注意：这会导致云端 ID 可能与本地临时 ID 不一致，但能保证写入成功
            const { error: insErr } = await supabase
              .from('products')
              .insert(dataWithoutId);
              
            if (insErr) {
              console.error(`新模块写入失败:`, insErr.message);
            } else {
              successCount++;
            }
          }
        }
      }

      const statusMsg = syncPayloads.length === successCount 
        ? '同步成功！产品矩阵与全站配置已实时生效。' 
        : `部分完成：成功同步 ${successCount}/${syncPayloads.length} 个产品模块，请刷新重试或检查字段。`;

      alert(statusMsg);
      await fetchData(); 
    } catch (e: any) {
      console.error('CRITICAL SYNC FAIL:', e);
      alert('同步失败：' + (e.message || '网络连接或数据库权限异常，请检查配置。'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = (id: number, field: string, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addProduct = () => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => Number(p.id))) + 1 : 1;
    const newProduct = {
      id: nextId,
      title: '新服务板块',
      description: '点击编辑描述...',
      price: '咨询洽谈',
      image_url: 'Briefcase',
      stage: '全周期赋能',
      features: JSON.stringify(["核心功能 A", "核心功能 B"]),
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id: number) => {
    // Removed confirm as it can be problematic in some environments and user reported issues
    setProducts(products.filter(p => Number(p.id) !== Number(id)));
    setDeletedProductIds(prev => [...prev, id]);
  };



  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const currentAboutFeatures = getConfig('about_features', [
    { title: '● 深度本地化', desc: '不只是翻译，更是品牌灵魂的二次植入。' },
    { title: '● 全链路覆盖', desc: '从0到1的冷启动，到1到10的规模化增长。' }
  ]);
  const currentIndustries = getConfig('industries', []);
  const currentPainPoints = getConfig('pain_points', [
    { title: '信息不透明', desc: '不清楚澳洲市场准入规则，不了解注册、税务、签证等复杂流程。', more: '在澳洲，ABN注册、GST税务申报、ASIC合规要求等都与国内显著不同。缺乏本地向导极易导致合规性风险，甚至面临巨额罚款。', icon: 'Search' },
    { title: '落地执行难', desc: '不知道如何注册公司、招聘人才、寻找本地供应链和资源。', more: '澳洲的劳动力成本极高， Fair Work 法规严格。如何在不熟悉的市场建立信任，筛选真正优质的本地供应商，是企业面临的第一个执行难题。', icon: 'MapPin' },
    { title: '增长瓶颈大', desc: '产品卖不出去，品牌不被认可，缺乏本地化运营能力和渠道。', more: '出海不只是翻译文字。文化内核、消费习惯、媒体矩阵的巨大差异，使得传统的“中国模式”在澳洲往往失效。需要深度本地运营才能实现品牌心智占领。', icon: 'TrendingUp' },
    { title: '服务严重割裂', desc: '咨询公司只讲战略，代办机构只做执行，没有人覆盖全流程。', more: 'Digitrade 整合了顶层商业设计到落地合规执行的闭环。我们不只给你报告，我们与您并肩走进市场，解决从0到1的每一个细节问题。', icon: 'Briefcase' }
  ]);
  const currentContactItems = getConfig('contact_items', [
    { icon: 'Mail', label: '电子邮箱', value: 'info@digitradefintech.com' },
    { icon: 'Phone', label: '联系电话', value: '+61 (07) 1234 5678 / +86 123 4567 8910' }
  ]);
  const currentNavLinks = getConfig('navbar_links', [
    { name: '服务体系', href: '/#services' },
    { name: '行业方案', href: '/#industries' },
    { name: '服务流程', href: '/#how-it-works' },
    { name: '关于我们', href: '/#about' },
  ]);
  const currentFormFields = getConfig('contact_form_fields', [
    { name: 'company', label: '公司名称', placeholder: '您的公司全名', type: 'text', required: true },
    { name: 'industry', label: '所属行业', placeholder: '所属行业', type: 'text', required: true },
    { name: 'email', label: '电子邮箱', placeholder: 'email@example.com', type: 'email', required: true },
  ]);
  const currentServiceSteps = getConfig('service_steps', [
    { title: '进入市场', desc: 'Entry' },
    { title: '合规落地', desc: 'Setup' },
    { title: '本地运营', desc: 'Operate' },
    { title: '增长加速', desc: 'Scale' },
    { title: '产业嵌入', desc: 'Integrate' },
  ]);

  const updateAboutFeatures = (newFeatures: any[]) => {
    handleUpdateConfig('about_features', newFeatures);
  };

  const addAboutFeature = () => {
    updateAboutFeatures([...currentAboutFeatures, { title: '● 新亮点', desc: '简短描述文字...' }]);
  };

  const deleteAboutFeature = (idx: number) => {
    updateAboutFeatures(currentAboutFeatures.filter((_: any, i: number) => i !== idx));
  };

  const updateIndustries = (newIndustries: any[]) => {
    handleUpdateConfig('industries', newIndustries);
  };

  const updatePainPoints = (newPoints: any[]) => {
    handleUpdateConfig('pain_points', newPoints);
  };

  const updateNavLinks = (newLinks: any[]) => {
    handleUpdateConfig('navbar_links', newLinks);
  };

  const updateContactItems = (newItems: any[]) => {
    handleUpdateConfig('contact_items', newItems);
  };

  const updateFormFields = (newFields: any[]) => {
    handleUpdateConfig('contact_form_fields', newFields);
  };

  const updateServiceSteps = (newSteps: any[]) => {
    handleUpdateConfig('service_steps', newSteps);
  };

  const addPainPoint = () => {
    const newItem = { title: '新痛点', desc: '简述', more: '详细解析内容', icon: 'Search' };
    updatePainPoints([...currentPainPoints, newItem]);
  };

  const deletePainPoint = (idx: number) => {
    if (confirm('确定删除吗？')) {
      updatePainPoints(currentPainPoints.filter((_: any, i: number) => i !== idx));
    }
  };

  const addIndustry = () => {
    const newItem = { 
      id: `ind-${Date.now()}`, 
      name: '新行业方案', 
      description: '简短首页描述', 
      image: 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=800',
      fullContent: '详细方案解析文字...' 
    };
    updateIndustries([...currentIndustries, newItem]);
  };

  const deleteIndustry = (idx: number) => {
    if (confirm('确定要移除此行业方案吗？')) {
      updateIndustries(currentIndustries.filter((_: any, i: number) => i !== idx));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="text-slate-500 font-medium italic">数贸融云端管理同步中...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-6 hidden lg:flex shrink-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">数</div>
          <div>
            <div className="font-bold tracking-tight">数贸融管理后台</div>
            <div className="text-[10px] text-slate-400 tracking-widest uppercase">Content OS</div>
          </div>
        </div>
        
        <nav className="flex-grow space-y-2">
          <button onClick={() => setActiveTab('navbar')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'navbar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><LayoutDashboard size={18}/> 导航设置</div>
            <ChevronRight size={14} className={activeTab === 'navbar' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'hero' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><Type size={18}/> 首页标语</div>
            <ChevronRight size={14} className={activeTab === 'hero' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'about' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><Info size={18}/> 关于我们</div>
            <ChevronRight size={14} className={activeTab === 'about' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('service-path')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'service-path' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><ChevronRight size={18}/> 服务路径</div>
            <ChevronRight size={14} className={activeTab === 'service-path' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('pain-points')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'pain-points' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><Zap size={18}/> 痛点互动</div>
            <ChevronRight size={14} className={activeTab === 'pain-points' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><Layers size={18}/> 服务矩阵</div>
            <ChevronRight size={14} className={activeTab === 'products' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('industries')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'industries' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><ImageIcon size={18}/> 行业方案</div>
            <ChevronRight size={14} className={activeTab === 'industries' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'contact' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><Mail size={18}/> 咨询互动</div>
            <ChevronRight size={14} className={activeTab === 'contact' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('leads')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'leads' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><FileText size={18}/> 咨询线索</div>
            <ChevronRight size={14} className={activeTab === 'leads' ? 'opacity-100' : 'opacity-0'} />
          </button>
          <button onClick={() => setActiveTab('footer')} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all ${activeTab === 'footer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3"><Layout size={18}/> 页脚设置</div>
            <ChevronRight size={14} className={activeTab === 'footer' ? 'opacity-100' : 'opacity-0'} />
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-slate-400 hover:text-red-400 transition-all font-medium">
            <LogOut size={18} /> 安全退出
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                  {activeTab === 'navbar' && '站点导航与全局配置'}
                  {activeTab === 'hero' && '可视化标题管理'}
                  {activeTab === 'about' && '关于我们页面编辑'}
                  {activeTab === 'service-path' && '服务路径与步骤管理'}
                  {activeTab === 'pain-points' && '核心痛点互动编辑器'}
                  {activeTab === 'products' && '产品矩阵与二级页管理'}
                  {activeTab === 'industries' && '行业解决方案管理'}
                  {activeTab === 'contact' && '表单与联系方式设置'}
                  {activeTab === 'leads' && '网站咨询线索 (Leads)'}
                  {activeTab === 'footer' && '页脚内容管理'}
                </h1>
                {connStatus === 'error' && (
                  <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded font-black animate-pulse cursor-help" title={lastError || 'Unknown connection error'}>
                    DB DISCONNECTED
                  </span>
                )}
                {connStatus === 'connected' && (
                  <span className="bg-green-100 text-green-600 text-[10px] px-2 py-1 rounded font-black">SYNC ACTIVE</span>
                )}
              </div>
              <p className="text-gray-500">修改后请同步，新内容将即时呈现在官网中。</p>
            </div>
            
                    <button 
                      type="button"
                      onClick={handleGlobalSync}
                      disabled={saving}
                      className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50"
                    >
                      <Save size={20} /> {saving ? '正在同步云端...' : '提交并同步至线上'}
                    </button>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* NAVBAR TAB */}
            {activeTab === 'navbar' && (
              <div className="space-y-8">
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                      公司品牌名称 (Logo文字)
                    </label>
                    <input 
                      className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-xl font-bold"
                      value={siteConfig.company_logo_text || '数贸融出海服务'}
                      onChange={(e) => handleUpdateConfig('company_logo_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-4 border-t border-slate-50 pt-10">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                      品牌副标题/英文名称 (Logo副标题)
                    </label>
                    <input 
                      className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-xl font-mono"
                      placeholder="例如：DIGITRADE FINTECH"
                      value={siteConfig.company_logo_subtitle || ''}
                      onChange={(e) => handleUpdateConfig('company_logo_subtitle', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 border-t border-slate-50 pt-10">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                      <ImageIcon className="text-blue-600 w-4 h-4" /> 公司 Logo 图片
                    </label>
                    <div className="w-full min-h-[120px] bg-slate-100 rounded-3xl overflow-hidden mb-4 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 transition-all hover:bg-slate-50">
                      {siteConfig.logo_url ? (
                        <div className="flex flex-col items-center justify-center bg-white p-2 rounded-xl shadow-inner w-24 h-24 border border-slate-100 overflow-hidden">
                          {(() => {
                            const img = siteConfig.logo_url || '';
                            const isDataImage = img.startsWith('data:');
                            const isUrlImage = img.startsWith('http') || img.startsWith('/');
                            const displayUrl = img;
                            return (
                              <img 
                                src={displayUrl} 
                                className="max-w-full max-h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-slate-400 text-xs italic">尚未设置 Logo 图片</span>
                          <p className="text-[10px] text-slate-500">将显示文字 Logo：{siteConfig.company_logo_text || '数贸融'}</p>
                        </div>
                      )}
                    </div>
                    
                    <ImageUploadField 
                      value={siteConfig.logo_url}
                      onChange={(val) => handleUpdateConfig('logo_url', val)}
                      placeholder="输入 Logo 图片 URL 或上传文件"
                    />
                    <p className="text-[10px] text-slate-400 mt-2">提示：支持 PNG, SVG, JPG。Logo 图片将与品牌名称并排显示。</p>
                  </div>
                  
                  <div className="space-y-4 border-t border-slate-50 pt-10">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                      页脚公司简介文字 (支持换行)
                    </label>
                    <textarea 
                      className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-sm leading-relaxed"
                      rows={3}
                      value={siteConfig.footer_description || '专注于跨境贸易本土化全链路赋能的智能服务中心。我们不仅是服务提供者，更是客户的海外增长合伙人。'}
                      onChange={(e) => handleUpdateConfig('footer_description', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 border-t border-slate-50 pt-10">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                      社交媒体与外部链接 (WeChat, LinkedIn 等)
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400">领英链接 (LinkedIn URL)</label>
                        <input 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                          value={siteConfig.social_linkedin || ''}
                          onChange={(e) => handleUpdateConfig('social_linkedin', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400">领英图标</label>
                        <select 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          value={siteConfig.social_linkedin_icon || 'Globe'}
                          onChange={(e) => handleUpdateConfig('social_linkedin_icon', e.target.value)}
                        >
                          {AVAILABLE_ICONS.map(icon => <option key={icon.name} value={icon.name}>{icon.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400">微信 ID/二维码描述</label>
                        <input 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                          value={siteConfig.social_wechat || ''}
                          onChange={(e) => handleUpdateConfig('social_wechat', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400">微信图标</label>
                        <select 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          value={siteConfig.social_wechat_icon || 'MessageSquare'}
                          onChange={(e) => handleUpdateConfig('social_wechat_icon', e.target.value)}
                        >
                          {AVAILABLE_ICONS.map(icon => <option key={icon.name} value={icon.name}>{icon.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-slate-50 pt-10">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                      SEO 搜索引擎优化
                    </label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400">首页搜索描述 (Meta Description)</label>
                        <textarea 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                          rows={2}
                          value={siteConfig.seo_description || '中澳落地赋能全景全周期服务。'}
                          onChange={(e) => handleUpdateConfig('seo_description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 border-t border-slate-50 pt-10">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                       <label className="text-sm font-bold">主导航链接</label>
                       <button 
                        onClick={() => updateNavLinks([...currentNavLinks, { name: '新链接', href: '#' }])}
                        className="text-blue-600 text-sm font-bold flex items-center gap-1"
                       >
                         <Plus size={16}/> 增加链接
                       </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentNavLinks.map((link: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 bg-white border border-slate-100 p-4 rounded-2xl group shadow-sm">
                          <div className="flex-grow grid grid-cols-2 gap-3">
                            <input 
                              className="w-full text-sm font-bold border-none outline-none focus:ring-0 bg-transparent"
                              placeholder="显示名称"
                              value={link.name}
                              onChange={(e) => {
                                const newList = [...currentNavLinks];
                                newList[idx].name = e.target.value;
                                updateNavLinks(newList);
                              }}
                            />
                            <input 
                              className="w-full text-xs font-mono text-slate-400 border-none outline-none focus:ring-0 bg-transparent"
                              placeholder="跳转地址"
                              value={link.href}
                              onChange={(e) => {
                                const newList = [...currentNavLinks];
                                newList[idx].href = e.target.value;
                                updateNavLinks(newList);
                              }}
                            />
                          </div>
                          <button onClick={() => updateNavLinks(currentNavLinks.filter((_: any, i: number) => i !== idx))} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HERO TAB */}
            {activeTab === 'hero' && (
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
                <div className="space-y-6">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                    <ImageIcon className="text-blue-600 w-4 h-4" /> 首页大图 (Hero Background)
                  </label>
                  <div className="w-full h-48 bg-slate-100 rounded-3xl overflow-hidden mb-8 border-2 border-dashed border-slate-200">
                    <img 
                      src={siteConfig.hero_image_url || 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1920'} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <ImageUploadField 
                    value={siteConfig.hero_image_url}
                    onChange={(val) => handleUpdateConfig('hero_image_url', val)}
                    placeholder="输入背景图 URL"
                  />
                </div>

                <div className="space-y-4 border-t border-slate-50 pt-10">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                    <Type className="text-blue-600 w-4 h-4" /> Hero Title (主标题 - 支持换行)
                  </label>
                  <textarea 
                    className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-2xl font-bold leading-relaxed"
                    rows={2}
                    value={siteConfig.hero_title || ''}
                    onChange={(e) => handleUpdateConfig('hero_title', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-slate-50 pt-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">主按钮文字</label>
                    <input className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.hero_btn_1_text || '获取定制方案'} onChange={(e) => handleUpdateConfig('hero_btn_1_text', e.target.value)} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">副按钮文字</label>
                    <input className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.hero_btn_2_text || '查看服务矩阵'} onChange={(e) => handleUpdateConfig('hero_btn_2_text', e.target.value)} />
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-50 pt-10">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                    <Type className="text-blue-600 w-4 h-4" /> Hero Subtitle (副标题 - 支持换行)
                  </label>
                  <textarea 
                    className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-gray-600 leading-loose"
                    rows={4}
                    value={siteConfig.hero_subtitle || ''}
                    onChange={(e) => handleUpdateConfig('hero_subtitle', e.target.value)}
                  />
                </div>

                <div className="space-y-6 border-t border-slate-50 pt-10">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                    <BarChart3 className="text-blue-600 w-4 h-4" /> 核心数据面板 (Hero Stats & Badge)
                  </label>
                  
                  <div className="grid md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-3xl">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">顶部悬浮标签 (Badge Text)</label>
                      <input className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200" value={siteConfig.hero_badge_text || '澳大利亚出海一站式服务中心'} onChange={(e) => handleUpdateConfig('hero_badge_text', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">数据 1</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-center font-bold text-blue-600" 
                        placeholder="值 (如 15+ 年)"
                        value={siteConfig.hero_stat_1_value || ''} 
                        onChange={(e) => handleUpdateConfig('hero_stat_1_value', e.target.value)} 
                      />
                      <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-center text-xs" 
                        placeholder="描述 (如 中澳贸易深耕)"
                        value={siteConfig.hero_stat_1_label || ''} 
                        onChange={(e) => handleUpdateConfig('hero_stat_1_label', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">数据 2</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-center font-bold text-blue-600" 
                        placeholder="值 (如 500+)"
                        value={siteConfig.hero_stat_2_value || ''} 
                        onChange={(e) => handleUpdateConfig('hero_stat_2_value', e.target.value)} 
                      />
                      <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-center text-xs" 
                        placeholder="描述 (如 服务企业案例)"
                        value={siteConfig.hero_stat_2_label || ''} 
                        onChange={(e) => handleUpdateConfig('hero_stat_2_label', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">数据 3</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-center font-bold text-blue-600" 
                        placeholder="值 (如 60%)"
                        value={siteConfig.hero_stat_3_value || ''} 
                        onChange={(e) => handleUpdateConfig('hero_stat_3_value', e.target.value)} 
                      />
                      <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-center text-xs" 
                        placeholder="描述 (如 落地效率提升)"
                        value={siteConfig.hero_stat_3_label || ''} 
                        onChange={(e) => handleUpdateConfig('hero_stat_3_label', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
                <div className="space-y-6">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                    <ImageIcon className="text-blue-600 w-4 h-4" /> 关于我们 配图 (About Image)
                  </label>
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="w-full aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative">
                      <img 
                        src={siteConfig.about_image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 scale-75 origin-bottom-right">
                        <div className="text-xl font-bold text-blue-600">{siteConfig.about_stat_value || '10+'}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{siteConfig.about_stat_label || '中澳跨国专家'}</div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <ImageUploadField 
                        value={siteConfig.about_image_url}
                        onChange={(val) => handleUpdateConfig('about_image_url', val)}
                        placeholder="输入配图 URL 或上传文件"
                      />
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">浮层数据 (如 10+)</label>
                           <input 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-blue-600"
                            value={siteConfig.about_stat_value || '10+'}
                            onChange={(e) => handleUpdateConfig('about_stat_value', e.target.value)}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">数据描述 (如 品牌专家)</label>
                           <input 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                            value={siteConfig.about_stat_label || '中澳跨国专家'}
                            onChange={(e) => handleUpdateConfig('about_stat_label', e.target.value)}
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                      <Type className="text-blue-600 w-4 h-4" /> About Badge (小标题)
                    </label>
                    <input 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-sm font-bold text-blue-600"
                      value={siteConfig.about_badge_text || '关于数贸融'}
                      onChange={(e) => handleUpdateConfig('about_badge_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                      <Type className="text-blue-600 w-4 h-4" /> About Title (主标题)
                    </label>
                    <input 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-sm font-bold"
                      value={siteConfig.about_title || '您的澳洲落地与增量 战略级合伙人'}
                      onChange={(e) => handleUpdateConfig('about_title', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 border-t border-slate-50 pt-10">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                    <Type className="text-blue-600 w-4 h-4" /> About Content (详细内容介绍 - 支持换行)
                  </label>
                  <textarea 
                    className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-gray-600 leading-relaxed"
                    rows={10}
                    value={siteConfig.about_content || ''}
                    onChange={(e) => handleUpdateConfig('about_content', e.target.value)}
                  />
                </div>

                <div className="space-y-6 border-t border-slate-50 pt-10">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                     <label className="text-sm font-bold">核心优势亮点</label>
                     <button 
                      onClick={addAboutFeature}
                      className="text-blue-600 text-sm font-bold flex items-center gap-1"
                     >
                       <Plus size={16}/> 增加亮点
                     </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentAboutFeatures.map((feature: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-3 bg-white border border-slate-100 p-6 rounded-3xl group shadow-sm relative">
                        <button onClick={() => deleteAboutFeature(idx)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">亮点名称</label>
                           <input 
                            className="w-full text-blue-600 font-bold border-b border-slate-100 focus:border-blue-600 outline-none bg-transparent"
                            value={feature.title}
                            onChange={(e) => {
                              const newList = [...currentAboutFeatures];
                              newList[idx].title = e.target.value;
                              updateAboutFeatures(newList);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">亮点描述</label>
                           <textarea 
                            className="w-full text-xs text-slate-500 border-none outline-none focus:ring-0 bg-transparent resize-none"
                            rows={2}
                            value={feature.desc}
                            onChange={(e) => {
                              const newList = [...currentAboutFeatures];
                              newList[idx].desc = e.target.value;
                              updateAboutFeatures(newList);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SERVICE PATH TAB */}
            {activeTab === 'service-path' && (
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">板块小标题</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.service_path_title || '服务路径'} onChange={(e) => handleUpdateConfig('service_path_title', e.target.value)} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">板块主标题</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.service_path_heading || '我们如何帮助企业在澳洲成功？'} onChange={(e) => handleUpdateConfig('service_path_heading', e.target.value)} />
                  </div>
                </div>

                <div className="space-y-6 border-t border-slate-50 pt-10">
                  <label className="text-sm font-bold">服务步骤 (按顺序排序)</label>
                  <div className="grid gap-4">
                    {currentServiceSteps.map((step: any, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 group">
                        <div className="flex items-center gap-4 md:w-1/3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">{idx + 1}</div>
                          <input 
                            className="bg-transparent border-none outline-none font-bold focus:ring-0 w-full"
                            value={step.title}
                            onChange={(e) => {
                              const newList = [...currentServiceSteps];
                              newList[idx].title = e.target.value;
                              updateServiceSteps(newList);
                            }}
                          />
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">步骤图标</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs outline-none"
                              value={step.icon || 'Globe'}
                              onChange={(e) => {
                                const newList = [...currentServiceSteps];
                                newList[idx].icon = e.target.value;
                                updateServiceSteps(newList);
                              }}
                            >
                              {AVAILABLE_ICONS.map(icon => (
                                <option key={icon.name} value={icon.name}>{icon.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <input 
                            className="bg-transparent border-none outline-none text-slate-500 text-sm focus:ring-0 w-full italic"
                            value={step.desc}
                            onChange={(e) => {
                              const newList = [...currentServiceSteps];
                              newList[idx].desc = e.target.value;
                              updateServiceSteps(newList);
                            }}
                          />
                        </div>
                        <button onClick={() => updateServiceSteps(currentServiceSteps.filter((_: any, i: number) => i !== idx))} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateServiceSteps([...currentServiceSteps, { title: '新步骤', desc: 'Step Description' }])}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> 添加服务步骤
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PAIN POINTS TAB */}
            {activeTab === 'pain-points' && (
              <div className="space-y-8">
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">板块小标题</label>
                      <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.pain_points_title || '核心痛点分析'} onChange={(e) => handleUpdateConfig('pain_points_title', e.target.value)} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">板块主标题</label>
                      <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.pain_points_heading || '为什么出海澳洲总是“水土不服”？'} onChange={(e) => handleUpdateConfig('pain_points_heading', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                   <h3 className="font-bold">痛点卡片设置</h3>
                   <button onClick={addPainPoint} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm"><Plus size={18}/> 增加痛点</button>
                </div>
                
                {currentPainPoints.length === 0 && (
                   <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
                     <p className="text-slate-400">目前暂无痛点数据，点击上方“增加痛点”开始编辑。</p>
                   </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  {currentPainPoints.map((point: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 space-y-6 group relative">
                      <button onClick={() => deletePainPoint(idx)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">#{idx + 1}</div>
                          <input 
                            className="font-bold text-lg border-b border-transparent focus:border-blue-200 outline-none w-48"
                            value={point.title}
                            onChange={(e) => {
                              const newList = [...currentPainPoints];
                              newList[idx].title = e.target.value;
                              updatePainPoints(newList);
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <select 
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none"
                            value={point.icon || 'Search'}
                            onChange={(e) => {
                              const newList = [...currentPainPoints];
                              newList[idx].icon = e.target.value;
                              updatePainPoints(newList);
                            }}
                          >
                            {AVAILABLE_ICONS.map(icon => (
                              <option key={icon.name} value={icon.name}>{icon.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">痛点简述 (首页展示 - 支持换行)</label>
                          <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm" rows={2} value={point.desc} onChange={(e) => {
                            const newList = [...currentPainPoints];
                            newList[idx].desc = e.target.value;
                            updatePainPoints(newList);
                          }} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">互动详情 (点击展开显示 - 支持换行)</label>
                          <textarea className="w-full px-4 py-3 rounded-xl bg-blue-50/20 border border-blue-50 text-sm italic" rows={4} value={point.more} onChange={(e) => {
                            const newList = [...currentPainPoints];
                            newList[idx].more = e.target.value;
                            updatePainPoints(newList);
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-10">
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">服务板块小标题 (Badge)</label>
                      <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.services_badge_text || 'Service Architecture'} onChange={(e) => handleUpdateConfig('services_badge_text', e.target.value)} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">服务板块主标题</label>
                      <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.services_title || '“三阶六维”出海赋能全案'} onChange={(e) => handleUpdateConfig('services_title', e.target.value)} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">服务板块描述语</label>
                      <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.services_description || ''} onChange={(e) => handleUpdateConfig('services_description', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div>
                    <h3 className="font-bold text-lg">产品矩阵模块管理</h3>
                    <p className="text-sm text-slate-400">建议保持标准 6 大模块，点击可删除或新增自定义项</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button onClick={addProduct} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"><Plus size={18}/> 新增模块</button>
                  </div>
                </div>

                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 relative group transition-all hover:border-blue-200">
                    <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                       <span className="text-[10px] font-mono text-slate-300">ID: {product.id}</span>
                       <button 
                        onClick={(e) => {
                          e.preventDefault();
                          deleteProduct(product.id);
                        }} 
                        className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm active:scale-95"
                        title="删除此模块"
                       >
                        <Trash2 size={18} />
                       </button>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-12">
                      <div className="lg:w-1/3 space-y-6">
                        <div className="w-full aspect-video rounded-3xl bg-slate-100 overflow-hidden border border-slate-200 mb-4">
                          {(() => {
                            const imageUrl = product.image_url || '';
                            const isDataImage = imageUrl.startsWith('data:');
                            const isUrlImage = imageUrl.startsWith('http') || imageUrl.startsWith('/');
                            const isExternalImage = isDataImage || isUrlImage || (imageUrl.includes('.') && imageUrl.length > 5);
                            
                            const displayUrl = imageUrl;
                            // Add cache buster for external images to force refresh
                            const finalSrc = isExternalImage 
                              ? (imageUrl.startsWith('data:') ? displayUrl : `${displayUrl}${displayUrl.includes('?') ? '&' : '?'}t=${Date.now()}`)
                              : `https://picsum.photos/seed/${product.id}/800/600`;

                            return (
                              <img 
                                key={imageUrl}
                                src={finalSrc} 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (!target.src.includes('picsum.photos') && !isDataImage) {
                                    target.src = `https://picsum.photos/seed/${product.id}/800/600`;
                                  }
                                }}
                              />
                            );
                          })()}
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">图标 (与封面图共享字段, 若非 URL 则作为图标显示)</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs outline-none"
                            value={AVAILABLE_ICONS.some(i => i.name === product.image_url) ? product.image_url : 'Custom'}
                            onChange={(e) => {
                              if (e.target.value !== 'Custom') {
                                handleUpdateProduct(product.id, 'image_url', e.target.value);
                              }
                            }}
                          >
                            <option value="Custom">使用自定义图片 URL</option>
                            {AVAILABLE_ICONS.map(icon => (
                              <option key={icon.name} value={icon.name}>{icon.label}</option>
                            ))}
                          </select>
                        </div>
                        <ImageUploadField 
                          label="产品封面 (URL 或上传)"
                          value={product.image_url}
                          onChange={(val) => handleUpdateProduct(product.id, 'image_url', val)}
                          placeholder="图片 URL 或上传"
                        />
                      </div>
                      <div className="lg:w-2/3 space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">产品名称</label>
                            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold" value={product.title} onChange={(e) => handleUpdateProduct(product.id, 'title', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">起售价文字</label>
                            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono" value={product.price} onChange={(e) => handleUpdateProduct(product.id, 'price', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">适合阶段/服务标签</label>
                            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-blue-600" value={product.stage || ''} onChange={(e) => handleUpdateProduct(product.id, 'stage', e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase">产品核心优势 (JSON格式数组)</label>
                           <input className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-xs text-blue-600" value={product.features} onChange={(e) => handleUpdateProduct(product.id, 'features', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">产品矩阵深度解析 (详细介绍 - 支持换行)</label>
                          <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm h-[140px] leading-relaxed" value={product.description} onChange={(e) => handleUpdateProduct(product.id, 'description', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                )}

            {/* INDUSTRIES TAB */}
            {activeTab === 'industries' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div>
                    <h3 className="font-bold text-lg">行业方案展现管理</h3>
                    <p className="text-sm text-slate-400">管理行业板块的背景图与核心介绍文字</p>
                  </div>
                  <button onClick={addIndustry} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm"><Plus size={18}/> 新增方案</button>
                </div>

                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">板块小标题</label>
                      <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.industries_title || '行业解决方案'} onChange={(e) => handleUpdateConfig('industries_title', e.target.value)} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">板块主标题</label>
                      <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.industries_heading || '深耕昆州战略优势产业'} onChange={(e) => handleUpdateConfig('industries_heading', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-4 border-t border-slate-50 pt-8">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">详情页通用配置：核心赋能维度 (3项)</label>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                        <input className="w-full font-bold bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none" value={siteConfig.ind_feat1_title || '快速准入'} onChange={(e) => handleUpdateConfig('ind_feat1_title', e.target.value)} />
                        <textarea className="w-full text-xs text-slate-500 bg-transparent border-none outline-none focus:ring-0" rows={2} value={siteConfig.ind_feat1_desc || '协助完成行业相关的资质认证与合规审查。'} onChange={(e) => handleUpdateConfig('ind_feat1_desc', e.target.value)} />
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                        <input className="w-full font-bold bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none" value={siteConfig.ind_feat2_title || '当地资源'} onChange={(e) => handleUpdateConfig('ind_feat2_title', e.target.value)} />
                        <textarea className="w-full text-xs text-slate-500 bg-transparent border-none outline-none focus:ring-0" rows={2} value={siteConfig.ind_feat2_desc || '对接澳洲本土核心产业公会与政府监管机构。'} onChange={(e) => handleUpdateConfig('ind_feat2_desc', e.target.value)} />
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                        <input className="w-full font-bold bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none" value={siteConfig.ind_feat3_title || '合规风控'} onChange={(e) => handleUpdateConfig('ind_feat3_title', e.target.value)} />
                        <textarea className="w-full text-xs text-slate-500 bg-transparent border-none outline-none focus:ring-0" rows={2} value={siteConfig.ind_feat3_desc || '提供澳洲法律框架下的全方位合规咨询。'} onChange={(e) => handleUpdateConfig('ind_feat3_desc', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {currentIndustries.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 relative group animate-in fade-in slide-in-from-right-4">
                    <button onClick={() => deleteIndustry(idx)} className="absolute top-6 right-6 p-3 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 rounded-2xl opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                    <div className="flex flex-col xl:flex-row gap-10">
                      <div className="xl:w-80 shrink-0 space-y-6">
                        <div className="w-full h-48 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 mb-6">
                          <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <ImageUploadField 
                          label="背景图片"
                          value={item.image}
                          onChange={(val) => {
                            const newList = [...currentIndustries];
                            newList[idx].image = val;
                            updateIndustries(newList);
                          }}
                          placeholder="方案背景图 URL"
                        />
                      </div>
                      <div className="flex-grow space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <input className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-lg" value={item.name} onChange={(e) => {
                            const newList = [...currentIndustries];
                            newList[idx].name = e.target.value;
                            updateIndustries(newList);
                          }} />
                          <input className="w-full px-4 py-3 rounded-xl border border-slate-200" value={item.description} onChange={(e) => {
                            const newList = [...currentIndustries];
                            newList[idx].description = e.target.value;
                            updateIndustries(newList);
                          }} />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">详情页二级页面内容 (支持详细方案管理 - 支持换行)</label>
                          <textarea 
                            className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-sm leading-relaxed" 
                            rows={6}
                            placeholder="在此输入该行业的详尽解决方案、成功案例或市场机遇分析..."
                            value={item.fullContent || ''} 
                            onChange={(e) => {
                              const newList = [...currentIndustries];
                              newList[idx].fullContent = e.target.value;
                              updateIndustries(newList);
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 max-w-4xl mx-auto space-y-10 font-sans">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">联系板块小标题 (Badge)</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-lg font-bold text-blue-600" value={siteConfig.contact_badge_text || '联系我们'} onChange={(e) => handleUpdateConfig('contact_badge_text', e.target.value)} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">联系板块主标题</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-lg font-bold" value={siteConfig.contact_title || ''} onChange={(e) => handleUpdateConfig('contact_title', e.target.value)} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">联系板块副标题 (Heading)</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-lg font-bold" value={siteConfig.contact_heading || ''} onChange={(e) => handleUpdateConfig('contact_heading', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-6 border-t border-slate-50 pt-10">
                   <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-balance">联系方式项 (电子邮箱、电话、地址等)</label>
                     <button 
                      onClick={() => updateContactItems([...currentContactItems, { icon: 'Mail', label: '新项', value: 'example@email.com' }])}
                      className="text-blue-600 text-xs font-bold flex items-center gap-1"
                     >
                       <Plus size={14}/> 添加联系项
                     </button>
                   </div>
                   
                   <div className="space-y-4">
                     {currentContactItems.map((item: any, idx: number) => (
                       <div key={idx} className="flex flex-col md:flex-row gap-4 bg-white border border-slate-100 p-6 rounded-3xl group shadow-sm relative">
                          <button 
                            onClick={() => updateContactItems(currentContactItems.filter((_: any, i: number) => i !== idx))}
                            className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16}/>
                          </button>
                          
                          <div className="md:w-32 space-y-2">
                             <label className="text-[10px] font-bold text-slate-300 uppercase">图标</label>
                             <select 
                              className="w-full p-2 bg-slate-50 rounded-lg text-[10px] outline-none"
                              value={item.icon || 'Mail'}
                              onChange={(e) => {
                                const newList = [...currentContactItems];
                                newList[idx].icon = e.target.value;
                                updateContactItems(newList);
                              }}
                             >
                               {AVAILABLE_ICONS.map(icon => (
                                 <option key={icon.name} value={icon.name}>{icon.label}</option>
                               ))}
                             </select>
                          </div>
                          
                          <div className="flex-grow grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-slate-300 uppercase">标签 (Label)</label>
                               <input 
                                className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold" 
                                value={item.label} 
                                onChange={(e) => {
                                  const newList = [...currentContactItems];
                                  newList[idx].label = e.target.value;
                                  updateContactItems(newList);
                                }} 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-slate-300 uppercase">数值 (Value)</label>
                               <input 
                                className="w-full p-2 bg-slate-50 rounded-lg text-xs" 
                                value={item.value} 
                                onChange={(e) => {
                                  const newList = [...currentContactItems];
                                  newList[idx].value = e.target.value;
                                  updateContactItems(newList);
                                }} 
                               />
                            </div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="space-y-4 border-t border-slate-50 pt-10">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">表单上方引导语 (支持换行)</label>
                  <textarea className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-gray-600 leading-relaxed" rows={3} value={siteConfig.contact_form_text || ''} onChange={(e) => handleUpdateConfig('contact_form_text', e.target.value)} />
                </div>
                <div className="space-y-6 border-t border-slate-50 pt-10">
                   <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">联系表单字段管理 (无需代码)</label>
                     <button 
                      onClick={() => updateFormFields([...currentFormFields, { name: `field_${Date.now()}`, label: '新文本项', placeholder: '请输入...', type: 'text', required: true }])}
                      className="text-blue-600 text-xs font-bold"
                     >
                       + 添加输入项
                     </button>
                   </div>
                   
                   <div className="space-y-4">
                     {currentFormFields.map((field: any, idx: number) => (
                       <div key={idx} className="grid md:grid-cols-4 gap-4 items-end bg-white border border-slate-100 p-6 rounded-3xl group shadow-sm">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-300 uppercase">标识名 (ID)</label>
                             <input className="w-full p-2 bg-slate-50 rounded-lg text-xs" value={field.name} onChange={(e) => {
                               const newList = [...currentFormFields];
                               newList[idx].name = e.target.value;
                               updateFormFields(newList);
                             }} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-300 uppercase">显示标签 (Label)</label>
                             <input className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold" value={field.label} onChange={(e) => {
                               const newList = [...currentFormFields];
                               newList[idx].label = e.target.value;
                               updateFormFields(newList);
                             }} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-300 uppercase">占位提示词 (Placeholder)</label>
                             <input className="w-full p-2 bg-slate-50 rounded-lg text-xs" value={field.placeholder} onChange={(e) => {
                               const newList = [...currentFormFields];
                               newList[idx].placeholder = e.target.value;
                               updateFormFields(newList);
                             }} />
                          </div>
                          <div className="flex items-center gap-2">
                            <select className="flex-grow p-2 bg-slate-50 rounded-lg text-xs" value={field.type} onChange={(e) => {
                               const newList = [...currentFormFields];
                               newList[idx].type = e.target.value;
                               updateFormFields(newList);
                             }}>
                              <option value="text">文本 (Text)</option>
                              <option value="email">邮箱 (Email)</option>
                              <option value="textarea">多行文本 (Textarea)</option>
                            </select>
                            <button onClick={() => updateFormFields(currentFormFields.filter((_: any, i: number) => i !== idx))} className="bg-red-50 text-red-400 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {/* LEADS TAB */}
            {activeTab === 'leads' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                   <div>
                     <h3 className="font-bold">咨询线索列表</h3>
                     <p className="text-sm text-slate-400">所有来自官网联系表单的客户咨询</p>
                   </div>
                   <button onClick={fetchData} className="text-blue-600 font-bold text-sm">刷新列表</button>
                </div>

                {leadsError && (
                  <div className="bg-red-50 border border-red-200 rounded-3xl p-8 mb-6">
                    <p className="text-red-700 font-bold mb-4 flex items-center gap-2">
                      <Info size={18} /> 获取线索失败 (Debug 信息)
                    </p>
                    <div className="bg-white/50 p-4 rounded-xl text-red-600 text-sm mb-6 font-mono">
                      {leadsError}
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-gray-700 font-bold text-sm">如何修复？请在 Supabase SQL Editor 中运行以下代码：</p>
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs overflow-x-auto">
                        {`-- 1. 创建 leads 表 (如果不存在)
CREATE TABLE IF NOT EXISTS public.leads (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    source TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    industry TEXT,
    requirements TEXT,
    data JSONB
);

-- 2. 开启 RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. 允许任何人提交咨询 (INSERT)
CREATE POLICY "Allow public insert" ON public.leads FOR INSERT WITH CHECK (true);

-- 4. 允许已登录管理员读取 (SELECT)
CREATE POLICY "Allow authenticated read" ON public.leads FOR SELECT TO authenticated USING (true);`}
                      </pre>
                    </div>
                  </div>
                )}

                {leads.length === 0 ? (
                  <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 italic">目前暂无咨询线索</p>
                    {!leadsError && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-2xl mx-auto max-w-sm">
                        <p className="text-blue-600 text-[10px] font-bold">数据连通正常，表内目前为空。</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {leads.map((lead: any) => {
                      // 极致兼容性：展示所有非保留字段
                      const rawLead = lead;
                      const nestedData = lead.data && typeof lead.data === 'object' ? lead.data : {};
                      const displayData = { ...rawLead, ...nestedData };
                      
                      const displayName = displayData.name || displayData.company || displayData.email || displayData.phone || '线索 #' + lead.id;
                      const displayTime = lead.created_at || lead.submitted_at || lead.updated_at;

                      return (
                        <div key={lead.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
                          <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Mail size={20}/></div>
                              <div>
                                 <div className="font-bold text-lg">{String(displayName)}</div>
                                 <div className="text-slate-400 text-xs">
                                   时间: {displayTime ? new Date(displayTime).toLocaleString() : '最近'}
                                 </div>
                              </div>
                            </div>
                            <div className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              New Lead
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Object.entries(displayData).map(([key, value]: any) => {
                              // 隐藏不需要显示的系统字段
                              if (['id', 'created_at', 'submitted_at', 'data', 'updated_at', 'source'].includes(key)) return null;
                              if (value === null || value === undefined || value === '') return null;
                              if (typeof value === 'object' && Object.keys(value).length === 0) return null;
                              
                              return (
                                <div key={key}>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{key}</div>
                                  <div className="text-gray-700 bg-slate-50 px-4 py-2 rounded-xl text-sm break-all">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </div>
                                </div>
                              );
                            })}
                            {displayData.source && (
                              <div className="col-span-full border-t border-slate-50 pt-4 mt-2">
                                <div className="text-[10px] font-bold text-slate-300 uppercase mb-1">来源页面 (Source)</div>
                                <div className="text-slate-400 text-xs italic">{displayData.source}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="space-y-8">
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">版权信息 (Copyright)</label>
                    <input 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none" 
                      placeholder={`© ${new Date().getFullYear()} 数贸融出海服务中心. All rights reserved.`}
                      value={siteConfig.footer_copyright || ''} 
                      onChange={(e) => handleUpdateConfig('footer_copyright', e.target.value)} 
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">隐私政策链接文字</label>
                      <input 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none" 
                        placeholder="隐私政策"
                        value={siteConfig.footer_privacy_text || ''} 
                        onChange={(e) => handleUpdateConfig('footer_privacy_text', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">服务条款链接文字</label>
                      <input 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none" 
                        placeholder="服务条款"
                        value={siteConfig.footer_terms_text || ''} 
                        onChange={(e) => handleUpdateConfig('footer_terms_text', e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <p className="text-xs text-blue-600 leading-relaxed font-medium">
                      提示：此处仅支持修改底部文字内容。如有法律合规变动，请同步更新隐私政策和服务条款的对应内容。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
