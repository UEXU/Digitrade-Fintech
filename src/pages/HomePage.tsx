import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Public/Navbar';
import { Hero } from '../components/Public/Hero';
import { PainPoints } from '../components/Public/PainPoints';
import { Services } from '../components/Public/Services';
import { ServicePath } from '../components/Public/ServicePath';
import { Industries, About, Contact, Footer } from '../components/Public/Layout';
import { ShieldCheck, Users, TrendingUp, Building2, Globe, Zap } from 'lucide-react';
import { DEFAULT_PRODUCTS } from '../constants';
import { safeJsonParse } from '../lib/utils';

const DEFAULT_CONFIG = {
  company_logo_text: '数贸融澳洲出海服务中心',
  company_logo_subtitle: 'DIGITRADE FINTECH',
  hero_title: '让中国企业在澳洲\n真正落地与增长',
  hero_subtitle: '从合规准入到商业策略，我们填补“落地后增长赋能”的市场空白，担任您的外部首席增长官（CGO），助您在澳洲市场扎根。',
  contact_badge_text: '联系我们',
  contact_title: '联系我们',
  contact_heading: '开启您的澳洲出海之旅',
  contact_form_text: '填写右侧表单，我们的中澳专家团队将为您提供免费的初步咨询和合规风险评估。',
  services_badge_text: 'Service Architecture',
  services_title: '“三阶六维”出海赋能全案',
  services_description: '针对赴澳企业不同阶段的痛点，精炼出三阶梯交付标准。从刚进入的决策对接到业务成熟后的资源整合，提供确定性的顾问式支持。',
  logo_url: 'https://svgshare.com/i/15A_.svg',
  contact_items: JSON.stringify([
    { icon: 'Mail', label: '电子邮箱', value: 'info@digitradefintech.com' },
    { icon: 'Phone', label: '联系电话', value: '+61 (07) 1234 5678 / +86 123 4567 8910' }
  ]),
  contact_form_fields: JSON.stringify([
    { name: 'company', label: '公司名称', placeholder: '您的公司全名', type: 'text', required: true },
    { name: 'industry', label: '所属行业', placeholder: '如：新能源、贸易、基建', type: 'text', required: true },
    { name: 'email', label: '电子邮箱', placeholder: 'email@example.com', type: 'email', required: true },
    { name: 'needs', label: '核心诉求', placeholder: '请简述您的服务需求', type: 'textarea', required: false }
  ]),
  industries: JSON.stringify([
    { id: 'energy', name: '新能源与关键矿产', description: '锂电产业链、储能技术及绿色金属转型。', image: 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=1200&q=75' },
    { id: 'agri', name: '农业与食品科技', description: '高质量食品出口、农业科技与生物科技。', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200&q=75' },
    { id: 'construction', name: '建筑与装配式', description: '住宅建设、交通基建及装配式建筑方案。', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1200&q=75' },
  ]),
  about_badge_text: '关于数贸融',
  about_title: '您的澳洲落地与增量\n战略级合伙人',
  about_content: '数贸融（Digitrade Fintech）是一家专注于为中国企业提供澳洲全链路出海赋能的咨询服务体系。我们不同于传统的法务或财税代办机构，我们深耕“落地后的增长赋能”。\n\n我们的核心团队由深耕澳洲市场多年的连续创业者、前政府高级顾问及资深行业专家组成，拥有强大的本地政企资源网。我们致力于通过“产品化”的服务体系，让出海变得可预测、可持续、可盈利。',
  about_features: JSON.stringify([
    { title: '● 深度本地化', desc: '不只是翻译，更是品牌灵魂的二次植入。' },
    { title: '● 全链路覆盖', desc: '从0到1的冷启动，到1到10的规模化增长。' }
  ]),
  pain_points_title: '核心痛点分析',
  pain_points_heading: '为什么出海澳洲总是“水土不服”？',
  pain_points: JSON.stringify([
    { title: '信息不透明', desc: '不清楚澳洲市场准入规则，不了解注册、税务、签证等复杂流程。', more: '在澳洲，ABN注册、GST税务申报、ASIC合规要求等都与国内显著不同。缺乏本地向导极易导致合规性风险，甚至面临巨额罚款。', icon: 'Search' },
    { title: '落地执行难', desc: '不知道如何注册公司、招聘人才、寻找本地供应链和资源。', more: '澳洲的劳动力成本极高， Fair Work 法规严格。如何在不熟悉的市场建立信任，筛选真正优质的本地供应商，是企业面临的第一个执行难题。', icon: 'MapPin' },
    { title: '增长瓶颈大', desc: '产品卖不出去，品牌不被认可，缺乏本地化运营能力和渠道。', icon: 'TrendingUp', more: '出海不只是翻译文字。文化内核、消费习惯、媒体矩阵的巨大差异，使得传统的“中国模式”在澳洲往往失效。需要深度本地运营才能实现品牌心智占领。' },
    { title: '服务严重割裂', desc: '咨询公司只讲战略，代办机构只做执行，没有人覆盖全流程。', icon: 'Briefcase', more: 'Digitrade 整合了顶层商业设计到落地合规执行的闭环。我们不只给你报告，我们与您并肩走进市场，解决从0到1的每一个细节问题。' },
  ]),
  service_steps: JSON.stringify([
    { title: '初步咨询', desc: 'CONSULTATION', icon: 'MessageSquare' },
    { title: '出海诊断', desc: 'DIAGNOSIS', icon: 'Search' },
    { title: '商务沟通', desc: 'FURTHER COMMUNICATION', icon: 'Mail' },
    { title: '签约启动', desc: 'CONTRACT & KICK-OFF', icon: 'ShieldCheck' },
    { title: '项目执行', desc: 'PROJECT EXECUTION', icon: 'Briefcase' },
    { title: '阶段成果', desc: 'MILESTONE DELIVERABLES', icon: 'TrendingUp' },
    { title: '增长赋能', desc: 'GROWTH EMPOWERMENT', icon: 'Zap' },
  ])
};

export const HomePage = () => {
  const [siteConfig, setSiteConfig] = useState<any>({});
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  const fallbackSteps = [
    { title: '初步咨询', desc: 'CONSULTATION', icon: 'MessageSquare' },
    { title: '出海诊断', desc: 'DIAGNOSIS', icon: 'Search' },
    { title: '商务沟通', desc: 'FURTHER COMMUNICATION', icon: 'Mail' },
    { title: '签约启动', desc: 'CONTRACT & KICK-OFF', icon: 'ShieldCheck' },
    { title: '项目执行', desc: 'PROJECT EXECUTION', icon: 'Briefcase' },
    { title: '阶段成果', desc: 'MILESTONE DELIVERABLES', icon: 'TrendingUp' },
    { title: '增长赋能', desc: 'GROWTH EMPOWERMENT', icon: 'Zap' },
  ];
  
  const steps = safeJsonParse(siteConfig.service_steps, fallbackSteps);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: configData, error: configError } = await supabase.from('site_config').select('*');
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('id')
          .limit(20); 

        if (configError || productsError) {
          const err = configError || productsError;
          console.error('CRITICAL: Supabase connection failed. Check your Secret keys.', err);
          setIsConfigured(false);
          setLoading(false);
          return;
        }

        setIsConfigured(true);

        if (configData && configData.length > 0) {
          const configObj = configData.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});
          setSiteConfig({ ...DEFAULT_CONFIG, ...configObj });
        }

        if (productsData && productsData.length > 0) {
          const dbProducts = productsData.map((p: any) => ({
            ...p,
            id: Number(p.id),
            features: typeof p.features === 'string' ? safeJsonParse(p.features, []) : (Array.isArray(p.features) ? p.features : []),
            stage: p.stage || (p.id == 1 ? '决策引导' : p.id == 2 ? '合规落地' : p.id == 3 ? '市场增长' : p.id == 4 ? '团队运营' : p.id == 5 ? '财税合规' : '资源生态')
          }));

          setProducts(dbProducts);
        }
      } catch (error) {
        console.error('Error fetching site data:', error);
        setSiteConfig(DEFAULT_CONFIG);
      } finally {
        setLoading(false);
        // After loading is done, check for hash and scroll
        if (window.location.hash) {
          setTimeout(() => {
            const id = window.location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update SEO meta description if available
    if (siteConfig.seo_description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', siteConfig.seo_description);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = "description";
        newMeta.content = siteConfig.seo_description;
        document.head.appendChild(newMeta);
      }
    }
  }, [siteConfig.seo_description]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-blue-400 font-bold tracking-[0.3em] uppercase text-xs animate-pulse">
          Digitrade Fintech Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        logoText={siteConfig.company_logo_text}
        logoSubtitle={siteConfig.company_logo_subtitle}
        logoUrl={siteConfig.logo_url}
        links={safeJsonParse(siteConfig.navbar_links)}
      />
      <main>
        <Hero 
          title={siteConfig.hero_title} 
          subtitle={siteConfig.hero_subtitle} 
          bgImage={siteConfig.hero_image_url}
          btn1Text={siteConfig.hero_btn_1_text}
          btn2Text={siteConfig.hero_btn_2_text}
          badgeText={siteConfig.hero_badge_text}
          stats={[
            { value: siteConfig.hero_stat_1_value, label: siteConfig.hero_stat_1_label },
            { value: siteConfig.hero_stat_2_value, label: siteConfig.hero_stat_2_label },
            { value: siteConfig.hero_stat_3_value, label: siteConfig.hero_stat_3_label },
          ]}
        />
        <PainPoints 
          data={safeJsonParse(siteConfig.pain_points)} 
          title={siteConfig.pain_points_title}
          heading={siteConfig.pain_points_heading}
        />
        <Services 
          products={products} 
          title={siteConfig.services_badge_text}
          heading={siteConfig.services_title}
          description={siteConfig.services_description}
        />
        <Industries 
          data={safeJsonParse(siteConfig.industries)} 
          title={siteConfig.industries_title}
          heading={siteConfig.industries_heading}
        />
        <ServicePath 
          title={siteConfig.service_path_title} 
          heading={siteConfig.service_path_heading} 
          steps={steps} 
        />
        <About 
          badge={siteConfig.about_badge_text}
          title={siteConfig.about_title} 
          content={siteConfig.about_content}
          imageUrl={siteConfig.about_image_url}
          features={safeJsonParse(siteConfig.about_features)}
          statValue={siteConfig.about_stat_value}
          statLabel={siteConfig.about_stat_label}
        />

        <Contact 
          badge={siteConfig.contact_badge_text}
          title={siteConfig.contact_title}
          heading={siteConfig.contact_heading}
          formText={siteConfig.contact_form_text}
          contactItems={safeJsonParse(siteConfig.contact_items)}
          formFields={safeJsonParse(siteConfig.contact_form_fields)}
        />
      </main>
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
