import i18n from '../i18n/index.js';
import * as RNLocalize from 'react-native-localize';
import { useEffect } from 'react';

export const changeLanguage = (language) => {
  i18n.changeLanguage(language);
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

export const getSystemLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (locales && locales.length > 0) {
    const systemLocale = locales[0];
    const languageCode = systemLocale.languageCode;
    const countryCode = systemLocale.countryCode;
    
    // 检查是否支持该语言
    const supportedLanguages = ['zh-CN', 'en-US'];
    const fullLocale = `${languageCode}-${countryCode}`;
    const shortLocale = languageCode;
    
    // 优先匹配完整语言代码，然后匹配语言代码
    if (supportedLanguages.includes(fullLocale)) {
      return fullLocale;
    } else if (supportedLanguages.includes(shortLocale)) {
      return shortLocale;
    } else if (languageCode.startsWith('zh')) {
      return 'zh-CN'; // 中文变体都映射到简体中文
    } else if (languageCode.startsWith('en')) {
      return 'en-US'; // 英文变体都映射到美式英文
    }
  }
  
  return 'zh-CN'; // 默认回退到中文
};

export const getAvailableLanguages = () => {
  return [
    { code: 'zh-CN', name: '中文', nativeName: '中文' },
    { code: 'en-US', name: 'English', nativeName: 'English' },
  ];
};

export const initializeLanguage = () => {
  const systemLanguage = getSystemLanguage();
  if (i18n.language !== systemLanguage) {
    i18n.changeLanguage(systemLanguage);
  }
};

// Hook for listening to system language changes
export const useSystemLanguage = () => {
  useEffect(() => {
    // 初始化时设置系统语言
    const systemLanguage = getSystemLanguage();
    if (i18n.language !== systemLanguage) {
      i18n.changeLanguage(systemLanguage);
    }
  }, []);
}; 