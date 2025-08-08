import { getCurrentThemeConfig } from '../styles/theme';

// 获取当前主题的工具函数
export const getCurrentTheme = (themeStore) => {
  return getCurrentThemeConfig(themeStore);
};

// 获取主题颜色的工具函数
export const getThemeColor = (themeStore, colorPath, fallback = '#000000') => {
  const theme = getCurrentTheme(themeStore);
  const colorKeys = colorPath.split('.');
  let color = theme?.colors;
  
  for (const key of colorKeys) {
    color = color?.[key];
    if (!color) break;
  }
  
  return color || fallback;
};

// 获取主题间距的工具函数
export const getThemeSpacing = (themeStore, spacingKey, fallback = 0) => {
  const theme = getCurrentTheme(themeStore);
  return theme?.spacing?.[spacingKey] || fallback;
};

// 获取主题字体的工具函数
export const getThemeTypography = (themeStore, typographyKey) => {
  const theme = getCurrentTheme(themeStore);
  return theme?.typography?.[typographyKey] || {};
};

// 获取主题圆角的工具函数
export const getThemeBorderRadius = (themeStore, borderRadiusKey, fallback = 0) => {
  const theme = getCurrentTheme(themeStore);
  return theme?.borderRadius?.[borderRadiusKey] || fallback;
};
