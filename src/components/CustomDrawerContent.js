import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';

const CustomDrawerContent = (props) => {
  const { userStore } = useStore();

  // Safety check to ensure navigation state exists
  if (!props.state || !props.state.routes) {
    return (
      <SafeAreaView style={styles.container}>
        <DrawerContentScrollView>
          <View style={styles.userSection}>
            <Text style={styles.userName}>Loading...</Text>
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.userSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {userStore.userName ? userStore.userName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {userStore.userName || '未登录用户'}
          </Text>
          <Text style={styles.userEmail}>
            {userStore.userEmail || '点击登录'}
          </Text>
        </View>

        <View style={styles.divider} />

        <DrawerItemList {...props} />

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            userStore.logout();
            props.navigation.closeDrawer();
          }}
        >
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  userSection: {
    padding: 20,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 10,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default observer(CustomDrawerContent); 