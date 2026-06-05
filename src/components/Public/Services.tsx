import React from 'react';
import { getLucideIcon } from '../../lib/icons';
import { Link } from 'react-router-dom';
import { safeJsonParse } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

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
  title?: string;
  heading?: string;
  description?: string;
}

const getEffectiveIcon = (iconName: string, index: number) => {
  const isImage = iconName && (iconName.startsWith('data:') || iconName.startsWith('http') || (iconName.includes('.') && iconName.length > 4));

  if (isImage) return null;

  const mapping: Record<string, string> = {
    'strategy': 'Globe',
    'localization': 'ShieldCheck',
    'growth': 'TrendingUp'
  };

  const name = mapping[iconName] || iconName;

  if (!name) {
    const defaults = ['Globe', 'ShieldCheck', 'TrendingUp', 'Users', 'Archive', 'Building2'];
    return getLucideIcon(defaults[index % defaults.length]);
  }

  return getLucideIcon(name);
};

export const Services = ({ products, title, heading, description }: ServicesProps) => {
  const { t } = useTranslation();

  const resolvedTitle = title || t('services.title');
  const resolvedHeading = heading || t('services.heading');
  const resolvedDescription = description || t('services.description');

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-blue-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">{resolvedTitle}</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">{resolvedHeading}</p>
          <div className="w-24 h-1.5 bg-blue-600 rounded-full mb-8"></div>
          <p className="text-gray-500 text-lg max-w-3xl leading-relaxed font-medium whitespace-pre-line">
            {resolvedDescription}
          </p>
        </div>

        <div className="space-y-24">
          {Array.from({ length: Math.ceil(products.length / 2) }).map((_, phaseIdx) => {
            const phaseColors = ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-slate-900'];
            const phaseTitles = [
              { title: t('services.phases.phase1Title'), desc: t('services.phases.phase1Desc') },
              { title: t('services.phases.phase2Title'), desc: t('services.phases.phase2Desc') },
              { title: t('services.phases.phase3Title'), desc: t('services.phases.phase3Desc') }
            ];

            const currentPhase = phaseTitles[phaseIdx] || {
              title: t('services.phases.phaseNTitleTemplate', { n: phaseIdx + 1 }),
              desc: t('services.phases.phaseNDesc')
            };
            const phaseColor = phaseColors[phaseIdx % phaseColors.length];

            const phaseProducts = products.slice(phaseIdx * 2, (phaseIdx * 2) + 2);

            return (
              <div key={phaseIdx} className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8 gap-4">
                  <div>
                    <span className={`inline-block px-4 py-1.5 rounded-xl ${phaseColor} text-white text-[10px] font-black tracking-widest uppercase mb-4`}>
                      {currentPhase.title.split(/[:：]/)[0]}
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{currentPhase.title.split(/[:：]/)[1]?.trim() || currentPhase.title}</h3>
                  </div>
                  <p className="text-slate-400 font-bold tracking-wide text-sm">{currentPhase.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {phaseProducts.map((product, pIdx) => {
                    const absIndex = (phaseIdx * 2) + pIdx;
                    const featuresArray = safeJsonParse(product.features);
                    const imageUrl = product.image_url || '';

                    const isDataImage = imageUrl.startsWith('data:');
                    const isUrlImage = imageUrl.startsWith('http') || imageUrl.startsWith('/');
                    const isExternalImage = isDataImage || isUrlImage || (imageUrl.includes('.') && imageUrl.length > 5);

                    const displayUrl = imageUrl;
                    const finalSrc = isExternalImage
                      ? (imageUrl.startsWith('data:') ? displayUrl : `${displayUrl}${displayUrl.includes('?') ? '&' : '?'}t=${Date.now()}`)
                      : `https://picsum.photos/seed/${product.id || absIndex}/800/600`;

                    return (
                      <div
                        key={`${product.id}-${absIndex}`}
                        className="group relative flex flex-col bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                      >
                        <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100">
                          <img
                            key={imageUrl}
                            src={finalSrc}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 shadow-inner"
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.src.includes('picsum.photos') && !isDataImage) {
                                target.src = `https://picsum.photos/seed/${product.id || absIndex}/800/600`;
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                          <div className="absolute bottom-6 left-8 right-8">
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em] block mb-1">
                              {t('services.moduleLabel')} 0{absIndex + 1}
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
                              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t('services.baseRateLabel')}</span>
                            </div>
                          </div>

                          <p className="text-slate-500 mb-10 leading-relaxed text-sm font-medium flex-grow whitespace-pre-line">
                            {product.description}
                          </p>

                          <div className="space-y-6 pt-10 border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('services.keyScopeLabel')}</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {featuresArray?.slice(0, 6).map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 group/item">
                                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${phaseColor} opacity-20 group-hover/item:opacity-100 transition-all duration-300`} />
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
