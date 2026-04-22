import React from 'react';
import { Globe, Users, TrendingUp, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';
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

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'strategy': return <Globe className="w-6 h-6" />;
    case 'localization': return <Users className="w-6 h-6" />;
    case 'growth': return <TrendingUp className="w-6 h-6" />;
    case 'Briefcase': return <Briefcase className="w-6 h-6" />;
    default: return <Briefcase className="w-6 h-6" />;
  }
};

export const Services = ({ products }: ServicesProps) => {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">产品矩阵</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">全生命周期的出海解决方案</p>
            <p className="text-gray-600 text-lg">我们把服务“产品化”，通过三阶六品的服务体系，确保企业在不同阶段都能获得精准支持。</p>
          </div>
          <Link to="/products" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            查看完整产品矩阵 <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const featuresArray = safeJsonParse(product.features);
            const isExternalImage = product.image_url.startsWith('http');
            
            return (
              <div key={product.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full group hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center overflow-hidden">
                    {isExternalImage ? (
                      <img src={product.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      getIcon(product.image_url)
                    )}
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider text-center">
                    {product.stage}
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{product.title}</h3>
                  <span className="text-blue-600 font-bold text-sm">参考起价: {product.price}</span>
                </div>
                <p className="text-gray-600 mb-8 flex-grow line-clamp-3">{product.description}</p>
                <ul className="space-y-3 mb-8">
                  {featuresArray?.slice(0, 4).map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm truncate">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/products" className="w-full py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all text-center block">
                  了解详情
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
