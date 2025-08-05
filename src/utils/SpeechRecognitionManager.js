import { Platform } from 'react-native';
import VoiceToText from './VoiceToText';
import GoogleCloudSpeechToText from './GoogleCloudSpeechToText';

class SpeechRecognitionManager {
  constructor() {
    this.currentProvider = 'local'; // 'local' 或 'google'
    this.isListening = false;
    this.currentLanguage = 'zh-CN';
    this.listeners = [];
    this.eventEmitter = null;
  }

  /**
   * 设置语音识别提供商
   * @param {string} provider 'local' 或 'google'
   */
  setProvider(provider) {
    if (provider === 'local' || provider === 'google') {
      this.currentProvider = provider;
      return true;
    }
    return false;
  }

  /**
   * 获取当前提供商
   * @returns {string} 当前提供商
   */
  getCurrentProvider() {
    return this.currentProvider;
  }

  /**
   * 获取可用的提供商列表
   * @returns {Promise<Array>} 可用提供商列表
   */
  async getAvailableProviders() {
    const providers = [];

    // 检查本地语音识别
    try {
      const localAvailable = await VoiceToText.isAvailable();
      if (localAvailable.available) {
        providers.push({
          id: 'local',
          name: '本地语音识别',
          description: '使用Android系统内置的语音识别服务',
          available: true,
          info: localAvailable
        });
      } else {
        providers.push({
          id: 'local',
          name: '本地语音识别',
          description: '使用Android系统内置的语音识别服务',
          available: false,
          reason: localAvailable.reason
        });
      }
    } catch (error) {
      providers.push({
        id: 'local',
        name: '本地语音识别',
        description: '使用Android系统内置的语音识别服务',
        available: false,
        reason: error.message
      });
    }

    // 检查Google Cloud Speech
    try {
      const googleAvailable = await GoogleCloudSpeechToText.isAvailable();
      if (googleAvailable.available) {
        providers.push({
          id: 'google',
          name: 'Google Cloud Speech',
          description: '使用Google Cloud Speech-to-Text服务',
          available: true,
          info: googleAvailable
        });
      } else {
        providers.push({
          id: 'google',
          name: 'Google Cloud Speech',
          description: '使用Google Cloud Speech-to-Text服务',
          available: false,
          reason: googleAvailable.reason
        });
      }
    } catch (error) {
      providers.push({
        id: 'google',
        name: 'Google Cloud Speech',
        description: '使用Google Cloud Speech-to-Text服务',
        available: false,
        reason: error.message
      });
    }

    return providers;
  }

  /**
   * 开始语音识别
   * @param {string} language 语言代码
   * @returns {Promise<void>}
   */
  async startListening(language = this.currentLanguage) {
    if (this.isListening) {
      throw new Error('语音识别已在运行中');
    }

    this.currentLanguage = language;
    this.isListening = true;

    try {
      if (this.currentProvider === 'local') {
        await VoiceToText.setLanguage(language);
        await VoiceToText.startListening();
        this.eventEmitter = VoiceToText.eventEmitter;
      } else if (this.currentProvider === 'google') {
        await GoogleCloudSpeechToText.setLanguage(language);
        await GoogleCloudSpeechToText.startListening(language);
        this.eventEmitter = GoogleCloudSpeechToText.eventEmitter;
      } else {
        throw new Error('未知的语音识别提供商');
      }
    } catch (error) {
      this.isListening = false;
      throw error;
    }
  }

  /**
   * 停止语音识别
   * @returns {Promise<void>}
   */
  async stopListening() {
    if (!this.isListening) {
      throw new Error('语音识别未在运行');
    }

    try {
      if (this.currentProvider === 'local') {
        await VoiceToText.stopListening();
      } else if (this.currentProvider === 'google') {
        await GoogleCloudSpeechToText.stopListening();
      }
      
      this.isListening = false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 设置识别语言
   * @param {string} language 语言代码
   * @returns {Promise<boolean>}
   */
  async setLanguage(language) {
    try {
      this.currentLanguage = language;
      
      if (this.currentProvider === 'local') {
        return await VoiceToText.setLanguage(language);
      } else if (this.currentProvider === 'google') {
        return await GoogleCloudSpeechToText.setLanguage(language);
      }
      
      return false;
    } catch (error) {
      console.error('设置语言失败:', error);
      return false;
    }
  }

  /**
   * 添加事件监听器
   * @param {string} eventName 事件名称
   * @param {Function} callback 回调函数
   * @returns {Object} 监听器对象
   */
  addEventListener(eventName, callback) {
    const provider = this.currentProvider === 'local' ? VoiceToText : GoogleCloudSpeechToText;
    const subscription = provider.addEventListener(eventName, callback);
    this.listeners.push({ subscription, provider });
    return subscription;
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners() {
    this.listeners.forEach(({ subscription }) => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    });
    this.listeners = [];
  }

  /**
   * 设置Google Cloud API密钥
   * @param {string} apiKey API密钥
   * @returns {Promise<boolean>}
   */
  async setGoogleCloudApiKey(apiKey) {
    try {
      return await GoogleCloudSpeechToText.setApiKey(apiKey);
    } catch (error) {
      console.error('设置Google Cloud API密钥失败:', error);
      return false;
    }
  }

  /**
   * 获取支持的语言列表
   * @returns {Array<string>} 语言代码列表
   */
  getSupportedLanguages() {
    if (this.currentProvider === 'local') {
      return ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES'];
    } else if (this.currentProvider === 'google') {
      return GoogleCloudSpeechToText.getSupportedLanguages();
    }
    return [];
  }

  /**
   * 获取当前提供商的状态信息
   * @returns {Promise<Object>}
   */
  async getProviderInfo() {
    try {
      if (this.currentProvider === 'local') {
        return await VoiceToText.isAvailable();
      } else if (this.currentProvider === 'google') {
        return await GoogleCloudSpeechToText.getServiceInfo();
      }
      
      return {
        available: false,
        reason: '未知提供商'
      };
    } catch (error) {
      return {
        available: false,
        reason: error.message
      };
    }
  }

  /**
   * 销毁所有资源
   */
  async destroy() {
    try {
      this.removeAllListeners();
      
      if (this.currentProvider === 'local') {
        await VoiceToText.destroy();
      }
      
      this.isListening = false;
    } catch (error) {
      console.error('销毁语音识别资源失败:', error);
    }
  }
}

export default new SpeechRecognitionManager(); 