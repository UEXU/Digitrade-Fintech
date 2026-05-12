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
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
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
          {/* Main Connector Path Line - Desktop Only */}
          <div className="absolute top-[40px] left-[7%] right-[7%] h-0.5 bg-slate-100 hidden lg:block z-0">
            <motion.div 
              className="h-full bg-blue-600 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Grid Container - Strictly 7 columns on large screens to force horizontal row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-y-12 lg:gap-x-1 relative z-10">
            {list.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-slate-100 rounded-[1.5rem] sm:rounded-3xl flex items-center justify-center text-blue-600 mb-4 sm:mb-6 transition-all duration-500 group-hover:border-blue-600 group-hover:shadow-xl group-hover:shadow-blue-600/10 relative z-10 shrink-0">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center text-[8px] sm:text-[10px] font-black shadow-lg border-2 border-white">
                    {idx + 1}
                  </div>
                  {getLucideIcon(step.icon, "w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]")}
                </div>
                <div className="px-1">
                  <h4 className="text-[11px] sm:text-xs lg:text-[13px] font-black text-gray-900 mb-1 tracking-tight">{step.title}</h4>
                  <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] leading-tight opacity-70 group-hover:opacity-100 transition-opacity">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
