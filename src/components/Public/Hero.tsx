import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  bgImage?: string;
  btn1Text?: string;
  btn2Text?: string;
}

export const Hero = ({ title, subtitle, bgImage, btn1Text, btn2Text }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage || "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1920"} 
          alt="Sydney" 
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 whitespace-pre-line">
              {title || '让中国企业在澳洲\n真正落地与增长'}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              {subtitle || '从合规准入到商业策略，我们填补“落地后增长赋能”的市场空白，担任您的外部首席增长官（CGO），助您在澳洲市场扎根。'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-600/30"
              >
                {btn1Text || '获取定制方案'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                {btn2Text || '查看服务矩阵'}
              </button>
            </div>
          </motion.div>

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

      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-600/20 blur-[120px] rounded-full -mb-20 -mr-20"></div>
    </section>
  );
};
