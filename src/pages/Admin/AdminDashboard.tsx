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
  FileText
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connStatus, setConnStatus] = useState<'connected' | 'error' | 'unknown'>('unknown');
  const [activeTab, setActiveTab] = useState<'navbar' | 'hero' | 'about' | 'service-path' | 'products' | 'industries' | 'contact' | 'pain-points' | 'leads'>('navbar');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. 连通性测试
      const { error: pingError } = await supabase.from('site_config').select('key').limit(1);
      if (pingError) {
        if (pingError.message.includes('Failed to fetch')) {
          setConnStatus('error');
        }
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
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (leadsData) setLeads(leadsData);
      
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
    // 基础连接项检查
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('placeholder')) {
      alert('【连接受限】检测到 VITE_SUPABASE_URL 尚未正确配置。请在 Settings 菜单或 .env 文件中填入真实的 Supabase 项目地址与 Anon Key。');
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
      
      if (!fetchCloudError) {
        const cloudIds = (cloudProducts || []).map(cp => Number(cp.id));
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
        // 使用 Upsert 而不是 Insert 解决冲突并绕过 identity 限制（如果项已存在）
        const { error: upsertError } = await supabase.from('products').upsert(syncPayloads, { onConflict: 'id' });
        
        if (upsertError) {
          console.warn('批量 Upsert 受阻，启动降级逐行同步...', upsertError.message);
          const isIdentityError = upsertError.message.includes('non-DEFAULT value');
          const isStageMissing = upsertError.message.includes('column "stage" does not exist');
          
          for (const payload of syncPayloads) {
            const finalPayload = { ...payload };
            if (isStageMissing) delete (finalPayload as any).stage;
            
            // 降级尝试：如果项存在，由于 Identity 限制，Insert 肯定失败，但 Upsert 可能失败（如果底层转 Insert）。
            // 这里我们用 Upsert 以覆盖为主。
            const { error: rowError } = await supabase.from('products').upsert(finalPayload, { onConflict: 'id' });
            
            if (rowError) {
              console.error(`模块 [${payload.id}] 同步失败:`, rowError.message);
              // 如果是严重的 identity 错误且项不存在，这里可能依旧会报。
            } else {
              successCount++;
            }
          }
        } else {
          successCount = syncPayloads.length;
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

  const currentIndustries = getConfig('industries', []);
  const currentPainPoints = getConfig('pain_points', []);
  const currentNavLinks = getConfig('navbar_links', [
    { name: '服务体系', href: '/#services' },
    { name: '行业方案', href: '/#industries' },
    { name: '服务路径', href: '/#how-it-works' },
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

  const updateIndustries = (newIndustries: any[]) => {
    handleUpdateConfig('industries', newIndustries);
  };

  const updatePainPoints = (newPoints: any[]) => {
    handleUpdateConfig('pain_points', newPoints);
  };

  const updateNavLinks = (newLinks: any[]) => {
    handleUpdateConfig('navbar_links', newLinks);
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
                </h1>
                {connStatus === 'error' && (
                  <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded font-black animate-pulse">DB DISCONNECTED</span>
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
                      页脚公司简介文字
                    </label>
                    <textarea 
                      className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-sm leading-relaxed"
                      rows={3}
                      value={siteConfig.footer_description || '专注于跨境贸易本土化全链路赋能的智能服务中心。我们不仅是服务提供者，更是客户的海外增长合伙人。'}
                      onChange={(e) => handleUpdateConfig('footer_description', e.target.value)}
                    />
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
                    <Type className="text-blue-600 w-4 h-4" /> Hero Title (主标题)
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
                    <Type className="text-blue-600 w-4 h-4" /> Hero Subtitle (副标题)
                  </label>
                  <textarea 
                    className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-gray-600 leading-loose"
                    rows={4}
                    value={siteConfig.hero_subtitle || ''}
                    onChange={(e) => handleUpdateConfig('hero_subtitle', e.target.value)}
                  />
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
                  <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden mb-4 border-2 border-dashed border-slate-200">
                    <img 
                      src={siteConfig.about_image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <ImageUploadField 
                    value={siteConfig.about_image_url}
                    onChange={(val) => handleUpdateConfig('about_image_url', val)}
                    placeholder="输入配图 URL 或上传文件"
                  />
                </div>

                <div className="space-y-4 border-t border-slate-50 pt-10">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                    <Type className="text-blue-600 w-4 h-4" /> About Title (关于我们标题)
                  </label>
                  <input 
                    className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-xl font-bold"
                    value={siteConfig.about_title || '您的澳洲落地与增量 战略级合伙人'}
                    onChange={(e) => handleUpdateConfig('about_title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-4 border-t border-slate-50 pt-10">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                    <Type className="text-blue-600 w-4 h-4" /> About Content (详细内容介绍)
                  </label>
                  <textarea 
                    className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all text-gray-600 leading-relaxed"
                    rows={10}
                    value={siteConfig.about_content || ''}
                    onChange={(e) => handleUpdateConfig('about_content', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-slate-50 pt-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">亮点1 标题</label>
                    <input className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.about_p1_title || '● 深度本地化'} onChange={(e) => handleUpdateConfig('about_p1_title', e.target.value)} />
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">亮点1 描述</label>
                    <input className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.about_p1_desc || '不只是翻译，更是品牌灵魂的二次植入。'} onChange={(e) => handleUpdateConfig('about_p1_desc', e.target.value)} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">亮点2 标题</label>
                    <input className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.about_p2_title || '● 全链路覆盖'} onChange={(e) => handleUpdateConfig('about_p2_title', e.target.value)} />
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">亮点2 描述</label>
                    <input className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200" value={siteConfig.about_p2_desc || '从0到1的冷启动，到1到10的规模化增长。'} onChange={(e) => handleUpdateConfig('about_p2_desc', e.target.value)} />
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
                            value={point.icon}
                            onChange={(e) => {
                              const newList = [...currentPainPoints];
                              newList[idx].icon = e.target.value;
                              updatePainPoints(newList);
                            }}
                          >
                            <option value="Search">Search (搜索)</option>
                            <option value="MapPin">MapPin (定位)</option>
                            <option value="TrendingUp">TrendingUp (增长)</option>
                            <option value="Briefcase">Briefcase (业务)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">痛点简述 (首页展示)</label>
                          <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm" rows={2} value={point.desc} onChange={(e) => {
                            const newList = [...currentPainPoints];
                            newList[idx].desc = e.target.value;
                            updatePainPoints(newList);
                          }} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">互动详情 (点击展开显示)</label>
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
                        <ImageUploadField 
                          label="产品封面"
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
                          <label className="text-[10px] font-bold text-slate-400 uppercase">产品矩阵深度解析 (详细介绍)</label>
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 max-w-4xl mx-auto space-y-10 font-sans">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">联系板块小标题 (Title)</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-lg font-bold text-blue-600" value={siteConfig.contact_title || ''} onChange={(e) => handleUpdateConfig('contact_title', e.target.value)} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">联系板块大标题 (Heading)</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-lg font-bold" value={siteConfig.contact_heading || ''} onChange={(e) => handleUpdateConfig('contact_heading', e.target.value)} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 border-t border-slate-50 pt-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">服务邮箱</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-lg" value={siteConfig.contact_email || ''} onChange={(e) => handleUpdateConfig('contact_email', e.target.value)} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">咨询电话</label>
                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none text-lg" value={siteConfig.contact_phone || ''} onChange={(e) => handleUpdateConfig('contact_phone', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4 border-t border-slate-50 pt-10">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">表单上方引导语 (支持二级内容)</label>
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

                {leads.length === 0 ? (
                  <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 italic">目前暂无咨询线索</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {leads.map((lead: any) => (
                      <div key={lead.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Mail size={20}/></div>
                            <div>
                               <div className="font-bold text-lg">{lead.data.company || lead.data.email || '未知来源'}</div>
                               <div className="text-slate-400 text-xs">提交时间: {new Date(lead.created_at).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            New Lead
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {Object.entries(lead.data).map(([key, value]: any) => (
                            <div key={key}>
                              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{key}</div>
                              <div className="text-gray-700 bg-slate-50 px-4 py-2 rounded-xl text-sm break-all">{value?.toString() || '-'}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
