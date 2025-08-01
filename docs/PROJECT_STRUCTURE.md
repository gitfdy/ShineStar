# ShineStar 项目目录结构

## 1. 项目根目录

```
ShineStar/
├── README.md                    # 项目主文档
├── package.json                 # 项目依赖配置
├── app.json                    # Expo 应用配置
├── babel.config.js             # Babel 配置
├── metro.config.js             # Metro 打包配置
├── .env                        # 环境变量
├── .gitignore                  # Git 忽略文件
├── .eslintrc.js               # ESLint 配置
├── .prettierrc                # Prettier 配置
├── docs/                       # 项目文档
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── DEVELOPMENT_PLAN.md
│   ├── API_SPECIFICATION.md
│   └── PROJECT_STRUCTURE.md
├── src/                        # 源代码目录
├── android/                    # Android 原生代码
├── ios/                        # iOS 原生代码
└── assets/                     # 静态资源
```

## 2. 源代码目录结构

```
src/
├── App.js                      # 应用入口文件
├── components/                 # 可复用组件
│   ├── common/                 # 通用组件
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   ├── Loading.js
│   │   └── ErrorBoundary.js
│   ├── recording/              # 记录相关组件
│   │   ├── VoiceRecorder.js
│   │   ├── CameraCapture.js
│   │   ├── TextInput.js
│   │   └── MediaUploader.js
│   ├── display/                # 展示相关组件
│   │   ├── IdeaCard.js
│   │   ├── TimelineView.js
│   │   ├── AnalysisReport.js
│   │   └── ActionPlan.js
│   └── navigation/             # 导航组件
│       ├── TabNavigator.js
│       └── DrawerNavigator.js
├── screens/                    # 页面组件
│   ├── auth/                   # 认证页面
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── ProfileScreen.js
│   ├── main/                   # 主要页面
│   │   ├── HomeScreen.js
│   │   ├── RecordScreen.js
│   │   ├── TimelineScreen.js
│   │   └── AnalysisScreen.js
│   ├── settings/               # 设置页面
│   │   ├── SettingsScreen.js
│   │   ├── SubscriptionScreen.js
│   │   └── LanguageScreen.js
│   └── detail/                 # 详情页面
│       ├── IdeaDetailScreen.js
│       ├── AnalysisDetailScreen.js
│       └── ActionPlanScreen.js
├── navigation/                 # 导航配置
│   ├── AppNavigator.js
│   ├── AuthNavigator.js
│   ├── MainNavigator.js
│   └── navigationUtils.js
├── services/                   # API 服务
│   ├── supabase.js            # Supabase 客户端配置
│   ├── auth.js                # 认证服务
│   ├── storage.js             # 文件存储服务
│   ├── ai.js                  # AI 分析服务
│   ├── payment.js             # 支付服务
│   └── api.js                 # 通用 API 服务
├── store/                     # Redux 状态管理
│   ├── index.js               # Store 配置
│   ├── authSlice.js           # 认证状态
│   ├── ideasSlice.js          # 想法记录状态
│   ├── analysisSlice.js       # 分析状态
│   ├── settingsSlice.js       # 设置状态
│   └── middleware/            # 中间件
│       ├── logger.js
│       └── persist.js
├── utils/                     # 工具函数
│   ├── constants.js           # 常量定义
│   ├── helpers.js             # 通用工具函数
│   ├── permissions.js         # 权限管理
│   ├── validation.js          # 数据验证
│   ├── formatters.js          # 数据格式化
│   └── analytics.js           # 数据分析
├── hooks/                     # 自定义 Hooks
│   ├── useAuth.js
│   ├── useIdeas.js
│   ├── useAnalysis.js
│   ├── useSubscription.js
│   └── usePermissions.js
├── config/                    # 配置文件
│   ├── app.js                 # 应用配置
│   ├── api.js                 # API 配置
│   ├── storage.js             # 存储配置
│   └── theme.js               # 主题配置
├── assets/                    # 静态资源
│   ├── images/                # 图片资源
│   │   ├── icons/             # 图标
│   │   ├── logos/             # Logo
│   │   └── backgrounds/       # 背景图
│   ├── fonts/                 # 字体文件
│   └── sounds/                # 音频文件
└── styles/                    # 样式文件
    ├── theme.js               # 主题定义
    ├── colors.js              # 颜色定义
    ├── typography.js          # 字体样式
    └── common.js              # 通用样式
```

