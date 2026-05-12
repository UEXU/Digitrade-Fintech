import React from 'react';
import { motion } from 'motion/react';
import { getLucideIcon } from '../../lib/icons';

interface Step {
  title: string;
  desc: string;
  icon?: string;
}

interface ServicePathProps {
  title?: string;
  heading?: string;
  steps?: Step[];
}


export const ServicePath = ({ title, heading, steps }: ServicePathProps) => {
  const defaultSteps = [
    { title: '进入市场', desc: 'Entry', icon: 'Globe' },
    { title: '合规落地', desc: 'Setup', icon: 'ShieldCheck' },
    { title: '本地运营', desc: 'Operate', icon: 'Users' },
    { title: '增长加速', desc: 'Scale', icon: 'TrendingUp' },
    { title: '产业嵌入', desc: 'Integrate', icon: 'Building2' },
  ];

  const list = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
            {title || '服务路径'}
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {heading || '中澳落地赋能全景全周期'}
          </p>
        </div>

        <div className="relative">
          {/* Main Connector Path Line */}
          <div className="absolute top-[48px] left-8 right-8 h-0.5 bg-slate-100 hidden lg:block z-0">
            <motion.div 
              className="h-full bg-blue-600/20 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(list.length, 7)} gap-y-16 gap-x-4 relative z-10`}>
            {list.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`flex flex-col items-center text-center group ${idx > 0 && 'lg:pl-0'}`}
                >
                  {/* Step Node */}
                  <div className="relative mb-8">
                    {/* Pulsing indicator for active feel */}
                    <div className="absolute inset-0 bg-blue-600 rounded-full scale-125 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                    
                    <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-xl shadow-slate-200/50 transition-all duration-500 group-hover:border-blue-600 group-hover:scale-110 relative z-10 overflow-visible">
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-[11px] font-black shadow-lg border-4 border-white">
                        {idx + 1}
                      </div>

                      <div className="text-blue-600 transition-transform duration-500 group-hover:rotate-6">
                        {getLucideIcon(step.icon, "w-10 h-10 stroke-[1.5]")}
                      </div>
                    </div>
                    
                    {/* Connecting Arrows for Desktop (except last) */}
                    {idx < list.length - 1 && (
                      <div className="hidden lg:flex absolute top-12 -right-4 translate-x-full h-full items-start text-slate-100 group-hover:text-blue-200 transition-colors">
                        <div className="w-8 h-px bg-current mt-2"></div>
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className={`px-4 transition-transform duration-500 ${isEven ? 'lg:translate-y-4' : 'lg:-translate-y-2'}`}>
                    <h4 className="text-base font-black text-gray-900 mb-1 tracking-tight group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
