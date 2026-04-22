import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'Failed to fetch' || isUnconfigured) {
        setError('登录请求失败：Supabase 配置无效。请确保已在 Vercel 或 AI Studio 的环境变量中正确配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。');
      } else {
        setError('系统错误，请检查网络连接或配置。');
      }
    } finally {
      setLoading(false);
    }
  };

  const isUnconfigured = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">管理员登录</h1>
          <p className="text-gray-500 mt-2">请登录以管理官网内容</p>
        </div>

        {isUnconfigured && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
            <h3 className="text-blue-800 font-bold text-sm mb-2">如何激活后台？</h3>
            <ol className="text-blue-700 text-xs space-y-2 list-decimal ml-4">
              <li>注册 <a href="https://supabase.com" target="_blank" className="font-bold underline">Supabase</a> 账号并创建项目</li>
              <li>在 AI Studio [Settings &gt; Secrets] 填写 <b>VITE_SUPABASE_URL</b> 和 <b>VITE_SUPABASE_ANON_KEY</b></li>
              <li>在 Supabase SQL Editor 运行项目根目录下的 <b>supabase_setup.sql</b></li>
              <li>在 Supabase Authentication 创建一个管理员邮箱/密码</li>
            </ol>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
              <Mail className="w-4 h-4" /> 电子邮箱
            </label>
            <input 
              type="email" 
              required 
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 transition-all"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
              <Lock className="w-4 h-4" /> 密码
            </label>
            <input 
              type="password" 
              required 
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? '登录中...' : '立即登录'}
          </button>
        </form>
      </div>
    </div>
  );
};
