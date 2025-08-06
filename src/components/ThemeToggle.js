import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';
import { THEME_TYPES } from '../styles/theme';

const ThemeToggle = observer(() => {
  const { themeStore } = useStore();

  const handleThemeToggle = (value) => {
    if (!themeStore) return;
    const newTheme = value ? THEME_TYPES.DARK : THEME_TYPES.LIGHT;
    themeStore.setTheme(newTheme);
  };

  // 如果 themeStore 还没有准备好，显示默认的浅色主题样式
  if (!themeStore) {
    return (
      <View style={[styles.container, { backgroundColor: '#E5E5EA' }]}>
        <View style={styles.info}>
          <Text style={[styles.label, { color: '#000000' }]}>
            深色模式
          </Text>
          <Text style={[styles.description, { color: '#8E8E93' }]}>
            正在加载主题设置...
          </Text>
        </View>
        <Switch
          value={false}
          onValueChange={() => {}}
          trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor={'#E5E5EA'}
          disabled={true}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeStore?.currentTheme?.colors?.neutral?.lightGray || '#E5E5EA' }]}>
      <View style={styles.info}>
        <Text style={[styles.label, { color: themeStore?.currentTheme?.colors?.neutral?.black || '#000000' }]}>
          深色模式
        </Text>
        <Text style={[styles.description, { color: themeStore?.currentTheme?.colors?.neutral?.gray || '#8E8E93' }]}>
          {themeStore?.isDarkTheme ? '当前使用深色主题' : '当前使用浅色主题'}
        </Text>
      </View>
      <Switch
        value={themeStore?.isDarkTheme || false}
        onValueChange={handleThemeToggle}
        trackColor={{ 
          false: themeStore?.currentTheme?.colors?.neutral?.lightGray || '#E5E5EA', 
          true: themeStore?.currentTheme?.colors?.primary || '#007AFF'
        }}
        thumbColor={themeStore?.isDarkTheme ? '#fff' : '#f4f3f4'}
        ios_backgroundColor={themeStore?.currentTheme?.colors?.neutral?.lightGray || '#E5E5EA'}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ThemeToggle;