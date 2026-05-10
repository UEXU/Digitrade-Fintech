import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Globe, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const Industries = ({ data, title, heading }: { data?: any[]; title?: string; heading?: string }) => {
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
            {title || '行业解决方案'}
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">
            {heading || '深耕昆州战略优势产业'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {list.map((item, idx) => (
            <div key={item.id || idx} className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const About = ({ 
  title, 
  content,
  imageUrl,
  p1Title,
  p1Desc,
  p2Title,
  p2Desc
}: { 
  title?: string; 
  content?: string;
  imageUrl?: string;
  p1Title?: string;
  p1Desc?: string;
  p2Title?: string;
  p2Desc?: string;
}) => {
  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200">
              <img 
                src={imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"} 
                alt="Office" 
                className="w-full aspect-[4/3] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
              <div className="text-3xl font-bold text-blue-600 mb-1">10+</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">中澳跨国专家</div>
            </div>
          </div>
          
          <div>
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">关于数贸融</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight text-balance">
              {title || '您的澳洲落地与增量\n战略级合伙人'}
            </p>
            <div className="text-gray-600 text-lg leading-relaxed mb-10 space-y-6">
              {content ? (
                <div className="whitespace-pre-line">{content}</div>
              ) : (
                <>
                  <p>数贸融（Digitrade Fintech）是一家专注于为中国企业提供澳洲全链路出海赋能的咨询服务体系。我们不同于传统的法务或财税代办机构，我们深耕“落地后的增长赋能”。</p>
                  <p>我们的核心团队由深耕澳洲市场多年的连续创业者、前政府高级顾问及资深行业专家组成，拥有强大的本地政企资源网。我们致力于通过“产品化”的服务体系，让出海变得可预测、可持续、可盈利。</p>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-blue-600 font-bold mb-2">
                  {p1Title || '● 深度本地化'}
                </div>
                <p className="text-sm text-gray-500">
                  {p1Desc || '不只是翻译，更是品牌灵魂的二次植入。'}
                </p>
              </div>
              <div>
                <div className="text-blue-600 font-bold mb-2">
                  {p2Title || '● 全链路覆盖'}
                </div>
                <p className="text-sm text-gray-500">
                  {p2Desc || '从0到1的冷启动，到1到10的规模化增长。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Contact = ({ 
  title, 
  heading, 
  email, 
  phone, 
  formText, 
  formFields 
}: { 
  title?: string; 
  heading?: string; 
  email?: string; 
  phone?: string; 
  formText?: string; 
  formFields?: any[] 
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([{ data: formData }]);
      if (error) throw error;
      alert('感谢您的咨询，我们的顾问将尽快与您联系！');
      setFormData({});
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Submission error:', error);
      alert('提交失败，请稍后再试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultFields = [
    { name: 'company', label: '公司名称', placeholder: '如：上海XX贸易有限公司', type: 'text', required: true },
    { name: 'industry', label: '所属行业', placeholder: '如：新能源、贸易、基建', type: 'text', required: true },
    { name: 'email', label: '电子邮箱', placeholder: 'email@example.com', type: 'email', required: true },
  ];

  const fields = formFields && formFields.length > 0 ? formFields : defaultFields;

  return (
    <section id="contact" className="py-24 bg-white overflow-hidden relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
              {title || '联系我们'}
            </h2>
            <p className="text-4xl font-bold text-gray-900 mb-8 leading-tight whitespace-pre-line">
              {heading || '开启您的\n澳洲出海之旅'}
            </p>
            <p className="text-gray-600 text-lg mb-12">
              {formText || '填写右侧表单，我们的中澳专家团队将为您提供免费的初步咨询和合规风险评估。'}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">电子邮箱</h4>
                  <p className="text-gray-600">{email || 'info@digitradefintech.com'}</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">联系电话</h4>
                  <p className="text-gray-600">{phone || '+61 (07) 1234 5678 / +86 123 4567 8910'}</p>
                </div>
              </div>
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
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      required={field.required}
                      placeholder={field.placeholder || field.label}
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 outline-none"
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
                {isSubmitting ? '正在提交...' : '立即获取方案'}
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
  description
}: { 
  logoText?: string; 
  logoSubtitle?: string; 
  logoUrl?: string;
  description?: string;
}) => (
  <footer className="bg-slate-900 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 underline-offset-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            {logoUrl ? (
              <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-white">
                <img 
                  src={logoUrl} 
                  alt={logoText || '数贸融出海服务'} 
                  className="max-w-full max-h-full object-contain p-1" 
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                {logoText ? logoText.substring(0, 1) : '数'}
              </div>
            )}
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold text-lg leading-tight tracking-tight">{logoText || '数贸融出海服务'}</span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-gray-400 opacity-80">
                {logoSubtitle || 'Digitrade Fintech'}
              </span>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            {description || '专注于跨境贸易本土化全链路赋能的智能服务中心。我们不仅是服务提供者，更是客户的海外增长合伙人。'}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-8 text-white">快速入口</h4>
          <ul className="space-y-4 text-gray-400">
            <li><a href="#services" className="hover:text-blue-400 transition-colors">服务体系</a></li>
            <li><a href="#industries" className="hover:text-blue-400 transition-colors">行业方案</a></li>
            <li><a href="#about" className="hover:text-blue-400 transition-colors">关于我们</a></li>
            <li><Link to="/admin/login" className="hover:text-blue-400 transition-colors opacity-30 hover:opacity-100 text-[10px] mt-4 block">管理后台</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2026 数贸融出海服务中心. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">隐私政策</a>
          <a href="#" className="hover:text-white">服务条款</a>
        </div>
      </div>
    </div>
  </footer>
);
