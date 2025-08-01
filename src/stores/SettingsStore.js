import { makeAutoObservable } from 'mobx';

class SettingsStore {
  constructor() {
    this.isDarkMode = true; // 默认深色模式
    this.notificationsEnabled = true;
    this.autoSave = true;
    this.language = 'zh-CN';
    makeAutoObservable(this);
  }

  setDarkMode = (isDark) => {
    this.isDarkMode = isDark;
  };

  setNotificationsEnabled = (enabled) => {
    this.notificationsEnabled = enabled;
  };

  setAutoSave = (enabled) => {
    this.autoSave = enabled;
  };

  setLanguage = (lang) => {
    this.language = lang;
  };

  toggleDarkMode = () => {
    this.isDarkMode = !this.isDarkMode;
  };

  toggleNotifications = () => {
    this.notificationsEnabled = !this.notificationsEnabled;
  };

  toggleAutoSave = () => {
    this.autoSave = !this.autoSave;
  };
}

export default SettingsStore; 