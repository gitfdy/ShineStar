import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import SpeechRecognitionManager from '../utils/SpeechRecognitionManager';

const IntegratedSpeechScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState('');
  const [partialResults, setPartialResults] = useState('');
  const [currentProvider, setCurrentProvider] = useState('local');
  const [availableProviders, setAvailableProviders] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('zh-CN');
  const [errorMessage, setErrorMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [providerInfo, setProviderInfo] = useState(null);

  useEffect(() => {
    checkAvailableProviders();
    setupEventListeners();
    
    return () => {
      SpeechRecognitionManager.removeAllListeners();
      SpeechRecognitionManager.destroy();
    };
  }, []);

  const checkAvailableProviders = async () => {
    try {
      const providers = await SpeechRecognitionManager.getAvailableProviders();
      setAvailableProviders(providers);
      
      // 自动选择第一个可用的提供商
      const availableProvider = providers.find(p => p.available);
      if (availableProvider) {
        SpeechRecognitionManager.setProvider(availableProvider.id);
        setCurrentProvider(availableProvider.id);
      }
      
      await updateProviderInfo();
    } catch (error) {
      console.error('检查可用提供商失败:', error);
    }
  };

  const updateProviderInfo = async () => {
    try {
      const info = await SpeechRecognitionManager.getProviderInfo();
      setProviderInfo(info);
    } catch (error) {
      console.error('获取提供商信息失败:', error);
    }
  };

  const setupEventListeners = () => {
    // 开始识别
    SpeechRecognitionManager.addEventListener('onStart', () => {
      setIsListening(true);
      setPartialResults('');
      setErrorMessage('');
    });

    // 停止识别
    SpeechRecognitionManager.addEventListener('onStop', () => {
      setIsListening(false);
    });

    // 准备开始说话
    SpeechRecognitionManager.addEventListener('onReadyForSpeech', () => {
      console.log('准备开始语音识别');
    });

    // 开始说话
    SpeechRecognitionManager.addEventListener('onBeginningOfSpeech', () => {
      console.log('开始说话');
    });

    // 结束说话
    SpeechRecognitionManager.addEventListener('onEndOfSpeech', () => {
      console.log('结束说话');
    });

    // 音量变化
    SpeechRecognitionManager.addEventListener('onRmsChanged', (data) => {
      console.log('音量变化:', data.rmsdB);
    });

    // 最终结果
    SpeechRecognitionManager.addEventListener('onResults', (data) => {
      if (data.results && data.results.length > 0) {
        const bestResult = data.results[0];
        setResults(bestResult.text);
        setPartialResults('');
        console.log('识别结果:', bestResult.text, '置信度:', bestResult.confidence);
      }
    });

    // 部分结果
    SpeechRecognitionManager.addEventListener('onPartialResults', (data) => {
      if (data.results && data.results.length > 0) {
        setPartialResults(data.results[0].text);
      }
    });

    // 错误处理
    SpeechRecognitionManager.addEventListener('onError', (data) => {
      setIsListening(false);
      console.error('语音识别错误:', data);
      setErrorMessage(data.message);
      Alert.alert('错误', `语音识别失败: ${data.message}`);
    });
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: '麦克风权限',
          message: '此应用需要访问您的麦克风进行语音识别',
          buttonPositive: '确定',
          buttonNegative: '取消',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const toggleListening = async () => {
    try {
      if (isListening) {
        await SpeechRecognitionManager.stopListening();
      } else {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          Alert.alert('权限被拒绝', '需要麦克风权限才能使用语音识别功能');
          return;
        }

        await SpeechRecognitionManager.setLanguage(currentLanguage);
        await SpeechRecognitionManager.startListening(currentLanguage);
      }
    } catch (error) {
      console.error('语音识别操作失败:', error);
      Alert.alert('错误', error.message || '操作失败');
    }
  };

  const changeProvider = async (providerId) => {
    try {
      const success = SpeechRecognitionManager.setProvider(providerId);
      if (success) {
        setCurrentProvider(providerId);
        await updateProviderInfo();
        Alert.alert('成功', `已切换到${providerId === 'local' ? '本地语音识别' : 'Google Cloud Speech'}`);
      } else {
        Alert.alert('错误', '切换提供商失败');
      }
    } catch (error) {
      console.error('切换提供商失败:', error);
      Alert.alert('错误', error.message);
    }
  };

  const setGoogleCloudApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('错误', '请输入Google Cloud API密钥');
      return;
    }

    try {
      const success = await SpeechRecognitionManager.setGoogleCloudApiKey(apiKey.trim());
      if (success) {
        Alert.alert('成功', 'Google Cloud API密钥设置成功');
        await updateProviderInfo();
      } else {
        Alert.alert('错误', 'API密钥设置失败');
      }
    } catch (error) {
      console.error('设置API密钥失败:', error);
      Alert.alert('错误', error.message);
    }
  };

  const clearResults = () => {
    setResults('');
    setPartialResults('');
    setErrorMessage('');
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    SpeechRecognitionManager.setLanguage(language);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>集成语音识别</Text>
        
        <View style={styles.providerContainer}>
          <Text style={styles.sectionTitle}>选择语音识别提供商:</Text>
          {availableProviders.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.providerButton,
                currentProvider === provider.id && styles.activeProviderButton,
                !provider.available && styles.disabledProviderButton
              ]}
              onPress={() => changeProvider(provider.id)}
              disabled={!provider.available}
            >
              <Text style={[
                styles.providerButtonText,
                currentProvider === provider.id && styles.activeProviderButtonText,
                !provider.available && styles.disabledProviderButtonText
              ]}>
                {provider.name}
              </Text>
              <Text style={styles.providerDescription}>
                {provider.description}
              </Text>
              {!provider.available && (
                <Text style={styles.providerError}>
                  ❌ {provider.reason}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {currentProvider === 'google' && (
          <View style={styles.apiKeyContainer}>
            <Text style={styles.sectionTitle}>Google Cloud API密钥:</Text>
            <TextInput
              style={styles.apiKeyInput}
              placeholder="输入Google Cloud API密钥"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.apiKeyButton}
              onPress={setGoogleCloudApiKey}
            >
              <Text style={styles.apiKeyButtonText}>设置API密钥</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            当前提供商: {currentProvider === 'local' ? '本地语音识别' : 'Google Cloud Speech'}
          </Text>
          <Text style={styles.statusText}>
            当前语言: {currentLanguage}
          </Text>
          {providerInfo && (
            <>
              <Text style={styles.statusText}>
                状态: {providerInfo.available ? '✅ 可用' : '❌ 不可用'}
              </Text>
              {providerInfo.serviceName && (
                <Text style={styles.statusText}>
                  服务: {providerInfo.serviceName}
                </Text>
              )}
              {providerInfo.sampleRate && (
                <Text style={styles.statusText}>
                  采样率: {providerInfo.sampleRate}Hz
                </Text>
              )}
              {!providerInfo.available && providerInfo.reason && (
                <Text style={styles.errorText}>
                  ❌ {providerInfo.reason}
                </Text>
              )}
            </>
          )}
          {isListening && (
            <Text style={styles.instructionText}>
              💡 请清晰说话，保持3秒以上
            </Text>
          )}
          {errorMessage && (
            <Text style={styles.errorText}>
              ❌ {errorMessage}
            </Text>
          )}
        </View>

        <View style={styles.languageContainer}>
          <Text style={styles.sectionTitle}>选择语言:</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'zh-CN' && styles.activeLanguageButton
              ]}
              onPress={() => changeLanguage('zh-CN')}
            >
              <Text style={styles.languageButtonText}>中文</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'en-US' && styles.activeLanguageButton
              ]}
              onPress={() => changeLanguage('en-US')}
            >
              <Text style={styles.languageButtonText}>English</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>识别结果:</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              {results || '点击开始按钮开始语音识别...'}
            </Text>
          </View>
          
          {partialResults && (
            <View style={styles.partialContainer}>
              <Text style={styles.sectionTitle}>实时识别:</Text>
              <View style={styles.partialBox}>
                <Text style={styles.partialText}>{partialResults}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              isListening && styles.listeningButton
            ]}
            onPress={toggleListening}
            disabled={!providerInfo?.available}
          >
            <Text style={styles.mainButtonText}>
              {isListening ? '停止识别' : '开始识别'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearResults}
          >
            <Text style={styles.clearButtonText}>清除结果</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  providerContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  providerButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeProviderButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  disabledProviderButton: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  providerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeProviderButtonText: {
    color: '#fff',
  },
  disabledProviderButtonText: {
    color: '#999',
  },
  providerDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  providerError: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 5,
  },
  apiKeyContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  apiKeyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  apiKeyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  apiKeyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  instructionText: {
    fontSize: 14,
    marginTop: 10,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    marginTop: 10,
    color: '#FF3B30',
    fontStyle: 'italic',
  },
  languageContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    minWidth: 80,
    alignItems: 'center',
  },
  activeLanguageButton: {
    backgroundColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultBox: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  partialContainer: {
    marginTop: 15,
  },
  partialBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  partialText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#856404',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listeningButton: {
    backgroundColor: '#FF3B30',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default IntegratedSpeechScreen; 