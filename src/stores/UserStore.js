import { makeAutoObservable, action, runInAction } from 'mobx';
import DataStorage from '../utils/dataStorage';

class UserStore {
  constructor() {
    this.user = {
      userName: '',
    };
    this.isLoading = false;
    this.isAuthenticated = false;
    this.posts = [];
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

  loadPosts = action(async () => {
    const loadedPosts = await DataStorage.getPosts();
    runInAction(() => {
      this.posts = loadedPosts;
    });
  });

  addPost = action(async (postData) => {
    const newPost = await DataStorage.savePost(postData);
    if (newPost) {
      runInAction(() => {
        this.posts.push(newPost);
      });
    }
    return newPost;
  });

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