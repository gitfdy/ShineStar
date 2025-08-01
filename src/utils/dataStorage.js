import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

class DataStorage {
  // 存储键名常量
  static KEYS = {
    USER_DATA: 'user_data',
    SETTINGS: 'app_settings',
    POSTS: 'user_posts',
    IMAGES: 'user_images',
    AUDIO: 'user_audio',
  };

  // 创建目录结构
  static async createDirectories() {
    const directories = [
      `${RNFS.DocumentDirectoryPath}/images`,
      `${RNFS.DocumentDirectoryPath}/audio`,
      `${RNFS.DocumentDirectoryPath}/documents`,
    ];

    for (const dir of directories) {
      const exists = await RNFS.exists(dir);
      if (!exists) {
        await RNFS.mkdir(dir);
      }
    }
  }

  // 存储文字数据
  static async saveText(key, text) {
    try {
      await AsyncStorage.setItem(key, text);
      return true;
    } catch (error) {
      console.error('保存文字数据失败:', error);
      return false;
    }
  }

  // 获取文字数据
  static async getText(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('获取文字数据失败:', error);
      return null;
    }
  }

  // 存储图片
  static async saveImage(imageUri, fileName) {
    try {
      await this.createDirectories();
      const destPath = `${RNFS.DocumentDirectoryPath}/images/${fileName}`;
      await RNFS.copyFile(imageUri, destPath);
      return destPath;
    } catch (error) {
      console.error('保存图片失败:', error);
      return null;
    }
  }

  // 存储录音
  static async saveAudio(audioUri, fileName) {
    try {
      await this.createDirectories();
      const destPath = `${RNFS.DocumentDirectoryPath}/audio/${fileName}`;
      await RNFS.copyFile(audioUri, destPath);
      return destPath;
    } catch (error) {
      console.error('保存录音失败:', error);
      return null;
    }
  }

  // 存储复杂数据（包含文字、图片、录音）
  static async savePost(postData) {
    try {
      const { title, content, imageUri, audioUri } = postData;
      let imagePath = null;
      let audioPath = null;

      // 保存图片
      if (imageUri) {
        const imageFileName = `image_${Date.now()}.jpg`;
        imagePath = await this.saveImage(imageUri, imageFileName);
      }

      // 保存录音
      if (audioUri) {
        const audioFileName = `audio_${Date.now()}.m4a`;
        audioPath = await this.saveAudio(audioUri, audioFileName);
      }

      // 保存数据到 AsyncStorage
      const post = {
        id: Date.now(),
        title,
        content,
        imagePath,
        audioPath,
        createdAt: new Date().toISOString(),
      };

      const existingPosts = await this.getPosts();
      existingPosts.push(post);
      await AsyncStorage.setItem(this.KEYS.POSTS, JSON.stringify(existingPosts));

      return post;
    } catch (error) {
      console.error('保存帖子失败:', error);
      return null;
    }
  }

  // 获取所有帖子
  static async getPosts() {
    try {
      const posts = await AsyncStorage.getItem(this.KEYS.POSTS);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('获取帖子失败:', error);
      return [];
    }
  }

  // 删除文件
  static async deleteFile(filePath) {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        await RNFS.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除文件失败:', error);
      return false;
    }
  }

  // 获取存储空间信息
  static async getStorageInfo() {
    try {
      const totalSpace = await RNFS.getFSInfo();
      const documentsPath = RNFS.DocumentDirectoryPath;
      const documentsSize = await RNFS.getFSInfo(documentsPath);
      
      return {
        totalSpace: totalSpace.freeSpace,
        usedSpace: documentsSize.freeSpace,
        documentsPath,
      };
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return null;
    }
  }

  // 清理缓存
  static async clearCache() {
    try {
      const directories = [
        `${RNFS.DocumentDirectoryPath}/images`,
        `${RNFS.DocumentDirectoryPath}/audio`,
      ];

      for (const dir of directories) {
        const exists = await RNFS.exists(dir);
        if (exists) {
          const files = await RNFS.readDir(dir);
          for (const file of files) {
            await RNFS.unlink(file.path);
          }
        }
      }

      return true;
    } catch (error) {
      console.error('清理缓存失败:', error);
      return false;
    }
  }
}

export default DataStorage; 