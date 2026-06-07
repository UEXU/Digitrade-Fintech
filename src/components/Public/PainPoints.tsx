import React, { useState } from 'react';
import { getLucideIcon } from '../../lib/icons';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PainPoints = ({
  data,
  title,
  heading
}: {
  data?: any[],
  title?: string,
  heading?: string
}) => {
  const { t } = useTranslation();
  const resolvedTitle = title || t('painPoints.title');
  const resolvedHeading = heading || t('painPoints.heading');
  const [expanded, setExpanded] = useState<number | null>(null);

  const defaultPoints = [
    { title: '信息不透明', desc: '不清楚澳洲市场准入规则，不了解注册、税务、签证等复杂流程。', more: '在澳洲，ABN注册、GST税务申报、ASIC合规要求等都与国内显著不同。缺乏本地向导极易导致合规性风险，甚至面临巨额罚款。', icon: 'Search' },
    { title: '落地执行难', desc: '不知道如何注册公司、招聘人才、寻找本地供应链和资源。', more: '澳洲的劳动力成本极高， Fair Work 法规严格。如何在不熟悉的市场建立信任，筛选真正优质的本地供应商，是企业面临的第一个执行难题。', icon: 'MapPin' },
    { title: '增长瓶颈大', desc: '产品卖不出去，品牌不被认可，缺乏本地化运营能力和渠道。', icon: 'TrendingUp', more: '出海不只是翻译文字。文化内核、消费习惯、媒体矩阵的巨大差异，使得传统的“中国模式”在澳洲往往失效。需要深度本地运营才能实现品牌心智占领。' },
    { title: '服务严重割裂', desc: '咨询公司只讲战略，代办机构只做执行，没有人覆盖全流程。', icon: 'Briefcase', more: 'Digitrade 整合了顶层商业设计到落地合规执行的闭环。我们不只给你报告，我们与您并肩走进市场，解决从0到1的每一个细节问题。' },
  ];

  const points = data && data.length > 0 ? data : defaultPoints;

  return (
    <section id="pain-points" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">{resolvedTitle}</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">{resolvedHeading}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, idx) => (
            <motion.div 
              key={point.title}
              layout
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              className={`p-8 rounded-[32px] cursor-pointer transition-all border ${expanded === idx ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-600/30' : 'bg-slate-50 text-gray-900 border-slate-100'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg ${expanded === idx ? 'bg-white text-blue-600' : 'bg-blue-600 text-white shadow-blue-200'}`}>
                {getLucideIcon(point.icon)}
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-bold leading-tight ${expanded === idx ? 'text-white' : 'text-gray-900'}`}>{point.title}</h3>
                {expanded === idx ? <Minus className="shrink-0 opacity-50" /> : <Plus className="shrink-0 opacity-50 text-blue-600" />}
              </div>
              <p className={`text-sm leading-relaxed mb-4 whitespace-pre-line ${expanded === idx ? 'text-blue-50 cursor-pointer' : 'text-gray-500'}`}>
                {point.desc}
              </p>
              
              <AnimatePresence mode="wait">
                {expanded === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-white/20 text-sm italic font-light text-blue-100/90 leading-relaxed whitespace-pre-line">
                      {point.more}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
