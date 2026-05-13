import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Public/Navbar';
import { Footer } from '../components/Public/Layout';
import { ArrowLeft, CheckCircle2, ChevronRight, Globe, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { safeJsonParse } from '../lib/utils';

export const IndustryDetail = () => {
  const { id } = useParams();
  const [industry, setIndustry] = useState<any>(null);
  const [siteConfig, setSiteConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustry = async () => {
      try {
        const { data: configData } = await supabase.from('site_config').select('key,value');
        if (configData) {
          const configObj = configData.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});
          setSiteConfig(configObj);
          
          if (configObj.industries) {
            const industries = safeJsonParse(configObj.industries);
            const item = industries.find((i: any) => i.id === id || i.name === id);
            setIndustry(item);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndustry();
    window.scrollTo(0, 0);

    const handleFocus = () => fetchIndustry();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-blue-400 font-bold tracking-[0.3em] uppercase text-xs animate-pulse">
           方案详情加载中...
        </div>
      </div>
    );
  }
  if (!industry) return <div className="min-h-screen flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold mb-4">未找到该行业方案</h2>
    <Link to="/" className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
      <ArrowLeft size={18} /> 返回首页
    </Link>
  </div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        logoText={siteConfig.company_logo_text}
        logoSubtitle={siteConfig.company_logo_subtitle}
        logoUrl={siteConfig.logo_url}
        links={safeJsonParse(siteConfig.navbar_links)}
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          {(() => {
            const imageUrl = industry.image || '';
            const isDataImage = imageUrl.startsWith('data:');
            const isUrlImage = imageUrl.startsWith('http') || imageUrl.startsWith('/');
            const isExternalImage = isDataImage || isUrlImage || (imageUrl.includes('.') && imageUrl.length > 4);
            
            const displayUrl = isUrlImage && !isDataImage
              ? (imageUrl.includes('?') ? `${imageUrl}&v=${Date.now()}` : `${imageUrl}?v=${Date.now()}`)
              : imageUrl;

            return (
              <img 
                key={imageUrl}
                src={isExternalImage ? displayUrl : `https://picsum.photos/seed/${imageUrl || industry.name}/1920/1080`} 
                className="w-full h-full object-cover opacity-40 blur-sm scale-110" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('picsum.photos')) {
                    target.src = `https://picsum.photos/seed/${industry.name}/1920/1080`;
                  }
                }}
              />
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900 to-slate-900"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-blue-400 font-bold text-sm mb-8 hover:text-blue-300 transition-colors">
              <ArrowLeft size={16} /> 行业解决方案中心
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              {industry.name}
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed font-light whitespace-pre-line">
              {industry.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Left Detail */}
            <div className="lg:col-span-2 space-y-12">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                   <div className="w-1 h-8 bg-blue-600"></div>
                   方案深度解析
                </h3>
                <div className="text-gray-600 leading-loose whitespace-pre-line">
                  {industry.fullContent || '正在完善该方案的详细内容... 目前我们深耕该领域的供应链整合、合规进入以及本地化运营。'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-[40px] p-8 md:p-12">
                <h4 className="text-xl font-bold mb-8">核心赋能维度</h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <Zap className="text-blue-600 shrink-0" />
                    <div>
                      <h5 className="font-bold mb-2">{siteConfig.ind_feat1_title || '快速准入'}</h5>
                      <p className="text-sm text-gray-500">{siteConfig.ind_feat1_desc || '协助完成行业相关的资质认证与合规审查。'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Globe className="text-blue-600 shrink-0" />
                    <div>
                      <h5 className="font-bold mb-2">{siteConfig.ind_feat2_title || '当地资源'}</h5>
                      <p className="text-sm text-gray-500">{siteConfig.ind_feat2_desc || '对接澳洲本土核心产业公会与政府监管机构。'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <ShieldCheck className="text-blue-600 shrink-0" />
                    <div>
                      <h5 className="font-bold mb-2">{siteConfig.ind_feat3_title || '合规风控'}</h5>
                      <p className="text-sm text-gray-500">{siteConfig.ind_feat3_desc || '提供澳洲法律框架下的全方位合规咨询。'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              <div className="bg-blue-600 rounded-[40px] p-8 text-white sticky top-24 shadow-2xl shadow-blue-600/20">
                <h4 className="text-2xl font-bold mb-6">立即开启咨询</h4>
                <p className="text-blue-100 mb-8 font-light">与我们的澳洲行业专家通话，获取定制化的入市方案建议。</p>
                <Link 
                  to="/#contact"
                  className="block w-full bg-white text-blue-600 py-4 rounded-2xl font-bold text-center hover:bg-blue-50 transition-all"
                >
                  免费预约顾问
                </Link>
                <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-blue-300" /> 1对1行业专家深度分析
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-blue-300" /> 专属合规路径规划
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer 
        logoText={siteConfig.company_logo_text} 
        logoSubtitle={siteConfig.company_logo_subtitle}
        logoUrl={siteConfig.logo_url} 
        description={siteConfig.footer_description}
        linkedin={siteConfig.social_linkedin}
        wechat={siteConfig.social_wechat}
        linkedinIcon={siteConfig.social_linkedin_icon}
        wechatIcon={siteConfig.social_wechat_icon}
        copyrightText={siteConfig.footer_copyright}
        privacyText={siteConfig.footer_privacy_text}
        termsText={siteConfig.footer_terms_text}
      />
    </div>
  );
};
