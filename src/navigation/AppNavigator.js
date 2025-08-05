import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StorageDemoScreen from '../screens/StorageDemoScreen';
import VoiceToTextScreen from '../screens/VoiceToTextScreen';
import IntegratedSpeechScreen from '../screens/IntegratedSpeechScreen';

// Import components
import CustomDrawerContent from '../components/CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#1a1a1a',
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#888',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: '首页',
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: '个人资料',
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: '设置',
        }}
      />
      <Drawer.Screen 
        name="StorageDemo" 
        component={StorageDemoScreen}
        options={{
          title: '数据存储演示',
        }}
      />
      <Drawer.Screen 
        name="VoiceToText" 
        component={VoiceToTextScreen}
        options={{
          title: '语音转文字',
        }}
      />
      <Drawer.Screen 
        name="IntegratedSpeech" 
        component={IntegratedSpeechScreen}
        options={{
          title: '集成语音识别',
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 