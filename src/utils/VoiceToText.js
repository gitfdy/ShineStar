import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { VoiceToTextModule } = NativeModules;

class VoiceToText {
  constructor() {
    // this.eventEmitter = new NativeEventEmitter(VoiceToTextModule);
    this.eventEmitter =null;
    this.listeners = [];
  }

  /**
   * 开始语音识别
   * @returns {Promise<Object>} 识别结果
   */
  startListening() {
    if (Platform.OS !== 'android') {
      return Promise.reject(new Error('Voice to text is only supported on Android'));
    }
    return VoiceToTextModule.startListening();
  }

  /**
   * 停止语音识别
   * @returns {Promise<string>} 停止结果
   */
  stopListening() {
    if (Platform.OS !== 'android') {
      return Promise.reject(new Error('Voice to text is only supported on Android'));
    }
    return VoiceToTextModule.stopListening();
  }

  /**
   * 销毁语音识别器
   * @returns {Promise<string>} 销毁结果
   */
  destroy() {
    if (Platform.OS !== 'android') {
      return Promise.reject(new Error('Voice to text is only supported on Android'));
    }
    return VoiceToTextModule.destroy();
  }

  /**
   * 设置识别语言
   * @param {string} language 语言代码，如 'en-US', 'zh-CN'
   * @returns {Promise<boolean>} 设置结果
   */
  setLanguage(language) {
    if (Platform.OS !== 'android') {
      return Promise.reject(new Error('Voice to text is only supported on Android'));
    }
    return VoiceToTextModule.setLanguage(language);
  }

  /**
   * 检查语音识别是否可用
   * @returns {Promise<Object>} 详细可用性信息
   */
  isAvailable() {
    if (Platform.OS !== 'android') {
      return Promise.resolve({
        available: false,
        hasPermission: false,
        hasNetwork: false,
        hasGoogleServices: false,
        deviceInfo: 'iOS',
        reason: '仅支持Android平台'
      });
    }
    return VoiceToTextModule.isAvailable();
  }

  /**
   * 添加事件监听器
   * @param {string} eventName 事件名称
   * @param {Function} callback 回调函数
   * @returns {Object} 监听器对象，包含remove方法
   */
  addEventListener(eventName, callback) {
    const subscription = this.eventEmitter.addListener(eventName, callback);
    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners() {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }

  /**
   * 获取支持的事件名称
   * @returns {Array<string>} 事件名称列表
   */
  getEventNames() {
    return [
      'onStart',
      'onStop',
      'onReadyForSpeech',
      'onBeginningOfSpeech',
      'onEndOfSpeech',
      'onRmsChanged',
      'onResults',
      'onPartialResults',
      'onError',
      'onDestroy'
    ];
  }
}

export default new VoiceToText(); 