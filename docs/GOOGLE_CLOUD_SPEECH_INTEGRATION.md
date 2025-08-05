# Google Cloud Speech-to-Text 集成指南

## 概述

本项目已成功集成Google Cloud Speech-to-Text服务，提供了高质量的语音识别功能。用户可以在本地语音识别和Google Cloud Speech之间自由切换。

## 功能特性

### ✅ 已实现的功能
- **双引擎支持**: 本地语音识别 + Google Cloud Speech
- **实时语音识别**: 支持实时音频流处理
- **多语言支持**: 支持中文、英文等多种语言
- **高质量识别**: Google Cloud提供更准确的识别结果
- **自动切换**: 智能选择最佳可用引擎
- **API密钥管理**: 安全的API密钥配置
- **错误处理**: 完善的错误处理和用户提示

### 🔧 技术实现
- **Android原生模块**: 使用AudioRecord进行音频录制
- **HTTP客户端**: 使用OkHttp进行API通信
- **Base64编码**: 音频数据编码传输
- **JSON处理**: 使用Android原生JSON库
- **线程管理**: 异步处理音频流和网络请求

## 安装和配置

### 1. 获取Google Cloud API密钥

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Speech-to-Text API
4. 创建API密钥
5. 复制API密钥备用

### 2. 项目配置

#### Android配置
项目已自动配置以下依赖：
```gradle
implementation 'com.squareup.okhttp3:okhttp:4.9.3'
```

#### 权限配置
在 `android/app/src/main/AndroidManifest.xml` 中已添加：
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 3. 使用步骤

#### 在应用中设置API密钥
1. 打开应用
2. 进入"集成语音识别"页面
3. 选择"Google Cloud Speech"提供商
4. 输入您的API密钥
5. 点击"设置API密钥"

#### 开始使用
1. 选择语音识别提供商（本地或Google Cloud）
2. 选择识别语言
3. 点击"开始识别"
4. 开始说话
5. 查看识别结果

## API文档

### SpeechRecognitionManager

主要的语音识别管理器，提供统一的API接口。

#### 方法

##### `setProvider(provider)`
设置语音识别提供商
- `provider`: 'local' 或 'google'

##### `getAvailableProviders()`
获取可用的提供商列表
- 返回: Promise<Array>

##### `startListening(language)`
开始语音识别
- `language`: 语言代码，如 'zh-CN', 'en-US'

##### `stopListening()`
停止语音识别

##### `setLanguage(language)`
设置识别语言
- `language`: 语言代码

##### `setGoogleCloudApiKey(apiKey)`
设置Google Cloud API密钥
- `apiKey`: API密钥字符串

##### `addEventListener(eventName, callback)`
添加事件监听器
- `eventName`: 事件名称
- `callback`: 回调函数

##### `removeAllListeners()`
移除所有监听器

### 支持的事件

- `onStart`: 开始识别
- `onStop`: 停止识别
- `onReadyForSpeech`: 准备开始说话
- `onBeginningOfSpeech`: 开始说话
- `onEndOfSpeech`: 结束说话
- `onRmsChanged`: 音量变化
- `onResults`: 最终识别结果
- `onPartialResults`: 部分识别结果
- `onError`: 错误事件

### 支持的语言

#### 本地语音识别
- zh-CN (中文)
- en-US (英文)
- ja-JP (日文)
- ko-KR (韩文)
- fr-FR (法文)
- de-DE (德文)
- es-ES (西班牙文)

#### Google Cloud Speech
- zh-CN, zh-TW, zh-HK (中文)
- en-US, en-GB, en-AU, en-CA (英文)
- ja-JP (日文)
- ko-KR (韩文)
- fr-FR (法文)
- de-DE (德文)
- es-ES (西班牙文)
- 以及更多语言...

## 代码示例

### 基本使用

