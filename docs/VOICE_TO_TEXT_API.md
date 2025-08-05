# 语音转文字 API 文档

## 概述

这是一个原生的语音转文字模块，使用Android的SpeechRecognizer API实现。该模块提供了完整的语音识别功能，包括实时识别、多语言支持、错误处理等。

## 功能特性

- ✅ 实时语音识别
- ✅ 部分结果显示
- ✅ 多语言支持（中文、英文等）
- ✅ 音量变化监听
- ✅ 完整的错误处理
- ✅ 权限管理
- ✅ 事件驱动架构

## 安装

该模块已经集成到项目中，无需额外安装。

## 权限配置

### Android

在 `android/app/src/main/AndroidManifest.xml` 中已经添加了录音权限：

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## 基本使用

### 1. 导入模块

```javascript
import VoiceToText from '../utils/VoiceToText';
```

### 2. 检查可用性

```javascript
const isAvailable = await VoiceToText.isAvailable();
if (!isAvailable) {
  console.log('语音识别不可用');
}
```

### 3. 设置语言

```javascript
// 设置中文
await VoiceToText.setLanguage('zh-CN');

// 设置英文
await VoiceToText.setLanguage('en-US');
```

### 4. 开始语音识别

```javascript
try {
  await VoiceToText.startListening();
  console.log('开始语音识别');
} catch (error) {
  console.error('启动失败:', error);
}
```

### 5. 停止语音识别

```javascript
try {
  await VoiceToText.stopListening();
  console.log('停止语音识别');
} catch (error) {
  console.error('停止失败:', error);
}
```

### 6. 监听事件

```javascript
// 开始识别
VoiceToText.addEventListener('onStart', () => {
  console.log('语音识别已开始');
});

// 准备说话
VoiceToText.addEventListener('onReadyForSpeech', () => {
  console.log('准备开始说话');
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
  console.log('音量:', data.rmsdB);
});

// 最终结果
VoiceToText.addEventListener('onResults', (data) => {
  if (data.results && data.results.length > 0) {
    const bestResult = data.results[0];
    console.log('识别结果:', bestResult.text);
    console.log('置信度:', bestResult.confidence);
  }
});

// 部分结果（实时）
VoiceToText.addEventListener('onPartialResults', (data) => {
  if (data.results && data.results.length > 0) {
    console.log('实时识别:', data.results[0].text);
  }
});

// 错误处理
VoiceToText.addEventListener('onError', (data) => {
  console.error('识别错误:', data.message);
});

// 停止识别
VoiceToText.addEventListener('onStop', () => {
  console.log('语音识别已停止');
});

// 销毁
VoiceToText.addEventListener('onDestroy', () => {
  console.log('语音识别器已销毁');
});
```

### 7. 清理资源

```javascript
// 移除所有监听器
VoiceToText.removeAllListeners();

// 销毁识别器
await VoiceToText.destroy();
```

## API 参考

### 方法

#### `startListening()`
开始语音识别。

**返回值:** `Promise<string>`

**示例:**
```javascript
try {
  await VoiceToText.startListening();
} catch (error) {
  console.error('启动失败:', error);
}
```

#### `stopListening()`
停止语音识别。

**返回值:** `Promise<string>`

**示例:**
```javascript
try {
  await VoiceToText.stopListening();
} catch (error) {
  console.error('停止失败:', error);
}
```

#### `destroy()`
销毁语音识别器，释放资源。

**返回值:** `Promise<string>`

**示例:**
```javascript
await VoiceToText.destroy();
```

#### `setLanguage(language)`
设置识别语言。

**参数:**
- `language` (string): 语言代码，如 'zh-CN', 'en-US'

**返回值:** `Promise<boolean>`

**示例:**
```javascript
await VoiceToText.setLanguage('zh-CN');
```

#### `isAvailable()`
检查语音识别是否可用。

**返回值:** `Promise<boolean>`

**示例:**
```javascript
const available = await VoiceToText.isAvailable();
```

#### `addEventListener(eventName, callback)`
添加事件监听器。

**参数:**
- `eventName` (string): 事件名称
- `callback` (function): 回调函数

**返回值:** `Object` - 监听器对象，包含remove方法

**示例:**
```javascript
const subscription = VoiceToText.addEventListener('onResults', (data) => {
  console.log('结果:', data);
});

// 移除监听器
subscription.remove();
```

#### `removeAllListeners()`
移除所有监听器。

**示例:**
```javascript
VoiceToText.removeAllListeners();
```

#### `getEventNames()`
获取支持的事件名称列表。

**返回值:** `Array<string>`

**示例:**
```javascript
const events = VoiceToText.getEventNames();
console.log('支持的事件:', events);
```

