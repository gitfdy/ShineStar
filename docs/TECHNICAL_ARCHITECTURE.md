# ShineStar 技术架构文档

## 1. 系统架构概览

### 1.1 整体架构
```
移动端 App (React Native)
    ↓
Supabase Auth (认证)
    ↓
媒体输入 → 本地处理 → Supabase Storage (文件存储)
    ↓
AI处理服务
├── Google Speech-to-Text (语音转文字)
├── Google Vision API (图片OCR)
└── OpenAI GPT-4 (内容分析)
    ↓
Supabase Database (数据存储)
    ↓
实时同步 → 移动端展示
```

### 1.2 技术栈选择理由
| 技术 | 选择理由 | 替代方案 |
|------|----------|----------|
| React Native | 跨平台开发，社区活跃 | Flutter, Ionic |
| Supabase | 快速开发，内置认证和实时功能 | Firebase, AWS |
| OpenAI GPT-4 | AI分析能力强，API稳定 | Claude, PaLM |
| Google Pay | 欧美用户偏好，集成简单 | Stripe, PayPal |

## 2. 前端架构

### 2.1 项目结构
```
src/
├── components/        # 可复用组件
│   ├── VoiceRecorder.js
│   ├── CameraCapture.js
│   ├── TextInput.js
│   └── IdeaCard.js
├── screens/          # 页面组件
│   ├── HomeScreen.js
│   ├── RecordScreen.js
│   ├── DetailScreen.js
│   ├── AnalysisScreen.js
│   └── SettingsScreen.js
├── navigation/       # 导航配置
│   └── AppNavigator.js
├── services/         # API服务
│   ├── supabase.js
│   ├── auth.js
│   ├── storage.js
│   └── ai.js
├── store/           # Redux状态管理
│   ├── index.js
│   ├── authSlice.js
│   └── ideasSlice.js
├── utils/           # 工具函数
│   ├── constants.js
│   ├── helpers.js
│   └── permissions.js
└── assets/          # 静态资源
    ├── images/
    └── icons/
```

### 2.2 状态管理
```javascript
// Redux Store 结构
const store = {
  auth: {
    user: null,
    isAuthenticated: false,
    loading: false
  },
  ideas: {
    items: [],
    loading: false,
    error: null
  },
  analysis: {
    currentAnalysis: null,
    loading: false,
    error: null
  },
  settings: {
    language: 'en',
    notifications: true,
    autoSync: true
  }
};
```

## 3. 后端架构

### 3.1 Supabase 配置
```javascript
// Supabase 客户端配置
const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
};
```

### 3.2 数据库设计
```sql
-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 想法表策略
CREATE POLICY "Users can view own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);
```

## 4. AI服务架构

### 4.1 AI服务集成
```javascript
// AI服务配置
const aiServices = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7
  },
  googleSpeech: {
    apiKey: process.env.GOOGLE_SPEECH_API_KEY,
    language: 'en-US',
    autoLanguageDetection: true
  },
  googleVision: {
    apiKey: process.env.GOOGLE_VISION_API_KEY,
    features: ['TEXT_DETECTION', 'DOCUMENT_TEXT_DETECTION']
  }
};
```

### 4.2 AI分析流程
```javascript
// AI分析流程
const aiAnalysisFlow = {
  // 1. 内容预处理
  preprocess: (content) => {
    return cleanAndFormatContent(content);
  },

  // 2. 批量分析
  batchAnalyze: async (records) => {
    const combinedContent = records.map(record => 
      `${record.content_type}: ${record.content || record.transcript || record.ocr_text}`
    ).join('\n\n');
    
    return await callOpenAI('comprehensive_analysis', combinedContent);
  },

  // 3. 结果后处理
  postprocess: (analysis) => {
    return structureAnalysisResults(analysis);
  }
};
```

## 5. 支付架构

### 5.1 Google Pay 集成
```javascript
// Google Pay 配置
const googlePayConfig = {
  environment: 'TEST', // 或 'PRODUCTION'
  merchantInfo: {
    merchantName: 'ShineStar',
    merchantId: 'your-merchant-id'
  },
  paymentMethods: [{
    type: 'CARD',
    parameters: {
      allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
      allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX']
    }
  }]
};
```

