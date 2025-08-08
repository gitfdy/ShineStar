// ShineStar 设计系统
export const theme = {
  // 颜色系统
  colors: {
    primary: '#6366F1',      // 现代科技紫 - 主要操作
    secondary: '#10B981',    // 科技绿 - 次要操作
    success: '#059669',      // 成功绿 - 成功状态
    error: '#DC2626',        // 错误红 - 错误状态
    
    // 中性色
    neutral: {
      black: '#000000',      // 主要文字
      darkGray: '#1C1C1E',  // 次要文字
      gray: '#8E8E93',      // 辅助文字
      lightGray: '#E5E5EA', // 分割线
      background: '#F2F2F7' // 背景色
    }
  },

  // 字体系统
  typography: {
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
      fontFamily: 'SFProDisplay-Bold', // Custom font for headers
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      fontFamily: 'SFProDisplay-Semibold',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
      fontFamily: 'SFProText-Regular',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
      fontFamily: 'SFProText-Regular',
    },
    small: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
      fontFamily: 'SFProText-Regular',
    }
  },

  // 间距系统
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },

  // 圆角系统
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50
  }
};

// 浅色主题配置（原始主题）
export const lightTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    // 浅色主题中性色（保持原始配置）
    neutral: {
      black: '#000000',      // 主要文字 - 黑色
      darkGray: '#1C1C1E',  // 次要文字 - 深灰
      gray: '#8E8E93',      // 辅助文字 - 中灰
      lightGray: '#E5E5EA', // 分割线 - 浅灰
      background: '#F2F2F7' // 背景色 - 浅灰
    }
  }
};

// 深色主题配置
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#8B5CF6', // 更亮的科技紫，在深色背景下更突出
    // 深色主题中性色
    neutral: {
      black: '#FFFFFF',      // 主要文字 - 白色
      darkGray: '#E5E5EA',  // 次要文字 - 浅灰
      gray: '#8E8E93',      // 辅助文字 - 中灰
      lightGray: '#3A3A3C', // 分割线 - 深灰
      background: '#000000' // 背景色 - 黑色
    }
  }
};

// 主题类型
export const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// 根据主题类型获取主题
export const getTheme = (themeType) => {
  switch (themeType) {
    case THEME_TYPES.LIGHT:
      return lightTheme;
    case THEME_TYPES.DARK:
      return darkTheme;
    default:
      return lightTheme; // 默认使用浅色主题
  }
};

// 获取当前主题的便捷函数
export const getCurrentThemeConfig = (themeStore) => {
  if (!themeStore) {
    return lightTheme;
  }
  return themeStore.currentTheme || lightTheme;
};

export default lightTheme; // 默认导出浅色主题 