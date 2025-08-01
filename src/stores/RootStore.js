import UserStore from './UserStore';
import SettingsStore from './SettingsStore';

class RootStore {
  constructor() {
    this.userStore = new UserStore();
    this.settingsStore = new SettingsStore();
  }
}

export default RootStore; 