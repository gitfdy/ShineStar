import UserStore from './UserStore';
import SettingsStore from './SettingsStore';
import AppStore from './AppStore';

class RootStore {
  constructor() {
    this.userStore = new UserStore();
    this.settingsStore = new SettingsStore();
    this.appStore = new AppStore();
  }
}

export default RootStore; 