## 3. 组件详细结构

### 3.1 通用组件 (components/common/)
```
common/
├── Button.js                  # 按钮组件
├── Input.js                   # 输入框组件
├── Modal.js                   # 模态框组件
├── Loading.js                 # 加载组件
├── ErrorBoundary.js           # 错误边界
├── Toast.js                   # 提示组件
├── Badge.js                   # 徽章组件
├── Avatar.js                  # 头像组件
└── ProgressBar.js             # 进度条组件
```

### 3.2 记录组件 (components/recording/)
```
recording/
├── VoiceRecorder.js           # 语音录制组件
├── CameraCapture.js           # 相机拍摄组件
├── TextInput.js               # 文字输入组件
├── MediaUploader.js           # 媒体上传组件
├── RecordingControls.js       # 录制控制组件
└── MediaPreview.js            # 媒体预览组件
```

### 3.3 展示组件 (components/display/)
```
display/
├── IdeaCard.js                # 想法卡片组件
├── TimelineView.js            # 时间线视图
├── AnalysisReport.js          # 分析报告组件
├── ActionPlan.js              # 执行计划组件
├── TagList.js                 # 标签列表组件
└── SearchBar.js               # 搜索栏组件
```

## 4. 页面详细结构

### 4.1 认证页面 (screens/auth/)
```
auth/
├── LoginScreen.js             # 登录页面
├── RegisterScreen.js          # 注册页面
├── ProfileScreen.js           # 个人资料页面
├── ForgotPasswordScreen.js    # 忘记密码页面
└── OnboardingScreen.js        # 引导页面
```

### 4.2 主要页面 (screens/main/)
```
main/
├── HomeScreen.js              # 首页
├── RecordScreen.js            # 记录页面
├── TimelineScreen.js          # 时间线页面
├── AnalysisScreen.js          # 分析页面
├── SearchScreen.js            # 搜索页面
└── DashboardScreen.js         # 仪表板页面
```

### 4.3 设置页面 (screens/settings/)
```
settings/
├── SettingsScreen.js          # 设置主页面
├── SubscriptionScreen.js      # 订阅管理页面
├── LanguageScreen.js          # 语言设置页面
├── NotificationScreen.js      # 通知设置页面
├── PrivacyScreen.js           # 隐私设置页面
└── AboutScreen.js             # 关于页面
```

## 5. 服务层详细结构

### 5.1 API 服务 (services/)
```
services/
├── supabase.js                # Supabase 客户端
├── auth.js                    # 认证服务
├── storage.js                 # 文件存储服务
├── ai.js                      # AI 分析服务
├── payment.js                 # 支付服务
├── api.js                     # 通用 API 服务
├── realtime.js                # 实时通信服务
└── cache.js                   # 缓存服务
```

### 5.2 状态管理 (store/)
```
store/
├── index.js                   # Store 配置
├── authSlice.js               # 认证状态
├── ideasSlice.js              # 想法记录状态
├── analysisSlice.js           # 分析状态
├── settingsSlice.js           # 设置状态
├── subscriptionSlice.js       # 订阅状态
├── uiSlice.js                 # UI 状态
└── middleware/
    ├── logger.js              # 日志中间件
    ├── persist.js             # 持久化中间件
    └── analytics.js           # 分析中间件
```

## 6. 工具函数详细结构

### 6.1 工具函数 (utils/)
```
utils/
├── constants.js               # 常量定义
├── helpers.js                 # 通用工具函数
├── permissions.js             # 权限管理
├── validation.js              # 数据验证
├── formatters.js              # 数据格式化
├── analytics.js               # 数据分析
├── storage.js                 # 本地存储
├── network.js                 # 网络工具
└── device.js                  # 设备信息
```

