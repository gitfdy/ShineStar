# ShineStar

一个使用 React Native 开发的移动应用，具有抽屉导航和 MobX 状态管理功能。

## 功能特性

- 📱 **React Native** - 跨平台移动应用开发
- 🧭 **抽屉导航** - 使用 React Navigation Drawer
- 🏪 **状态管理** - 使用 MobX 进行状态管理
- 🌙 **深色主题** - 始终使用深色模式
- 👤 **用户管理** - 用户登录/登出功能
- ⚙️ **设置页面** - 应用设置管理

## 技术栈

- **React Native** 0.72.7
- **React Navigation** 6.x
- **MobX** 6.13.7
- **React Native Reanimated** 3.5.4
- **React Native Gesture Handler** 2.13.4

## 项目结构

```
src/
├── components/          # 可复用组件
│   └── CustomDrawerContent.js
├── navigation/          # 导航配置
│   └── AppNavigator.js
├── screens/            # 页面组件
│   ├── HomeScreen.js
│   ├── ProfileScreen.js
│   └── SettingsScreen.js
├── stores/             # MobX 状态管理
│   ├── RootStore.js
│   ├── UserStore.js
│   ├── SettingsStore.js
│   └── StoreProvider.js
└── utils/              # 工具函数
    └── storage.js
```

## 安装和运行

### 环境要求

- Node.js >= 16
- React Native CLI
- Xcode (iOS)
- Android Studio (Android)

### 安装依赖

```bash
npm install
# 或者
yarn install
```

### iOS 运行

```bash
cd ios && pod install && cd ..
npm run ios
```

### Android 运行

```bash
npm run android
```

## 主要功能

### 1. 抽屉导航
- 自定义抽屉内容组件
- 用户信息显示
- 导航菜单

### 2. 状态管理
- 用户状态管理 (UserStore)
- 应用设置管理 (SettingsStore)
- 响应式状态更新

### 3. 页面功能
- **首页** - 欢迎页面和用户信息显示
- **个人资料** - 用户登录/登出功能
- **设置** - 应用设置管理（深色模式、通知等）

## 开发说明

### 从 TypeScript 转换
本项目已从 TypeScript 完全转换为 JavaScript，移除了所有类型注解和接口定义，保持了完整的功能性。

### 状态管理
使用 MobX 进行状态管理，通过 `useStore()` hook 在组件中访问状态：

```javascript
import { useStore } from '../stores/StoreProvider';

const { userStore, settingsStore } = useStore();
```

### 导航
使用 React Navigation 的 Drawer Navigator，支持：
- 抽屉导航
- 自定义抽屉内容
- 页面间导航

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
