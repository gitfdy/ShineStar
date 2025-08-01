import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';

const SettingsScreen = () => {
  const { settingsStore } = useStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>设置</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>深色模式</Text>
            <Text style={styles.settingDescription}>始终使用深色主题</Text>
          </View>
          <Switch
            value={settingsStore.isDarkMode}
            onValueChange={settingsStore.setDarkMode}
            trackColor={{ false: '#333', true: '#007AFF' }}
            thumbColor={settingsStore.isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>通知</Text>
            <Text style={styles.settingDescription}>接收推送通知</Text>
          </View>
          <Switch
            value={settingsStore.notificationsEnabled}
            onValueChange={settingsStore.setNotificationsEnabled}
            trackColor={{ false: '#333', true: '#007AFF' }}
            thumbColor={settingsStore.notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>自动保存</Text>
            <Text style={styles.settingDescription}>自动保存数据</Text>
          </View>
          <Switch
            value={settingsStore.autoSave}
            onValueChange={settingsStore.setAutoSave}
            trackColor={{ false: '#333', true: '#007AFF' }}
            thumbColor={settingsStore.autoSave ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
  },
});

export default observer(SettingsScreen); 