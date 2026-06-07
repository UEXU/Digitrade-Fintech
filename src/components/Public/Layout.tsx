import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Globe, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getLucideIcon } from '../../lib/icons';
import { useTranslation } from 'react-i18next';

export const Industries = ({ data, title, heading }: { data?: any[]; title?: string; heading?: string }) => {
  const { t } = useTranslation();
  const defaultIndustries = [
    { id: 'energy', name: '新能源与关键矿产', description: '锂电产业链、储能技术及绿色金属转型。', image: 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=800' },
    { id: 'agri', name: '农业与食品科技', description: '高质量食品出口、农业科技与生物科技。', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800' },
    { id: 'construction', name: '建筑与装配式', description: '住宅建设、交通基建及装配式建筑方案。', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800' },
  ];

  const list = data && data.length > 0 ? data : defaultIndustries;

  return (
    <section id="industries" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
            {title || t('industries.title')}
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">
            {heading || t('industries.heading')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {list.map((item, idx) => {
            const imageUrl = item.image || '';
            const isDataImage = imageUrl.startsWith('data:');
            const isUrlImage = imageUrl.startsWith('http') || imageUrl.startsWith('/');
            const isExternalImage = isDataImage || isUrlImage || (imageUrl.includes('.') && imageUrl.length > 4);
            
            const displayUrl = isUrlImage && !isDataImage
              ? (imageUrl.includes('?') ? `${imageUrl}&v=${Date.now()}` : `${imageUrl}?v=${Date.now()}`)
              : imageUrl;

            return (
              <Link 
                to={`/industry/${item.id || idx}`}
                key={item.id || idx} 
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg bg-slate-100 flex flex-col"
              >
                <img 
                  key={imageUrl}
                  src={isExternalImage ? displayUrl : `https://picsum.photos/seed/${item.id || idx}/800/1000`} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('picsum.photos')) {
                      target.src = `https://picsum.photos/seed/${item.id || idx}/800/1000`;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 transition-opacity group-hover:opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
                    {item.name}
                    <ArrowRight size={20} className="md:opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium line-clamp-2">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const About = ({
  badge,
  title,
  content,
  imageUrl,
  features,
  statValue,
  statLabel
}: {
  badge?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  features?: { title: string; desc: string }[];
  statValue?: string;
  statLabel?: string;
}) => {
  const { t } = useTranslation();
  const resolvedBadge = badge || t('about.badge');
  const resolvedTitle = title || t('about.title');
  const resolvedStatValue = statValue || t('about.statValue');
  const resolvedStatLabel = statLabel || t('about.statLabel');

  const displayFeatures = features && features.length > 0 ? features : [];

  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 bg-slate-100">
              {(() => {
                const img = imageUrl || '';
                const isDataImage = img.startsWith('data:');
                const isUrlImage = img.startsWith('http') || img.startsWith('/');
                const isExternalImage = isDataImage || isUrlImage || (img.length > 20 && img.includes('.'));
                
                const displayUrl = isUrlImage && !isDataImage
                  ? (img.includes('?') ? `${img}&v=${Date.now()}` : `${img}?v=${Date.now()}`)
                  : img;
                
                return (
                  <img 
                    src={isExternalImage ? displayUrl : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"} 
                    alt="About Us" 
                    className="w-full aspect-[4/3] object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('unsplash.com') && !target.src.startsWith('data:')) {
                         target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";
                      }
                    }}
                  />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
              <div className="text-3xl font-bold text-blue-600 mb-1">{resolvedStatValue}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{resolvedStatLabel}</div>
            </div>
          </div>

          <div>
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">{resolvedBadge}</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight text-balance">
              {resolvedTitle}
            </p>
            <div className="text-gray-600 text-lg leading-relaxed mb-10 space-y-6">
              {content && (
                <div className="whitespace-pre-line">{content}</div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {displayFeatures.map((f, i) => (
                <div key={i}>
                  <div className="text-blue-600 font-bold mb-2">
                    {f.title}
                  </div>
                  <p className="text-sm text-gray-500">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Contact = ({
  badge,
  title,
  heading,
  formText,
  formFields,
  contactItems
}: {
  badge?: string;
  title?: string;
  heading?: string;
  formText?: string;
  formFields?: any[];
  contactItems?: any[];
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolvedBadge = badge || t('contact.badge');
  const resolvedTitle = title || heading || t('contact.title');
  const resolvedFormText = formText || t('contact.formText');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const now = new Date().toISOString();
      const submissionData = {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || formData.mobile || '',
        company: formData.company || '',
        industry: formData.industry || '',
        requirements: formData.requirements || '',
        source: window.location.pathname,
        submitted_at: now
      };

      console.log('Submitting lead data:', submissionData);

      // 尝试多种插入方式，确保至少有一种能成功
      let result = await supabase.from('leads').insert([submissionData]);
      
      if (result.error) {
        console.error('Regular insert failed:', result.error);
        // 尝试以 JSON 格式存入 data 字段 (兼容模式)
        console.log('Trying JSON fallback...');
        result = await supabase.from('leads').insert([{ 
          data: formData,
          source: window.location.pathname,
          submitted_at: now
        }]);
      }

      if (result.error) {
        console.error('All insert attempts failed:', result.error);
        throw new Error(result.error.message || 'Database error');
      }

      alert(t('contact.alertSuccess'));
      setFormData({});
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error('Final lead submission fallback error:', error);
      alert(t('contact.alertErrorTemplate', { message: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = formFields && formFields.length > 0 ? formFields : [];
  const items = contactItems && contactItems.length > 0 ? contactItems : [];

  return (
    <section id="contact" className="py-24 bg-white overflow-hidden relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
              {resolvedBadge}
            </h2>
            <p className="text-4xl font-bold text-gray-900 mb-8 leading-tight whitespace-pre-line">
              {resolvedTitle}
            </p>
            <p className="text-gray-600 text-lg mb-12">
              {resolvedFormText}
            </p>

            <div className="space-y-8">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    {getLucideIcon(item.icon || 'Mail', 'w-6 h-6')}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.label}</h4>
                    <p className="text-gray-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      placeholder={field.placeholder || field.label}
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 outline-none"
                      rows={3}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      required={field.required}
                      placeholder={field.placeholder || field.label}
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 outline-none"
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? t('contact.submitting') : t('contact.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = ({
  logoText,
  logoSubtitle,
  logoUrl,
  description,
  linkedin,
  wechat,
  linkedinIcon,
  wechatIcon,
  copyrightText,
  privacyText,
  termsText
}: {
  logoText?: string;
  logoSubtitle?: string;
  logoUrl?: string;
  description?: string;
  linkedin?: string;
  wechat?: string;
  linkedinIcon?: string;
  wechatIcon?: string;
  copyrightText?: string;
  privacyText?: string;
  termsText?: string;
}) => {
  const { t } = useTranslation();
  const displayLogoText = logoText || t('navbar.logoFallback');
  const displayDescription = description || t('footer.description');
  const displayCopyright = copyrightText || t('footer.copyrightTemplate', { year: new Date().getFullYear() });
  const displayPrivacy = privacyText || t('footer.privacy');
  const displayTerms = termsText || t('footer.terms');

  return (
    <footer className="bg-slate-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 underline-offset-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              {logoUrl ? (
                <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-white">
                  <img
                    src={logoUrl}
                    alt={displayLogoText}
                    className="max-w-full max-h-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {displayLogoText.substring(0, 1)}
                </div>
              )}
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-bold text-lg leading-tight tracking-tight">{displayLogoText}</span>
                <span className="text-[10px] font-medium tracking-wider uppercase text-gray-400 opacity-80">
                  {logoSubtitle || 'Digitrade Fintech'}
                </span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 whitespace-pre-line">
              {displayDescription}
            </p>
            <div className="flex gap-4">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
                  {getLucideIcon(linkedinIcon || 'Linkedin', 'w-5 h-5')}
                </a>
              )}
              {wechat && (
                <div className="group relative">
                  <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-green-600 transition-all">
                    {getLucideIcon(wechatIcon || 'MessageSquare', 'w-5 h-5')}
                  </button>
                  <div className="absolute bottom-full mb-2 left-0 w-42 bg-white text-slate-900 text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                    {t('footer.wechatLabel')} {wechat}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-8 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/#services" className="hover:text-blue-400 transition-colors">{t('navbar.services')}</a></li>
              <li><a href="/#industries" className="hover:text-blue-400 transition-colors">{t('navbar.industries')}</a></li>
              <li><a href="/#how-it-works" className="hover:text-blue-400 transition-colors">{t('navbar.howItWorks')}</a></li>
              <li><a href="/#about" className="hover:text-blue-400 transition-colors">{t('navbar.about')}</a></li>
              <li><Link to="/admin/login" className="hover:text-blue-400 transition-colors opacity-30 hover:opacity-100 text-[10px] mt-4 block">{t('footer.adminEntry')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>{displayCopyright}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">{displayPrivacy}</a>
            <a href="#" className="hover:text-white">{displayTerms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