```javascript
import SpeechRecognitionManager from '../utils/SpeechRecognitionManager';

// 检查可用提供商
const providers = await SpeechRecognitionManager.getAvailableProviders();
console.log('可用提供商:', providers);

// 设置Google Cloud API密钥
await SpeechRecognitionManager.setGoogleCloudApiKey('YOUR_API_KEY');

// 切换到Google Cloud
SpeechRecognitionManager.setProvider('google');

// 设置语言
await SpeechRecognitionManager.setLanguage('zh-CN');

// 添加事件监听
SpeechRecognitionManager.addEventListener('onResults', (data) => {
  console.log('识别结果:', data.results[0].text);
});

// 开始识别
await SpeechRecognitionManager.startListening('zh-CN');

// 停止识别
await SpeechRecognitionManager.stopListening();
```

### 在React组件中使用

```javascript
import React, { useState, useEffect } from 'react';
import SpeechRecognitionManager from '../utils/SpeechRecognitionManager';

const SpeechComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState('');

  useEffect(() => {
    // 设置事件监听
    SpeechRecognitionManager.addEventListener('onStart', () => {
      setIsListening(true);
    });

    SpeechRecognitionManager.addEventListener('onStop', () => {
      setIsListening(false);
    });

    SpeechRecognitionManager.addEventListener('onResults', (data) => {
      if (data.results && data.results.length > 0) {
        setResults(data.results[0].text);
      }
    });

    return () => {
      SpeechRecognitionManager.removeAllListeners();
    };
  }, []);

  const startListening = async () => {
    try {
      await SpeechRecognitionManager.startListening('zh-CN');
    } catch (error) {
      console.error('启动失败:', error);
    }
  };

  const stopListening = async () => {
    try {
      await SpeechRecognitionManager.stopListening();
    } catch (error) {
      console.error('停止失败:', error);
    }
  };

  return (
    <View>
      <Text>识别结果: {results}</Text>
      <Button 
        title={isListening ? '停止' : '开始'} 
        onPress={isListening ? stopListening : startListening} 
      />
    </View>
  );
};
```

## 错误处理

### 常见错误及解决方案

#### 1. API密钥错误
**错误**: "请先设置Google Cloud API密钥"
**解决**: 确保已正确设置API密钥

#### 2. 网络连接错误
**错误**: "网络连接不可用"
**解决**: 检查网络连接，确保可以访问Google Cloud API

#### 3. 权限错误
**错误**: "缺少麦克风权限"
**解决**: 在应用设置中授予麦克风权限

#### 4. 服务不可用
**错误**: "Google Cloud Speech服务不可用"
**解决**: 检查API密钥是否正确，网络是否正常

## 性能优化

### 音频配置
- **采样率**: 16kHz (适合语音识别)
- **声道**: 单声道
- **编码**: PCM 16-bit
- **缓冲区大小**: 自动计算最优值

### 网络优化
- **异步处理**: 使用线程池处理音频和网络请求
- **错误重试**: 网络错误自动重试机制
- **超时设置**: 合理的请求超时时间

## 安全注意事项

### API密钥安全
1. **不要硬编码**: 不要在代码中硬编码API密钥
2. **环境变量**: 使用环境变量或安全的配置管理
3. **密钥轮换**: 定期更换API密钥
4. **权限限制**: 在Google Cloud Console中限制API密钥权限

### 数据隐私
1. **音频处理**: 音频数据仅在内存中处理，不持久化存储
2. **网络传输**: 使用HTTPS加密传输
3. **用户同意**: 确保用户同意语音识别功能

## 故障排除

### 调试步骤
1. 检查API密钥是否正确
2. 确认网络连接正常
3. 验证麦克风权限已授予
4. 查看控制台日志输出
5. 测试本地语音识别是否工作

### 日志查看
```bash
# 查看Android日志
adb logcat | grep "GoogleCloudSpeechModule"
adb logcat | grep "VoiceToTextModule"
```

## 更新日志

### v1.0.0
- ✅ 集成Google Cloud Speech-to-Text
- ✅ 实现双引擎语音识别
- ✅ 添加API密钥管理
- ✅ 完善错误处理
- ✅ 优化用户界面

## 技术支持

如有问题，请检查：
1. API密钥是否正确
2. 网络连接是否正常
3. 应用权限是否已授予
4. 设备是否支持语音识别

## 许可证

本项目遵循MIT许可证。Google Cloud Speech-to-Text服务遵循Google Cloud服务条款。 