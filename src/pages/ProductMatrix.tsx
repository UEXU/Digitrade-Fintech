import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Public/Navbar';
import { Footer } from '../components/Public/Layout';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { safeJsonParse } from '../lib/utils';

export const ProductMatrix = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: productsData } = await supabase.from('products').select('*').order('id');
      const { data: configData } = await supabase.from('site_config').select('*');
      
      if (productsData) setProducts(productsData);
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
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-slate-400 font-medium">正在同步产品矩阵数据...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        logoText={siteConfig.company_logo_text}
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
          <div className="space-y-12">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[48px] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-16 items-center"
              >
                <div className="md:w-1/2 space-y-8">
                  <div>
                    <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
                      {product.stage}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">{product.title}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {safeJsonParse(product.features).map((feat: string) => (
                      <div key={feat} className="flex items-center gap-3 text-gray-700 text-sm">
                        <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">价格说明</div>
                      <div className="text-2xl font-bold text-blue-600 font-mono italic">{product.price}</div>
                    </div>
                    <Link to="/#contact" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                      预约专家咨询 <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>

                <div className="md:w-1/2 relative">
                   <div className="absolute inset-0 bg-blue-600/5 rounded-3xl -rotate-2"></div>
                   <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-slate-50 rotate-1">
                     <img 
                      src={product.image_url.startsWith('http') ? product.image_url : `https://picsum.photos/seed/${product.image_url}/800/600`} 
                      alt={product.title}
                      className="w-full rounded-2xl aspect-[4/3] object-cover"
                      referrerPolicy="no-referrer"
                     />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
