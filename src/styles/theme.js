// ShineStar 设计系统
export const theme = {
  // 颜色系统
  colors: {
    primary: '#007AFF',      // 科技蓝 - 主要操作
    secondary: '#FF9500',    // 活力橙 - 次要操作
    success: '#34C759',      // 成功绿 - 成功状态
    error: '#FF3B30',        // 错误红 - 错误状态
    
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
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20
    },
    small: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16
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

export default theme; 