/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Zap, 
  ChevronRight, 
  Mail, 
  Phone, 
  MessageSquare,
  FileText,
  Briefcase,
  Search,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  stage: string;
}

interface Industry {
  id: string;
  name: string;
  description: string;
  image: string;
}

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '服务体系', href: '#services' },
    { name: '行业方案', href: '#industries' },
    { name: '服务路径', href: '#how-it-works' },
    { name: '成功案例', href: '#cases' },
    { name: '关于我们', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            数
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-none ${isScrolled ? 'text-gray-900' : 'text-white'}`}>数贸融出海服务</span>
            <span className={`text-[10px] font-medium tracking-widest uppercase ${isScrolled ? 'text-gray-500' : 'text-gray-300'}`}>Digitrade Fintech</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${isScrolled ? 'text-gray-600' : 'text-gray-200'}`}
            >
              {link.name}
            </a>
          ))}
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            获取方案
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className={isScrolled ? 'text-gray-900' : 'text-white'} /> : <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 md:hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-gray-600 font-medium py-2 border-b border-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold">
                获取方案
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1920" 
          alt="Sydney Opera House" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-600/30">
              澳洲出海一站式服务中心
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8">
              让中国企业在澳洲<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">真正落地与增长</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              从合规准入到商业策略，我们填补“落地后增长赋能”的市场空白，担任您的外部首席增长官（CGO），助您在澳洲市场扎根。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-600/30">
                获取定制方案
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                查看服务矩阵
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-white/10 pt-8"
          >
            <div>
              <div className="text-3xl font-bold text-white mb-1">15+ 年</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">中澳贸易深耕</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">服务企业案例</div>
            </div>
            <div className="hidden md:block">
              <div className="text-3xl font-bold text-white mb-1">60%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">落地效率提升</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-600/20 blur-[120px] rounded-full -mb-20 -mr-20"></div>
    </section>
  );
};

