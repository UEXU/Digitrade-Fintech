import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Public/Navbar';
import { Footer } from '../components/Public/Layout';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { safeJsonParse } from '../lib/utils';
import { DEFAULT_PRODUCTS } from '../constants';

export const ProductMatrix = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: productsData } = await supabase.from('products').select('*').order('id');
      const { data: configData } = await supabase.from('site_config').select('*');
      
      if (productsData && productsData.length > 0) {
        setProducts(productsData.map((p: any) => ({
          ...p,
          id: Number(p.id),
          stage: p.stage || (p.id == 1 ? '决策引导' : p.id == 2 ? '合规落地' : p.id == 3 ? '市场增长' : p.id == 4 ? '团队运营' : p.id == 5 ? '财税合规' : '资源生态')
        })));
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }
      if (configData) {
        const configObj = configData.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setSiteConfig(configObj);
      }
      setLoading(false);
    };
    fetchData();
    window.scrollTo(0, 0);

    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-slate-400 font-medium">正在同步产品矩阵数据...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        logoText={siteConfig.company_logo_text}
        logoSubtitle={siteConfig.company_logo_subtitle}
        logoUrl={siteConfig.logo_url}
        links={safeJsonParse(siteConfig.navbar_links)}
      />
      
      <section className="pt-32 pb-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            {siteConfig.products_title || '数贸融出海产品矩阵'}
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            {siteConfig.products_subtitle || '从基础准入到深层增长，我们提供全生命周期的澳洲落地与赋能服务。'}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all duration-500 group"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  {(() => {
                    const imageUrl = product.image_url || '';
                    const isDataImage = imageUrl.startsWith('data:');
                    const isUrlImage = imageUrl.startsWith('http') || imageUrl.startsWith('/');
                    const isExternalImage = isDataImage || isUrlImage || (imageUrl.includes('.') && imageUrl.length > 5);
                    
                    const displayUrl = imageUrl;

                    return (
                      <img 
                        key={`${product.id}-${imageUrl.substring(0, 50)}`}
                        src={isExternalImage ? displayUrl : `https://picsum.photos/seed/${product.id}/800/600`} 
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('picsum.photos') && !isDataImage) {
                            target.src = `https://picsum.photos/seed/${product.id}/800/600`;
                          }
                        }}
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest mb-2 shadow-lg shadow-blue-600/30">
                      {product.stage}
                    </span>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{product.title}</h2>
                  </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-grow space-y-6">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {product.description}
                  </p>

                  <div className="space-y-4 flex-grow">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">包含核心服务</div>
                    <div className="grid grid-cols-1 gap-y-3">
                      {safeJsonParse(product.features).map((feat: string) => (
                        <div key={feat} className="flex items-start gap-3 text-gray-700 text-xs">
                          <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">参考方案起价</div>
                      <div className="text-xl font-bold text-blue-600 font-mono italic">{product.price}</div>
                    </div>
                    <Link to="/#contact" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                      咨询定制 <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer 
        logoText={siteConfig.company_logo_text} 
        logoSubtitle={siteConfig.company_logo_subtitle}
        logoUrl={siteConfig.logo_url} 
      />
    </div>
  );
};
