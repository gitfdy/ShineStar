import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';
import ThemeToggle from '../components/ThemeToggle';

const SettingsScreen = () => {
  const { settingsStore, themeStore } = useStore();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: themeStore?.currentTheme?.colors?.neutral?.background || '#F2F2F7'}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: themeStore?.currentTheme?.colors?.neutral?.black || '#000000'}]}>设置</Text>
        
        {/* 主题切换 */}
        <ThemeToggle />

        <View style={[styles.settingItem, {backgroundColor: themeStore?.currentTheme?.colors?.neutral?.lightGray || '#E5E5EA'}]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, {color: themeStore?.currentTheme?.colors?.neutral?.black || '#000000'}]}>通知</Text>
            <Text style={[styles.settingDescription, {color: themeStore?.currentTheme?.colors?.neutral?.gray || '#8E8E93'}]}>接收推送通知</Text>
          </View>
          <Switch
            value={settingsStore.notificationsEnabled}
            onValueChange={settingsStore.setNotificationsEnabled}
            trackColor={{ false: themeStore?.currentTheme?.colors?.neutral?.lightGray || '#E5E5EA', true: themeStore?.currentTheme?.colors?.primary || '#007AFF' }}
            thumbColor={settingsStore.notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingItem, {backgroundColor: themeStore?.currentTheme?.colors?.neutral?.lightGray || '#E5E5EA'}]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, {color: themeStore?.currentTheme?.colors?.neutral?.black || '#000000'}]}>自动保存</Text>
            <Text style={[styles.settingDescription, {color: themeStore?.currentTheme?.colors?.neutral?.gray || '#8E8E93'}]}>自动保存数据</Text>
          </View>
          <Switch
            value={settingsStore.autoSave}
            onValueChange={settingsStore.setAutoSave}
            trackColor={{ false: themeStore?.currentTheme?.colors?.neutral?.lightGray || '#E5E5EA', true: themeStore?.currentTheme?.colors?.primary || '#007AFF' }}
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '500',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
  },
});

export default observer(SettingsScreen); 