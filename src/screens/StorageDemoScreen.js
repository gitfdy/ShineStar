import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';
import DataStorage from '../utils/dataStorage';

const StorageDemoScreen = () => {
  const { userStore } = useStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    loadPosts();
    loadStorageInfo();
  }, []);

  const loadPosts = async () => {
    const savedPosts = await DataStorage.getPosts();
    setPosts(savedPosts);
  };

  const loadStorageInfo = async () => {
    const info = await DataStorage.getStorageInfo();
    setStorageInfo(info);
  };

  const handleSavePost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('提示', '请填写标题和内容');
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      imageUri: null, // 可以添加图片选择功能
      audioUri: null, // 可以添加录音功能
    };

    const savedPost = await DataStorage.savePost(postData);
    if (savedPost) {
      Alert.alert('成功', '帖子保存成功！');
      setTitle('');
      setContent('');
      loadPosts();
      loadStorageInfo();
    } else {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      '确认清理',
      '这将删除所有保存的图片和录音文件，确定要继续吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            const success = await DataStorage.clearCache();
            if (success) {
              Alert.alert('成功', '缓存清理完成');
              loadStorageInfo();
            } else {
              Alert.alert('错误', '清理失败');
            }
          },
        },
      ]
    );
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>数据存储演示</Text>

        {/* 存储信息 */}
        {storageInfo && (
          <View style={styles.storageInfo}>
            <Text style={styles.sectionTitle}>存储信息</Text>
            <Text style={styles.infoText}>
              可用空间: {formatBytes(storageInfo.totalSpace)}
            </Text>
            <Text style={styles.infoText}>
              文档路径: {storageInfo.documentsPath}
            </Text>
          </View>
        )}

        {/* 输入表单 */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>创建新帖子</Text>
          <TextInput
            style={styles.input}
            placeholder="输入标题"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.textArea}
            placeholder="输入内容"
            placeholderTextColor="#888"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSavePost}>
            <Text style={styles.buttonText}>保存帖子</Text>
          </TouchableOpacity>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={loadPosts}>
            <Text style={styles.buttonText}>刷新列表</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCache}>
            <Text style={styles.buttonText}>清理缓存</Text>
          </TouchableOpacity>
        </View>

        {/* 帖子列表 */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>已保存的帖子 ({posts.length})</Text>
          {posts.map((post, index) => (
            <View key={post.id} style={styles.postItem}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{post.content}</Text>
              <Text style={styles.postDate}>
                {new Date(post.createdAt).toLocaleString()}
              </Text>
              {post.imagePath && (
                <Text style={styles.postFile}>📷 包含图片</Text>
              )}
              {post.audioPath && (
                <Text style={styles.postFile}>🎵 包含录音</Text>
              )}
            </View>
          ))}
          {posts.length === 0 && (
            <Text style={styles.emptyText}>暂无保存的帖子</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  storageInfo: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  inputSection: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  postsSection: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
  },
  postItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  postDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  postFile: {
    fontSize: 12,
    color: '#007AFF',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default observer(StorageDemoScreen); 