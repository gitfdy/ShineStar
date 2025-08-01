# BasePage 组件

BasePage 是一个基础页面组件，提供了统一的状态栏配置和页面结构。

## 功能特性

- ✅ 统一的状态栏配置
- ✅ 支持 SafeAreaView 或普通 View
- ✅ 可自定义状态栏样式
- ✅ 支持透明状态栏
- ✅ 类型安全的 props

## 使用方法

### 基本用法

```javascript
import BasePage from '../components/BasePage';
import { StatusBarStyles } from '../constants/StatusBarStyles';

const MyScreen = () => {
  return (
    <BasePage barStyle={StatusBarStyles.DARK_CONTENT}>
      {/* 你的页面内容 */}
    </BasePage>
  );
};
```

### 使用预定义配置

```javascript
import BasePage from '../components/BasePage';
import { StatusBarConfigs } from '../constants/StatusBarStyles';

const MyScreen = () => {
  return (
    <BasePage {...StatusBarConfigs.LIGHT}>
      {/* 浅色主题页面 */}
    </BasePage>
  );
};
```

### 自定义配置

```javascript
const MyScreen = () => {
  return (
    <BasePage 
      barStyle="light-content"
      backgroundColor="#000000"
      translucent={false}
      useSafeArea={false}
      style={{ backgroundColor: '#f0f0f0' }}
    >
      {/* 自定义配置的页面 */}
    </BasePage>
  );
};
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `barStyle` | `string` | `'default'` | 状态栏样式: 'default' \| 'light-content' \| 'dark-content' |
| `backgroundColor` | `string` | `'transparent'` | 状态栏背景色 |
| `translucent` | `boolean` | `true` | 是否启用透明状态栏 |
| `useSafeArea` | `boolean` | `true` | 是否使用 SafeAreaView |
| `style` | `StyleSheet` | - | 容器样式 |
| `children` | `ReactNode` | - | 子组件 |

## 状态栏样式枚举

```javascript
import { StatusBarStyles } from '../constants/StatusBarStyles';

// 可用的样式
StatusBarStyles.DEFAULT        // 'default' - 根据系统主题自动调整
StatusBarStyles.LIGHT_CONTENT  // 'light-content' - 深色背景上显示白色文字
StatusBarStyles.DARK_CONTENT   // 'dark-content' - 浅色背景上显示黑色文字
```

## 预定义配置

```javascript
import { StatusBarConfigs } from '../constants/StatusBarStyles';

// 可用的配置
StatusBarConfigs.DEFAULT       // 默认配置 - 透明背景，自动样式
StatusBarConfigs.DARK          // 深色主题 - 透明背景，浅色内容
StatusBarConfigs.LIGHT         // 浅色主题 - 透明背景，深色内容
StatusBarConfigs.OPAQUE_DARK   // 不透明深色 - 深色背景，浅色内容
StatusBarConfigs.OPAQUE_LIGHT  // 不透明浅色 - 浅色背景，深色内容
```

## 最佳实践

1. **深色背景页面**：使用 `StatusBarStyles.LIGHT_CONTENT`
2. **浅色背景页面**：使用 `StatusBarStyles.DARK_CONTENT`
3. **动态主题页面**：使用 `StatusBarStyles.DEFAULT`
4. **全屏页面**：设置 `translucent={true}` 和 `backgroundColor="transparent"`

## 示例

### 引导页面
```javascript
<BasePage barStyle={StatusBarStyles.DARK_CONTENT}>
  {/* 引导内容 */}
</BasePage>
```

### 主应用页面
```javascript
<BasePage barStyle={StatusBarStyles.LIGHT_CONTENT}>
  {/* 主应用内容 */}
</BasePage>
```

### 设置页面
```javascript
<BasePage {...StatusBarConfigs.LIGHT}>
  {/* 设置页面内容 */}
</BasePage>
``` 