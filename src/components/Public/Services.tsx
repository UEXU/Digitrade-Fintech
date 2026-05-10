import React from 'react';
import { Globe, Users, TrendingUp, CheckCircle2, ChevronRight, Briefcase, ShieldCheck, Scale, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { safeJsonParse } from '../../lib/utils';

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string;
  stage: string;
  features: string[] | string;
}

interface ServicesProps {
  products: Product[];
}

const getIcon = (iconName: string, index: number) => {
  if (iconName === 'strategy' || index === 0) return <Globe className="w-6 h-6" />;
  if (iconName === 'localization' || index === 1) return <ShieldCheck className="w-6 h-6" />;
  if (iconName === 'growth' || index === 2) return <TrendingUp className="w-6 h-6" />;
  if (index === 3) return <Users className="w-6 h-6" />;
  if (index === 4) return <Scale className="w-6 h-6" />;
  if (index === 5) return <Landmark className="w-6 h-6" />;
  return <Briefcase className="w-6 h-6" />;
};

export const Services = ({ products }: ServicesProps) => {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">Service Architecture</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">“三阶六维”出海赋能全案</p>
          <div className="w-24 h-1.5 bg-blue-600 rounded-full mb-8"></div>
          <p className="text-gray-500 text-lg max-w-3xl leading-relaxed font-medium">
            针对赴澳企业不同阶段的痛点，精炼出三阶梯交付标准。从刚进入的决策对接到业务成熟后的资源整合，提供确定性的顾问式支持。
          </p>
        </div>

        <div className="space-y-24">
          {[0, 1, 2].map((phaseIdx) => {
            const phaseInfo = [
              { title: 'Phase 01：合规着陆', desc: 'Entry & Landing - 确保合法经营，降低准入风险', color: 'bg-blue-600' },
              { title: 'Phase 02：销售增长', desc: 'Growth & Operations - 品牌本地化，建立销售通路', color: 'bg-indigo-600' },
              { title: 'Phase 03：稳健运营', desc: 'Scale & Ecosystem - 财税合规，政府与资源深度对接', color: 'bg-violet-600' }
            ][phaseIdx];
            
            const phaseProducts = products.slice(phaseIdx * 2, (phaseIdx * 2) + 2);

            return (
              <div key={phaseIdx} className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8 gap-4">
                  <div>
                    <span className={`inline-block px-4 py-1.5 rounded-xl ${phaseInfo.color} text-white text-[10px] font-black tracking-widest uppercase mb-4`}>
                      {phaseInfo.title.split('：')[0]}
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{phaseInfo.title.split('：')[1]}</h3>
                  </div>
                  <p className="text-slate-400 font-bold tracking-wide text-sm">{phaseInfo.desc}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {phaseProducts.map((product, pIdx) => {
                    const absIndex = (phaseIdx * 2) + pIdx;
                    const featuresArray = safeJsonParse(product.features);
                    const isExternalImage = product.image_url?.startsWith('http') || product.image_url?.startsWith('data:');

                    return (
                      <div 
                        key={product.id || absIndex} 
                        className="group relative flex flex-col bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                      >
                        {/* Service Image Area */}
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          <img 
                            src={isExternalImage ? product.image_url : `https://picsum.photos/seed/${product.image_url || 'service' + absIndex}/800/600`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            alt={product.title}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                          
                          {/* Module Badge Overlay */}
                          <div className="absolute top-6 left-6">
                            <div className={`w-12 h-12 ${phaseInfo.color} rounded-2xl flex items-center justify-center text-white shadow-xl backdrop-blur-sm bg-opacity-90`}>
                              {getIcon(product.image_url, absIndex)}
                            </div>
                          </div>

                          <div className="absolute bottom-6 left-8 right-8">
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em] block mb-1">
                              MODULE 0{absIndex + 1}
                            </span>
                            <div className="text-[11px] font-bold text-white bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg uppercase tracking-wider inline-block">
                              {product.stage}
                            </div>
                          </div>
                        </div>

                        <div className="p-8 md:p-10 flex flex-col flex-grow">
                          <div className="mb-6">
                            <h4 className="text-2xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                              {product.title}
                            </h4>
                            <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <span className="text-blue-600 font-black text-xs">{product.price}</span>
                              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Base Rate</span>
                            </div>
                          </div>

                          <p className="text-slate-500 mb-10 leading-relaxed text-sm font-medium flex-grow">
                            {product.description}
                          </p>

                          <div className="space-y-6 pt-10 border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">交付成果 / Key Scope</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {featuresArray?.slice(0, 6).map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 group/item">
                                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${phaseInfo.color} opacity-20 group-hover/item:opacity-100 transition-all duration-300`} />
                                  <span className="text-[11px] font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
