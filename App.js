/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { StoreProvider } from './src/stores/StoreProvider';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <StoreProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
      />
      <AppNavigator />
    </StoreProvider>
  );
}

export default App; 