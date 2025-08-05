import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// 中文翻译
const zhCN = {
  onboarding: {
    step1: {
      title: '欢迎来到 ShineStar',
      subtitle: '将语音转录为文本，快速、轻松、无忧地获取即时笔记！',
      buttonText: '开始使用',
    },
    step2: {
      title: '立即录音与转录',
      subtitle: '准确的转录，带时间戳和说话者识别',
      buttonText: '继续',
    },
    step3: {
      title: '将数小时总结为数分钟',
      subtitle: '一键获取自动摘要、行动项目和关键主题见解！',
      buttonText: '继续',
    },
  },
  common: {
    skip: '跳过',
  },
};

// 英文翻译
const enUS = {
  onboarding: {
    step1: {
      title: 'Welcome to ShineStar',
      subtitle: 'Transform voice to text, get instant notes quickly, easily, and worry-free!',
      buttonText: 'Get Started',
    },
    step2: {
      title: 'Record and Transcribe Instantly',
      subtitle: 'Accurate transcription with timestamps and speaker identification',
      buttonText: 'Continue',
    },
    step3: {
      title: 'Summarize Hours into Minutes',
      subtitle: 'Get automatic summaries, action items, and key insights with one click!',
      buttonText: 'Continue',
    },
  },
  common: {
    skip: 'Skip',
  },
};

const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
};

// 获取系统语言
const getSystemLanguage = () => {
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

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSystemLanguage(), // 根据系统语言设置
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false, // React 已经转义了
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n; 