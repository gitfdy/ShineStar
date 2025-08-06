/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './src/stores/StoreProvider';
import AppNavigator from './src/navigation/AppNavigator';
import InitializationScreen from './src/screens/InitializationScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { observer } from 'mobx-react-lite';
import BasePage from './src/components/BasePage';
import { StatusBarStyles } from './src/constants/StatusBarStyles';
import './src/i18n/index.js';
import { initializeLanguage, useSystemLanguage } from './src/utils/languageUtils';

const AppContent = observer(() => {
  const { appStore, themeStore } = useStore();

  useEffect(() => {
    // 初始化语言设置
    initializeLanguage();
    // 初始化应用
    appStore.initializeApp();
  }, []);

  // 如果还在初始化中，显示初始化屏幕
  if (appStore.isLoading) {
    return <InitializationScreen />;
  }

  // 如果还没有完成引导页，显示引导页
  if (!appStore.hasCompletedOnboarding) {
    return <OnboardingScreen />;
  }

  // 显示主应用
  return (
    <BasePage barStyle={themeStore?.statusBarStyle || 'dark-content'}>
      <AppNavigator />
    </BasePage>
  );
});

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App; 