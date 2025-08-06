import UserStore from './UserStore';
import SettingsStore from './SettingsStore';
import AppStore from './AppStore';
import ThemeStore from './ThemeStore';

class RootStore {
  constructor() {
    this.userStore = new UserStore();
    this.settingsStore = new SettingsStore();
    this.appStore = new AppStore();
    this.themeStore = new ThemeStore();
  }
}

export default RootStore; 