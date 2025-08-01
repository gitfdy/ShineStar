import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';

const InitializationScreen = observer(() => {
  const { appStore } = useStore();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ShineStar</Text>
        <Text style={styles.subtitle}>正在启动应用...</Text>
        
        <ActivityIndicator 
          size="large" 
          color="#007AFF" 
          style={styles.spinner}
        />
        
        <Text style={styles.statusText}>
          {appStore.isLoading ? '正在初始化...' : '初始化完成'}
        </Text>
        
        {appStore.initializationError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>初始化错误</Text>
            <Text style={styles.errorText}>
              {appStore.initializationError}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  spinner: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    maxWidth: 300,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});

export default InitializationScreen; 