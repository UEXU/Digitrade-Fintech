import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar = ({ logoText, logoSubtitle, logoUrl, links }: { logoText?: string; logoSubtitle?: string; logoUrl?: string; links?: any[] }) => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultLinks = [
    { name: t('navbar.services'), href: '/#services' },
    { name: t('navbar.industries'), href: '/#industries' },
    { name: t('navbar.howItWorks'), href: '/#how-it-works' },
    { name: t('navbar.about'), href: '/#about' },
  ];

  const navLinks = (links && links.length > 0 ? links : defaultLinks).map((link: any) => ({
    ...link,
    href: link.href.startsWith('#') ? `/${link.href}` : link.href
  }));

  const displayLogoText = logoText || t('navbar.logoFallback');

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {logoUrl ? (
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-white shadow-sm">
              {(() => {
                const img = logoUrl || '';
                const isDataImage = img.startsWith('data:');
                const isUrlImage = img.startsWith('http') || img.startsWith('/');

                const displayUrl = isUrlImage && !isDataImage
                  ? (img.includes('?') ? `${img}&v=${Date.now()}` : `${img}?v=${Date.now()}`)
                  : img;

                return (
                  <img
                    key={logoUrl}
                    src={displayUrl}
                    alt={displayLogoText}
                    className="max-w-full max-h-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                );
              })()}
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
              {displayLogoText.substring(0, 1)}
            </div>
          )}
          <div className="flex flex-col whitespace-nowrap">
            <span className={`font-bold text-base md:text-lg leading-tight tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              {displayLogoText}
            </span>
            <span className={`text-[8px] md:text-[10px] font-medium tracking-wider uppercase opacity-80 ${isScrolled ? 'text-gray-500' : 'text-gray-300'}`}>
              {logoSubtitle || 'Digitrade Fintech'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${isScrolled ? 'text-gray-600' : 'text-gray-200'}`}
            >
              {link.name}
            </Link>
          ))}
          <LanguageSwitcher variant={isScrolled ? 'light' : 'dark'} />
          <Link
            to="/#contact"
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            {t('navbar.cta')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageSwitcher variant={isScrolled ? 'light' : 'dark'} />
          <button
            className="text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className={isScrolled ? 'text-gray-900' : 'text-white'} /> : <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 md:hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-600 font-medium py-2 border-b border-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold text-center"
              >
                {t('navbar.cta')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
