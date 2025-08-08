import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// 中文翻译
const zhCN = {
  onboarding: {
    step1: {
      title: '欢迎使用 ShineStar',
      subtitle: '有想法？我们来帮你实现',
      description: 'ShineStar 是一个帮助你将创意转化为现实的智能应用',
      buttonText: '开始体验',
    },
    step2: {
      title: '智能录音与转写',
      subtitle: '实时转写，精准高效',
      description: '通过智能录音功能，轻松捕捉你的想法并将其转化为文字',
      buttonText: '继续',
    },
    step3: {
      title: '隐私安全',
      subtitle: '本地存储，安全无忧',
      description: '我们重视你的隐私，所有数据都安全存储在你的设备上',
      buttonText: '继续',
    },
    step4: {
      title: 'AI 智能助手',
      subtitle: 'AI 助力创意腾飞',
      description: '借助 AI 技术，ShineStar 可以帮助你优化和扩展你的想法',
      buttonText: '开始使用',
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
      subtitle: 'Got an idea? We’ll assist',
      description: 'ShineStar is an intelligent app that helps turn your creativity into reality',
      buttonText: 'Get Started',
    },
    step2: {
      title: 'Smart Recording & Transcription',
      subtitle: 'Real-time, precise transcription',
      description: 'Capture your thoughts effortlessly with smart recording and convert them to text',
      buttonText: 'Continue',
    },
    step3: {
      title: 'Privacy & Security',
      subtitle: 'Local storage, worry-free',
      description: 'We value your privacy; all data is securely stored on your device',
      buttonText: 'Continue',
    },
    step4: {
      title: 'AI Smart Assistant',
      subtitle: 'AI empowers your creativity',
      description: 'With AI technology, ShineStar can help refine and expand your ideas',
      buttonText: 'Start Using',
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

i18n.use(initReactI18next).init({
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