### 事件

#### `onStart`
语音识别开始。

**数据:** `null`

#### `onStop`
语音识别停止。

**数据:** `null`

#### `onReadyForSpeech`
准备开始语音识别。

**数据:** `null`

#### `onBeginningOfSpeech`
用户开始说话。

**数据:** `null`

#### `onEndOfSpeech`
用户结束说话。

**数据:** `null`

#### `onRmsChanged`
音量变化。

**数据:**
```javascript
{
  rmsdB: number // 音量值
}
```

#### `onResults`
最终识别结果。

**数据:**
```javascript
{
  results: [
    {
      text: string,      // 识别的文本
      confidence: number // 置信度 (0-1)
    }
  ]
}
```

#### `onPartialResults`
部分识别结果（实时）。

**数据:**
```javascript
{
  results: [
    {
      text: string // 识别的文本
    }
  ]
}
```

#### `onError`
识别错误。

**数据:**
```javascript
{
  error: number,   // 错误代码
  message: string  // 错误信息
}
```

#### `onDestroy`
识别器销毁。

**数据:** `null`

## 错误代码

| 错误代码 | 描述 |
|---------|------|
| ERROR_AUDIO | 音频录制错误 |
| ERROR_CLIENT | 客户端错误 |
| ERROR_INSUFFICIENT_PERMISSIONS | 权限不足 |
| ERROR_NETWORK | 网络错误 |
| ERROR_NETWORK_TIMEOUT | 网络超时 |
| ERROR_NO_MATCH | 无匹配结果 |
| ERROR_RECOGNIZER_BUSY | 识别器忙碌 |
| ERROR_SERVER | 服务器错误 |
| ERROR_SPEECH_TIMEOUT | 语音超时 |

## 支持的语言

- `zh-CN` - 中文（简体）
- `zh-TW` - 中文（繁体）
- `en-US` - 英文（美国）
- `en-GB` - 英文（英国）
- `ja-JP` - 日文
- `ko-KR` - 韩文
- `fr-FR` - 法文
- `de-DE` - 德文
- `es-ES` - 西班牙文
- `it-IT` - 意大利文
- `pt-BR` - 葡萄牙文（巴西）
- `ru-RU` - 俄文

## 完整示例

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import VoiceToText from '../utils/VoiceToText';

const VoiceToTextExample = () => {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState('');

  useEffect(() => {
    setupEventListeners();
    return () => {
      VoiceToText.removeAllListeners();
      VoiceToText.destroy();
    };
  }, []);

  const setupEventListeners = () => {
    VoiceToText.addEventListener('onStart', () => {
      setIsListening(true);
    });

    VoiceToText.addEventListener('onStop', () => {
      setIsListening(false);
    });

    VoiceToText.addEventListener('onResults', (data) => {
      if (data.results && data.results.length > 0) {
        setResults(data.results[0].text);
      }
    });

    VoiceToText.addEventListener('onError', (data) => {
      Alert.alert('错误', data.message);
    });
  };

  const toggleListening = async () => {
    try {
      if (isListening) {
        await VoiceToText.stopListening();
      } else {
        await VoiceToText.setLanguage('zh-CN');
        await VoiceToText.startListening();
      }
    } catch (error) {
      Alert.alert('错误', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        {results || '点击按钮开始语音识别'}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: isListening ? '#ff4444' : '#007AFF',
          padding: 15,
          borderRadius: 25,
        }}
        onPress={toggleListening}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>
          {isListening ? '停止' : '开始'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VoiceToTextExample;
```

## 注意事项

1. **权限管理**: 首次使用时会请求麦克风权限，用户必须授权才能使用。
2. **网络依赖**: 语音识别需要网络连接。
3. **设备兼容性**: 仅支持Android设备。
4. **资源管理**: 使用完毕后记得调用 `destroy()` 方法释放资源。
5. **错误处理**: 建议为所有操作添加适当的错误处理。

## 故障排除

### 常见问题

1. **权限被拒绝**
   - 检查是否在AndroidManifest.xml中添加了录音权限
   - 确保用户已授权麦克风权限

2. **识别不准确**
   - 确保网络连接正常
   - 尝试调整说话的音量和清晰度
   - 检查语言设置是否正确

3. **无法启动识别**
   - 检查设备是否支持语音识别
   - 确保没有其他应用正在使用麦克风
   - 重启应用或设备

4. **内存泄漏**
   - 确保在组件卸载时调用 `removeAllListeners()` 和 `destroy()`

## 更新日志

### v1.0.0
- 初始版本
- 支持基本的语音识别功能
- 支持多语言
- 支持实时部分结果
- 完整的错误处理 