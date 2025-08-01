import { makeAutoObservable } from 'mobx';
import BootSplash from 'react-native-bootsplash';
import DataStorage from '../utils/dataStorage';

class AppStore {
  isInitialized = false;
  isLoading = true;
  initializationError = null;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialized = (value) => {
    this.isInitialized = value;
  };

  setLoading = (value) => {
    this.isLoading = value;
  };

  setError = (error) => {
    this.initializationError = error;
  };

  // 应用初始化
  initializeApp = async () => {
    try {
      this.setLoading(true);
      this.setError(null);

      // 1. 初始化存储系统
      await DataStorage.createDirectories();

      // 2. 加载用户设置
      const settings = await DataStorage.getText(DataStorage.KEYS.SETTINGS);
      if (settings) {
        // 可以在这里应用设置
        console.log('Loaded settings:', settings);
      }

      // 3. 检查用户登录状态
      const userData = await DataStorage.getText(DataStorage.KEYS.USER_DATA);
      if (userData) {
        // 可以在这里恢复用户状态
        console.log('Loaded user data:', userData);
      }

      // 4. 模拟其他初始化任务
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.setInitialized(true);
      this.setLoading(false);

      // 5. 隐藏启动画面
      await BootSplash.hide({ fade: true });
      console.log('App initialization completed successfully');

    } catch (error) {
      console.error('App initialization failed:', error);
      this.setError(error.message);
      this.setLoading(false);
      
      // 即使出错也要隐藏启动画面
      await BootSplash.hide({ fade: true });
    }
  };

  // 检查启动画面是否可见
  checkSplashVisibility = async () => {
    try {
      const isVisible = await BootSplash.isVisible();
      console.log('Splash screen visibility:', isVisible);
      return isVisible;
    } catch (error) {
      console.error('Error checking splash visibility:', error);
      return false;
    }
  };

  // 重置应用状态
  resetApp = () => {
    this.isInitialized = false;
    this.isLoading = true;
    this.initializationError = null;
  };
}

export default AppStore; 