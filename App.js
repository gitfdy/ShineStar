/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { StoreProvider, useStore } from './src/stores/StoreProvider';
import AppNavigator from './src/navigation/AppNavigator';
import InitializationScreen from './src/screens/InitializationScreen';
import { observer } from 'mobx-react-lite';

const AppContent = observer(() => {
  const { appStore } = useStore();

  useEffect(() => {
    appStore.initializeApp();
  }, []);

  // 如果还在初始化中，显示初始化屏幕
  if (appStore.isLoading) {
    return <InitializationScreen />;
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
      />
      <AppNavigator />
    </>
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