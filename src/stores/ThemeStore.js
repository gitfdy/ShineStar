import { makeAutoObservable, runInAction } from 'mobx';
import { getTheme, THEME_TYPES } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'app_theme';

class ThemeStore {
  currentThemeType = THEME_TYPES.LIGHT; // 默认使用浅色主题
  isLoaded = false; // 添加加载状态
  
  constructor() {
    makeAutoObservable(this);
    this.loadTheme();
  }

  // 获取当前主题
  get currentTheme() {
    return getTheme(this.currentThemeType);
  }

  // 是否为深色主题
  get isDarkTheme() {
    return this.currentThemeType === THEME_TYPES.DARK;
  }

  // 是否为浅色主题
  get isLightTheme() {
    return this.currentThemeType === THEME_TYPES.LIGHT;
  }

  // 获取状态栏样式
  get statusBarStyle() {
    return this.isDarkTheme ? 'light-content' : 'dark-content';
  }

  // 设置主题
  setTheme(themeType) {
    this.themeType = themeType;
    this.currentTheme = getTheme(themeType);
    this.statusBarStyle = themeType === THEME_TYPES.LIGHT ? 'dark-content' : 'light-content';
    // 通知观察者主题已更改
    this.notifyThemeChanged();
  }

  // 切换主题
  toggleTheme = async () => {
    const newTheme = this.isDarkTheme ? THEME_TYPES.LIGHT : THEME_TYPES.DARK;
    await this.setTheme(newTheme);
  };

  // 加载保存的主题偏好
  loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === THEME_TYPES.LIGHT || savedTheme === THEME_TYPES.DARK)) {
        runInAction(() => {
          this.currentThemeType = savedTheme;
          this.isLoaded = true;
        });
      } else {
        runInAction(() => {
          this.isLoaded = true;
        });
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      runInAction(() => {
        this.isLoaded = true;
      });
    }
  };
}

export default ThemeStore;