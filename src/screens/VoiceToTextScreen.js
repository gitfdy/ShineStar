import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import VoiceToText from '../utils/VoiceToText';

const VoiceToTextScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState('');
  const [partialResults, setPartialResults] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('zh-CN');
  const [errorMessage, setErrorMessage] = useState('');
  const [availabilityInfo, setAvailabilityInfo] = useState(null);

  useEffect(() => {
    checkAvailability();
    setupEventListeners();
    
    return () => {
      VoiceToText.removeAllListeners();
      VoiceToText.destroy();
    };
  }, []);

  const checkAvailability = async () => {
    try {
      const info = await VoiceToText.isAvailable();
      setAvailabilityInfo(info);
      setIsAvailable(info.available);
      if (!info.available) {
        console.log('语音识别不可用:', info.reason);
      }
    } catch (error) {
      console.error('检查语音识别可用性失败:', error);
      setIsAvailable(false);
    }
  };

  const setupEventListeners = () => {
    // 开始识别
    VoiceToText.addEventListener('onStart', () => {
      setIsListening(true);
      setPartialResults('');
      setErrorMessage('');
    });

    // 停止识别
    VoiceToText.addEventListener('onStop', () => {
      setIsListening(false);
    });

    // 准备开始说话
    VoiceToText.addEventListener('onReadyForSpeech', () => {
      console.log('准备开始语音识别');
    });

    // 开始说话
    VoiceToText.addEventListener('onBeginningOfSpeech', () => {
      console.log('开始说话');
    });

    // 结束说话
    VoiceToText.addEventListener('onEndOfSpeech', () => {
      console.log('结束说话');
    });

    // 音量变化
    VoiceToText.addEventListener('onRmsChanged', (data) => {
      console.log('音量变化:', data.rmsdB);
    });

    // 最终结果
    VoiceToText.addEventListener('onResults', (data) => {
      if (data.results && data.results.length > 0) {
        const bestResult = data.results[0];
        setResults(bestResult.text);
        setPartialResults('');
        console.log('识别结果:', bestResult.text, '置信度:', bestResult.confidence);
      }
    });

    // 部分结果
    VoiceToText.addEventListener('onPartialResults', (data) => {
      if (data.results && data.results.length > 0) {
        setPartialResults(data.results[0].text);
      }
    });

    // 错误处理
    VoiceToText.addEventListener('onError', (data) => {
      setIsListening(false);
      console.error('语音识别错误:', data);
      setErrorMessage(data.message);
      // 对于特定错误，不显示弹窗，只在UI中显示
      if (data.error !== 7) { // ERROR_NO_MATCH
        Alert.alert('错误', `语音识别失败: ${data.message}`);
      }
    });

    // 销毁
    VoiceToText.addEventListener('onDestroy', () => {
      console.log('语音识别器已销毁');
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
        await VoiceToText.stopListening();
      } else {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          Alert.alert('权限被拒绝', '需要麦克风权限才能使用语音识别功能');
          return;
        }

        await VoiceToText.setLanguage(currentLanguage);
        await VoiceToText.startListening();
      }
    } catch (error) {
      console.error('语音识别操作失败:', error);
      Alert.alert('错误', error.message || '操作失败');
    }
  };

  const clearResults = () => {
    setResults('');
    setPartialResults('');
    setErrorMessage('');
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    VoiceToText.setLanguage(language);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>语音转文字</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            状态: {isAvailable ? '✅ 可用' : '❌ 不可用'}
          </Text>
          <Text style={styles.statusText}>
            当前语言: {currentLanguage}
          </Text>
          {availabilityInfo && (
            <>
              <Text style={styles.statusText}>
                设备: {availabilityInfo.deviceInfo}
              </Text>
              <Text style={styles.statusText}>
                权限: {availabilityInfo.hasPermission ? '✅' : '❌'}
              </Text>
              <Text style={styles.statusText}>
                网络: {availabilityInfo.hasNetwork ? '✅' : '❌'}
              </Text>
              <Text style={styles.statusText}>
                Google服务: {availabilityInfo.hasGoogleServices ? '✅' : '❌'}
              </Text>
              {!isAvailable && availabilityInfo.reason && (
                <Text style={styles.errorText}>
                  ❌ {availabilityInfo.reason}
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
            disabled={!isAvailable}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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

export default VoiceToTextScreen; 