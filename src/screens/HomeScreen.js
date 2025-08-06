import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';
import BasePage from '../components/BasePage';
import { StatusBarStyles } from '../constants/StatusBarStyles';
import {lightTheme} from '../styles/theme';

const HomeScreen = observer(() => {
  const { userStore, themeStore } = useStore();

  return (
    <BasePage 
      barStyle={themeStore?.statusBarStyle || 'dark-content'}
      style={[styles.container, {backgroundColor: themeStore?.currentTheme?.colors?.neutral?.background || '#F2F2F7'}]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, {color: themeStore?.currentTheme?.colors?.neutral?.black || '#000000'}]}>欢迎回到 ShineStar</Text>
        <Text style={[styles.subtitle, {color: themeStore?.currentTheme?.colors?.neutral?.darkGray || '#1C1C1E'}]}>
          开始您的语音转录之旅
        </Text>
      </View>
    </BasePage>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: lightTheme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: lightTheme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen; 