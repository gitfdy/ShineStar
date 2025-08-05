import { Platform, NativeModules, NativeEventEmitter } from 'react-native';

const { GoogleCloudSpeechModule } = NativeModules;

class GoogleCloudSpeechToText {
  constructor() {
    this.isAvailable = false;
    this.isListening = false;
    this.currentLanguage = 'en-US';
    this.listeners = [];
    // this.eventEmitter = new NativeEventEmitter(GoogleCloudSpeechModule);
    this.eventEmitter = null;
  }

  /**
   * 检查Google Cloud服务是否可用
   * @returns {Promise<Object>}
   */
  async isAvailable() {
    if (Platform.OS !== 'android') {
      return {
        available: false,
        reason: '仅支持Android平台'
      };
    }
    
    try {
      if (GoogleCloudSpeechModule) {
        return await GoogleCloudSpeechModule.isAvailable();
      }
      
      return {
        available: false,
        reason: 'Google Cloud Speech模块未找到'
      };
    } catch (error) {
      console.error('Google Cloud Speech服务检查失败:', error);
      return {
        available: false,
        reason: error.message
      };
    }
  }

  /**
   * 开始实时语音识别
   * @param {string} language 语言代码
   * @returns {Promise<void>}
   */
  async startListening(language = 'en-US') {
    if (Platform.OS !== 'android') {
      throw new Error('Google Cloud Speech仅支持Android平台');
    }

    try {
      if (!GoogleCloudSpeechModule) {
        throw new Error('Google Cloud Speech模块未找到');
      }

      this.currentLanguage = language;
      this.isListening = true;
      
      await GoogleCloudSpeechModule.startListening(language);
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
    if (Platform.OS !== 'android') {
      throw new Error('Google Cloud Speech仅支持Android平台');
    }

    try {
      if (GoogleCloudSpeechModule) {
        await GoogleCloudSpeechModule.stopListening();
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
      if (GoogleCloudSpeechModule) {
        await GoogleCloudSpeechModule.setLanguage(language);
        this.currentLanguage = language;
        return true;
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
    const subscription = this.eventEmitter.addListener(eventName, callback);
    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * 移除事件监听器
   * @param {string} eventName 事件名称
   * @param {Function} callback 回调函数
   */
  removeEventListener(eventName, callback) {
    // 移除特定的监听器
    this.listeners = this.listeners.filter(listener => {
      if (listener.eventName === eventName && listener.callback === callback) {
        listener.remove();
        return false;
      }
      return true;
    });
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners() {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }

  /**
   * 获取支持的语言列表
   * @returns {Array<string>} 语言代码列表
   */
  getSupportedLanguages() {
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'zh-CN', 'zh-TW', 'zh-HK',
      'ja-JP', 'ko-KR',
      'fr-FR', 'de-DE', 'es-ES', 'it-IT',
      'pt-BR', 'pt-PT', 'ru-RU', 'ar-SA',
      'hi-IN', 'th-TH', 'vi-VN', 'id-ID',
      'nl-NL', 'sv-SE', 'da-DK', 'no-NO',
      'pl-PL', 'tr-TR', 'he-IL', 'el-GR'
    ];
  }

  /**
   * 获取服务状态信息
   * @returns {Promise<Object>}
   */
  async getServiceInfo() {
    try {
      if (GoogleCloudSpeechModule) {
        return await GoogleCloudSpeechModule.getServiceInfo();
      }
      
      return {
        available: false,
        reason: 'Google Cloud Speech模块未找到'
      };
    } catch (error) {
      return {
        available: false,
        reason: error.message
      };
    }
  }

  /**
   * 设置Google Cloud API密钥
   * @param {string} apiKey API密钥
   * @returns {Promise<boolean>}
   */
  async setApiKey(apiKey) {
    try {
      if (GoogleCloudSpeechModule) {
        await GoogleCloudSpeechModule.setApiKey(apiKey);
        return true;
      }
      return false;
    } catch (error) {
      console.error('设置API密钥失败:', error);
      return false;
    }
  }
}

export default new GoogleCloudSpeechToText(); 