### 6.2 自定义 Hooks (hooks/)
```
hooks/
├── useAuth.js                 # 认证 Hook
├── useIdeas.js                # 想法记录 Hook
├── useAnalysis.js             # 分析 Hook
├── useSubscription.js         # 订阅 Hook
├── usePermissions.js          # 权限 Hook
├── useNetwork.js              # 网络状态 Hook
├── useLocation.js             # 位置 Hook
└── useMedia.js                # 媒体 Hook
```

## 7. 配置文件详细结构

### 7.1 配置 (config/)
```
config/
├── app.js                     # 应用配置
├── api.js                     # API 配置
├── storage.js                 # 存储配置
├── theme.js                   # 主题配置
├── languages.js               # 语言配置
├── permissions.js             # 权限配置
└── analytics.js               # 分析配置
```

### 7.2 样式 (styles/)
```
styles/
├── theme.js                   # 主题定义
├── colors.js                  # 颜色定义
├── typography.js              # 字体样式
├── spacing.js                 # 间距定义
├── shadows.js                 # 阴影定义
├── animations.js              # 动画定义
└── common.js                  # 通用样式
```

## 8. 原生代码结构

### 8.1 Android (android/)
```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── shinestar/
│   │   │   │           └── ideatracker/
│   │   │   │               ├── MainActivity.java
│   │   │   │               └── MainApplication.java
│   │   │   ├── res/
│   │   │   │   ├── values/
│   │   │   │   ├── drawable/
│   │   │   │   └── mipmap/
│   │   │   └── AndroidManifest.xml
│   │   └── debug/
│   ├── build.gradle
│   └── proguard-rules.pro
├── gradle/
├── build.gradle
├── gradle.properties
└── settings.gradle
```

### 8.2 iOS (ios/)
```
ios/
├── ShineStar/
│   ├── AppDelegate.m
│   ├── AppDelegate.h
│   ├── Info.plist
│   ├── LaunchScreen.storyboard
│   └── Images.xcassets/
├── ShineStar.xcodeproj/
├── Podfile
└── Podfile.lock
```

## 9. 文档结构

### 9.1 文档 (docs/)
```
docs/
├── README.md                  # 项目主文档
├── TECHNICAL_ARCHITECTURE.md  # 技术架构文档
├── DEVELOPMENT_PLAN.md        # 开发计划文档
├── API_SPECIFICATION.md       # API 规范文档
├── PROJECT_STRUCTURE.md       # 项目结构文档
├── DEPLOYMENT.md              # 部署文档
├── TESTING.md                 # 测试文档
└── CONTRIBUTING.md            # 贡献指南
```

## 10. 构建和部署文件

### 10.1 配置文件
```
├── package.json               # 项目依赖
├── app.json                   # Expo 配置
├── babel.config.js            # Babel 配置
├── metro.config.js            # Metro 配置
├── .env                       # 环境变量
├── .env.development          # 开发环境变量
├── .env.staging              # 测试环境变量
├── .env.production           # 生产环境变量
├── .gitignore                # Git 忽略文件
├── .eslintrc.js              # ESLint 配置
├── .prettierrc               # Prettier 配置
└── .editorconfig             # 编辑器配置
```

### 10.2 CI/CD 文件
```
├── .github/
│   └── workflows/
│       ├── ci.yml             # 持续集成
│       ├── cd.yml             # 持续部署
│       └── release.yml        # 发布流程
├── fastlane/
│   ├── Fastfile              # Fastlane 配置
│   └── Appfile               # 应用配置
└── scripts/
    ├── build.sh              # 构建脚本
    ├── deploy.sh             # 部署脚本
    └── test.sh               # 测试脚本
```

---

**文档版本**：v1.0  
**最后更新**：2024年12月  
**维护者**：开发团队 