### 5.2 订阅管理
```javascript
// 订阅状态管理
const subscriptionManager = {
  // 检查订阅状态
  checkSubscription: async (userId) => {
    const { data } = await supabase
      .from('users')
      .select('subscription_status, subscription_end')
      .eq('id', userId)
      .single();
    
    return data;
  },

  // 更新订阅状态
  updateSubscription: async (userId, status, endDate) => {
    await supabase
      .from('users')
      .update({
        subscription_status: status,
        subscription_end: endDate
      })
      .eq('id', userId);
  }
};
```

## 6. 性能优化

### 6.1 前端优化
```javascript
// 性能优化策略
const performanceOptimizations = {
  // 图片懒加载
  lazyLoading: {
    threshold: 0.1,
    rootMargin: '50px'
  },

  // 内存管理
  memoryManagement: {
    maxCacheSize: 100,
    cleanupInterval: 300000 // 5分钟
  },

  // 网络优化
  networkOptimization: {
    requestTimeout: 10000,
    retryAttempts: 3,
    offlineSupport: true
  }
};
```

### 6.2 后端优化
```javascript
// 数据库优化
const databaseOptimizations = {
  // 索引优化
  indexes: [
    'CREATE INDEX idx_ideas_user_date ON ideas(user_id, date)',
    'CREATE INDEX idx_ideas_created_at ON ideas(created_at)',
    'CREATE INDEX idx_ai_analyses_idea_id ON ai_analyses(idea_id)'
  ],

  // 查询优化
  queryOptimizations: {
    limitResults: 50,
    usePagination: true,
    cacheQueries: true
  }
};
```

## 7. 安全架构

### 7.1 数据安全
```javascript
// 安全配置
const securityConfig = {
  // 数据加密
  encryption: {
    algorithm: 'AES-256-GCM',
    keyRotation: true
  },

  // 权限控制
  permissions: {
    userData: 'user_own_data',
    sharedData: 'user_shared_data',
    adminData: 'admin_only'
  },

  // API安全
  apiSecurity: {
    rateLimiting: true,
    requestValidation: true,
    corsPolicy: 'strict'
  }
};
```

### 7.2 隐私保护
```javascript
// GDPR合规配置
const privacyConfig = {
  dataRetention: {
    userData: '7 years',
    analyticsData: '2 years',
    logs: '90 days'
  },
  
  userRights: {
    rightToDelete: true,
    rightToPortability: true,
    rightToRectification: true
  },
  
  consentManagement: {
    tracking: false,
    marketing: false,
    analytics: true
  }
};
```

## 8. 部署架构

### 8.1 环境配置
```javascript
// 环境配置
const environments = {
  development: {
    supabaseUrl: 'dev-supabase-url',
    apiKeys: 'dev-api-keys',
    features: 'all-features'
  },
  
  staging: {
    supabaseUrl: 'staging-supabase-url',
    apiKeys: 'staging-api-keys',
    features: 'production-features'
  },
  
  production: {
    supabaseUrl: 'prod-supabase-url',
    apiKeys: 'prod-api-keys',
    features: 'production-features'
  }
};
```

### 8.2 CI/CD 流程
```yaml
# GitHub Actions 配置
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build app
        run: npm run build
      - name: Upload to Google Play
        run: npm run deploy
```

## 9. 监控和日志

### 9.1 应用监控
```javascript
// 监控配置
const monitoringConfig = {
  // 性能监控
  performance: {
    trackAppStart: true,
    trackScreenLoad: true,
    trackApiCalls: true
  },

  // 错误监控
  errorTracking: {
    captureErrors: true,
    captureUnhandledRejections: true,
    sendToService: true
  },

  // 用户行为分析
  analytics: {
    trackUserActions: true,
    trackFeatureUsage: true,
    privacyCompliant: true
  }
};
```

### 9.2 日志管理
```javascript
// 日志配置
const loggingConfig = {
  levels: ['error', 'warn', 'info', 'debug'],
  format: 'json',
  destination: 'remote',
  retention: '30 days',
  sensitiveData: {
    exclude: ['password', 'token', 'apiKey']
  }
};
```

---

**文档版本**：v1.0  
**最后更新**：2024年12月  
**维护者**：开发团队 