const PainPoints = () => {
  const points = [
    { title: '信息不透明', desc: '不清楚澳洲市场准入规则，不了解注册、税务、签证等复杂流程。', icon: <Search className="w-6 h-6" /> },
    { title: '落地执行难', desc: '不知道如何注册公司、招聘人才、寻找本地供应链和资源。', icon: <MapPin className="w-6 h-6" /> },
    { title: '增长瓶颈大', desc: '产品卖不出去，品牌不被认可，缺乏本地化运营能力和渠道。', icon: <TrendingUp className="w-6 h-6" /> },
    { title: '服务严重割裂', desc: '咨询公司只讲战略，代办机构只做执行，没有人覆盖全流程。', icon: <Briefcase className="w-6 h-6" /> },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">核心痛点分析</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">为什么出海澳洲总是“水土不服”？</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, idx) => (
            <motion.div 
              key={point.title}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all"
            >
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{point.title}</h3>
              <p className="text-gray-600 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services: Service[] = [
    {
      id: 'strategy',
      title: '战略入市服务',
      description: '解决赴澳初期最紧迫的基础挑战，建立合法运营实体。',
      icon: <Globe className="w-6 h-6" />,
      stage: '第一阶段：快速变现',
      features: ['市场调研报告', '商业模式设计', '合规路径规划', '公司注册与税务登记']
    },
    {
      id: 'localization',
      title: '本地化运营服务',
      description: '解决深层次运营挑战，实现品牌在澳洲的真正扎根。',
      icon: <Users className="w-6 h-6" />,
      stage: '第二阶段：增长型产品',
      features: ['品牌本地化改造', '数字营销全案', '渠道建设与对接', '人才招聘与管理']
    },
    {
      id: 'growth',
      title: '增长赋能服务',
      description: '深度聚焦重点产业，助力企业实现从落地到扎根的质变。',
      icon: <TrendingUp className="w-6 h-6" />,
      stage: '第三阶段：高价值产品',
      features: ['政府资源嫁接', '产业基金申请支持', '财税外包服务', '战略合作撮合']
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">产品矩阵</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">全生命周期的出海解决方案</p>
            <p className="text-gray-600 text-lg">我们把服务“产品化”，通过三阶六品的服务体系，确保企业在不同阶段都能获得精准支持。</p>
          </div>
          <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            查看完整产品矩阵 <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  {service.icon}
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {service.stage}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-8 flex-grow">{service.description}</p>
              <ul className="space-y-3 mb-8">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all">
                了解详情
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Industries = () => {
  const industries: Industry[] = [
    { id: 'energy', name: '新能源与关键矿产', description: '锂电产业链、储能技术及绿色金属转型。', image: 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=800' },
    { id: 'agri', name: '农业与食品科技', description: '高质量食品出口、农业科技与生物科技。', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800' },
    { id: 'construction', name: '建筑与装配式', description: '住宅建设、交通基建及装配式建筑方案。', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <section id="industries" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">行业解决方案</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">深耕昆州战略优势产业</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {industries.map((item) => (
            <div key={item.id} className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-gray-300 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.description}</p>
                <button className="text-white font-bold flex items-center gap-2 text-sm">
                  查看方案 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { title: '进入市场', desc: 'Entry', icon: <Globe className="w-5 h-5" /> },
    { title: '合规落地', desc: 'Setup', icon: <ShieldCheck className="w-5 h-5" /> },
    { title: '本地运营', desc: 'Operate', icon: <Users className="w-5 h-5" /> },
    { title: '增长加速', desc: 'Scale', icon: <TrendingUp className="w-5 h-5" /> },
    { title: '产业嵌入', desc: 'Integrate', icon: <Building2 className="w-5 h-5" /> },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-blue-200 font-bold tracking-widest uppercase text-sm mb-3">服务路径</h2>
          <p className="text-3xl md:text-4xl font-bold text-white">我们如何帮助企业在澳洲成功？</p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-400/30 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={step.title} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-blue-600">{step.icon}</span>
                </div>
                <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Step {idx + 1}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-blue-200 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    company: '',
    industry: '',
    email: '',
    message: '',
    serviceType: '',
    stage: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('感谢您的咨询，我们的顾问将尽快与您联系！');
  };

  return (
    <section id="contact" className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">联系我们</h2>
            <p className="text-4xl font-bold text-gray-900 mb-8 leading-tight">开启您的<br />澳洲出海之旅</p>
            <p className="text-gray-600 text-lg mb-12">
              填写右侧表单，我们的中澳专家团队将为您提供免费的初步咨询和合规风险评估。
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">电子邮箱</h4>
                  <p className="text-gray-600">info@digitradefintech.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">联系电话</h4>
                  <p className="text-gray-600">+61 (07) 1234 5678 (澳洲) / +86 123 4567 8910 (中国)</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">办公地址</h4>
                  <p className="text-gray-600">Brisbane, Queensland, Australia / 上海, 中国</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">公司名称</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                    placeholder="您的企业名称"
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">所属行业</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                    placeholder="例如：新能源、建筑"
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">电子邮箱</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                  placeholder="name@company.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">服务类型</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  >
                    <option value="">请选择</option>
                    <option value="strategy">战略入市</option>
                    <option value="localization">本地化运营</option>
                    <option value="growth">增长赋能</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">出海阶段</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                  >
                    <option value="">请选择</option>
                    <option value="research">市场调研</option>
                    <option value="entry">准备进入</option>
                    <option value="setup">已落地</option>
                    <option value="operate">已运营</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">留言信息 (可选)</label>
                <textarea 
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none"
                  placeholder="请描述您的具体需求..."
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
              >
                立即获取方案
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative background circle */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                数
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">数贸融出海服务</span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-gray-400">Digitrade Fintech</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-8">
              专注于跨境贸易本土化全链路赋能的智能服务中心。我们不仅是服务提供者，更是客户的海外增长合伙人。
            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">服务项目</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">澳洲落地快捷通</a></li>
              <li><a href="#" className="hover:text-white transition-colors">昆州出口启航计划</a></li>
              <li><a href="#" className="hover:text-white transition-colors">中澳双向合规通</a></li>
              <li><a href="#" className="hover:text-white transition-colors">澳新品牌工场</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">快速链接</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">行业解决方案</a></li>
              <li><a href="#" className="hover:text-white transition-colors">资源中心</a></li>
              <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">订阅资讯</h4>
            <p className="text-gray-400 text-sm mb-6">获取最新的澳洲政策解读与出海指南。</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="您的邮箱"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex-grow outline-none focus:border-blue-600 transition-all"
              />
              <button className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 数贸融出海服务中心. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Services />
        <Industries />
        <HowItWorks />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
