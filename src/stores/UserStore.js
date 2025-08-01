import { makeAutoObservable } from 'mobx';

class UserStore {
  constructor() {
    this.user = {
      userName: '',
    };
    this.isLoading = false;
    this.isAuthenticated = false;
    makeAutoObservable(this);
  }

  setUserName = (userName) => {
    this.user.userName = userName;
    this.isAuthenticated = !!userName;
  };

  setUser = (user) => {
    this.user = user;
    this.isAuthenticated = !!user.userName;
  };

  setLoading = (loading) => {
    this.isLoading = loading;
  };

  logout = () => {
    this.user = {
      userName: '',
    };
    this.isAuthenticated = false;
  };

  get userName() {
    return this.user.userName;
  }

  get userEmail() {
    return this.user.email;
  }

  get userAvatar() {
    return this.user.avatar;
  }
}

export default UserStore; 