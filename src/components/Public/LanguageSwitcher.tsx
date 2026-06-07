import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  variant?: 'light' | 'dark';
}

export const LanguageSwitcher = ({ variant = 'dark' }: Props) => {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'zh';
  const next = current === 'en' ? 'zh' : 'en';

  const handleClick = () => {
    i18n.changeLanguage(next);
  };

  const baseColor =
    variant === 'light'
      ? 'text-gray-600 hover:text-blue-600 border-gray-200'
      : 'text-gray-200 hover:text-white border-white/30';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t('languageSwitcher.aria')}
      className={`text-xs font-bold tracking-wider px-3 py-1.5 rounded-full border transition-colors ${baseColor}`}
    >
      <span className={current === 'zh' ? 'opacity-100' : 'opacity-50'}>{t('languageSwitcher.zh')}</span>
      <span className="mx-1 opacity-30">|</span>
      <span className={current === 'en' ? 'opacity-100' : 'opacity-50'}>{t('languageSwitcher.en')}</span>
    </button>
  );
};
