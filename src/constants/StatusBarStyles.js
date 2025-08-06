/**
 * StatusBar 样式枚举
 * 提供统一的状态栏样式配置
 */
export const StatusBarStyles = {
  // 默认样式 - 根据系统主题自动调整
  DEFAULT: 'default',
  
  // 浅色内容 - 深色背景上显示白色文字
  LIGHT_CONTENT: 'light-content',
  
  // 深色内容 - 浅色背景上显示黑色文字
  DARK_CONTENT: 'dark-content',
};

/**
 * 预定义的状态栏配置
 * 可以根据不同页面的需求快速应用
 */
export const StatusBarConfigs = {
  // 默认配置 - 浅色主题，透明背景，深色内容
  DEFAULT: {
    barStyle: StatusBarStyles.DARK_CONTENT,
    backgroundColor: 'transparent',
    translucent: true,
  },
  
  // 深色主题 - 透明背景，浅色内容
  DARK: {
    barStyle: StatusBarStyles.LIGHT_CONTENT,
    backgroundColor: 'transparent',
    translucent: true,
  },
  
  // 浅色主题 - 透明背景，深色内容
  LIGHT: {
    barStyle: StatusBarStyles.DARK_CONTENT,
    backgroundColor: 'transparent',
    translucent: true,
  },
  
  // 不透明深色 - 深色背景，浅色内容
  OPAQUE_DARK: {
    barStyle: StatusBarStyles.LIGHT_CONTENT,
    backgroundColor: '#000000',
    translucent: false,
  },
  
  // 不透明浅色 - 浅色背景，深色内容
  OPAQUE_LIGHT: {
    barStyle: StatusBarStyles.DARK_CONTENT,
    backgroundColor: '#FFFFFF',
    translucent: false,
  },
}; 