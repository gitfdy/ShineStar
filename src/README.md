# ShineStar 项目结构

## 目录结构

```
src/
├── components/          # 可复用组件
│   └── CustomDrawerContent.tsx
├── navigation/          # 导航配置
│   └── AppNavigator.tsx
├── screens/            # 页面组件
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   └── SettingsScreen.tsx
├── stores/             # MobX 状态管理
│   ├── UserStore.ts
│   ├── SettingsStore.ts
│   ├── RootStore.ts
│   └── StoreProvider.tsx
├── types/              # TypeScript 类型定义
│   └── index.ts
├── utils/              # 工具函数
│   └── storage.ts
└── README.md
```

## 技术栈

- **React Native**: 0.72.7
- **TypeScript**: 4.8.4
- **React Navigation**: 6.x (Stack, Drawer, Tab)
- **MobX**: 6.13.7 (状态管理)
- **AsyncStorage**: 2.2.0 (本地存储)

## 功能特性

### 路由系统
- 使用 React Navigation 6
- 支持 Stack、Drawer、Tab 导航
- 类型安全的导航参数

### 状态管理
- 使用 MobX 进行状态管理
- 支持响应式数据更新
- 模块化的 Store 设计

### 主题系统
- 默认深色主题
- 支持主题切换
- 统一的颜色管理

### 本地存储
- 使用 AsyncStorage 进行数据持久化
- 封装了常用的存储操作
- 支持类型安全的存储

## 使用说明

### 添加新的 Store
1. 在 `stores/` 目录下创建新的 Store 文件
2. 在 `RootStore.ts` 中导入并实例化
3. 在组件中使用 `useStore()` 访问

### 添加新的页面
1. 在 `screens/` 目录下创建页面组件
2. 在 `AppNavigator.tsx` 中添加路由配置
3. 更新类型定义文件

### 使用状态管理
```typescript
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';

const MyComponent = observer(() => {
  const { userStore, settingsStore } = useStore();
  
  return (
    // 组件内容
  );
});
```

## 开发规范

1. 所有组件都使用 TypeScript
2. 使用 MobX 的 `observer` 包装组件
3. 遵循 React Native 最佳实践
4. 保持代码简洁和可维护性 