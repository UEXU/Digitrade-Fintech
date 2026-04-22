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

export const AdminDashboard = () => {
  const [siteConfig, setSiteConfig] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'navbar' | 'hero' | 'about' | 'products' | 'industries' | 'contact' | 'pain-points' | 'leads'>('navbar');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: configData } = await supabase.from('site_config').select('*');
    const { data: productsData } = await supabase.from('products').select('*').order('id');
    const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

    if (configData) {
      const configObj = configData.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      setSiteConfig(configObj);
    }
    if (productsData) setProducts(productsData);
    if (leadsData) setLeads(leadsData);
    setLoading(false);
  };

  const handleUpdateConfig = (key: string, value: any) => {
    setSiteConfig({ ...siteConfig, [key]: typeof value === 'string' ? value : JSON.stringify(value) });
  };

  const getConfig = (key: string, defaultVal: any = []) => {
    const val = siteConfig[key];
    if (!val) return defaultVal;
    return safeJsonParse(val, defaultVal);
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      for (const key of Object.keys(siteConfig)) {
        await supabase.from('site_config').upsert({ key, value: siteConfig[key] }, { onConflict: 'key' });
      }
      alert('配置已同步到线上！');
    } catch (e) {
      alert('同步失败');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = (id: number, field: string, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSaveProducts = async () => {
    setSaving(true);
    try {
      for (const product of products) {
        const { id, created_at, ...updateData } = product;
        await supabase.from('products').update(updateData).eq('id', product.id);
      }
      alert('产品服务已同步更新！');
    } catch (e) {
      alert('保存失败');
    } finally {
      setSaving(false);
    }
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
          <header className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                {activeTab === 'navbar' && '站点导航与全局配置'}
                {activeTab === 'hero' && '可视化标题管理'}
                {activeTab === 'about' && '关于我们页面编辑'}
                {activeTab === 'pain-points' && '核心痛点互动编辑器'}
                {activeTab === 'products' && '产品矩阵与二级页管理'}
                {activeTab === 'industries' && '行业解决方案管理'}
                {activeTab === 'contact' && '表单与联系方式设置'}
                {activeTab === 'leads' && '网站咨询线索 (Leads)'}
              </h1>
              <p className="text-gray-500 mt-2">修改后请同步，新内容将即时呈现在官网中。</p>
            </div>
            
            <button 
              onClick={activeTab === 'products' ? handleSaveProducts : handleSaveConfig}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50"
            >
              <Save size={20} /> {saving ? '正在同步云端...' : '立即同步至线上'}
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
                  
                  <div className="space-y-6">
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
                  <div className="w-full h-48 bg-slate-100 rounded-3xl overflow-hidden mb-4 border-2 border-dashed border-slate-200">
                    <img 
                      src={siteConfig.hero_image_url || 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1920'} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <input 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-600 outline-none transition-all font-mono text-xs"
                    placeholder="输入背景图 URL"
                    value={siteConfig.hero_image_url || ''}
                    onChange={(e) => handleUpdateConfig('hero_image_url', e.target.value)}
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
                <div className="space-y-4">
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
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100">
                    <div className="flex flex-col lg:flex-row gap-12">
                      <div className="lg:w-1/3 space-y-6">
                        <div className="w-full aspect-video rounded-3xl bg-slate-100 overflow-hidden border border-slate-200 mb-4">
                          <img 
                            src={product.image_url.startsWith('http') ? product.image_url : `https://picsum.photos/seed/${product.image_url}/800/600`} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">产品封面 URL</label>
                          <input className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono" value={product.image_url} onChange={(e) => handleUpdateProduct(product.id, 'image_url', e.target.value)} />
                        </div>
                      </div>
                      <div className="lg:w-2/3 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">产品名称</label>
                            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold" value={product.title} onChange={(e) => handleUpdateProduct(product.id, 'title', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">起售价文字</label>
                            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono" value={product.price} onChange={(e) => handleUpdateProduct(product.id, 'price', e.target.value)} />
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
                  <div className="p-8 bg-blue-900 rounded-[40px] text-white flex flex-col gap-6 shadow-2xl shadow-blue-900/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold mb-1">产品矩阵二级页面配置</h4>
                        <p className="text-blue-300 text-sm">这些内容将自动应用在 `/products` 页面上展示。</p>
                      </div>
                      <button onClick={() => navigate('/products')} className="px-6 py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50">预览页面</button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-300 uppercase">二级页主标题</label>
                        <input className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-bold" value={siteConfig.products_title || '数贸融出海产品矩阵'} onChange={(e) => handleUpdateConfig('products_title', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-300 uppercase">二级页描述文字</label>
                        <input className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm" value={siteConfig.products_subtitle || '从基础准入到深层增长，我们提供全生命周期的澳洲落地与赋能服务。'} onChange={(e) => handleUpdateConfig('products_subtitle', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* INDUSTRIES TAB (Wait, I need to keep industries too) */}
            {activeTab === 'industries' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div>
                    <h3 className="font-bold text-lg">行业方案深度管理</h3>
                    <p className="text-sm text-slate-400">管理行业二级详情页的图片与深度文本内容</p>
                  </div>
                  <button onClick={addIndustry} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm"><Plus size={18}/> 新增方案</button>
                </div>
                {currentIndustries.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 relative group animate-in fade-in slide-in-from-right-4">
                    <button onClick={() => deleteIndustry(idx)} className="absolute top-6 right-6 p-3 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 rounded-2xl opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                    <div className="flex flex-col xl:flex-row gap-10">
                      <div className="xl:w-80 shrink-0 space-y-6">
                        <div className="w-full h-48 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <input className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono" value={item.image} onChange={(e) => {
                          const newList = [...currentIndustries];
                          newList[idx].image = e.target.value;
                          updateIndustries(newList);
                        }} />
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
                        <textarea className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-sm leading-loose bg-slate-50/50 h-[240px]" value={item.fullContent || ''} onChange={(e) => {
                          const newList = [...currentIndustries];
                          newList[idx].fullContent = e.target.value;
                          updateIndustries(newList);
                        }} />
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
