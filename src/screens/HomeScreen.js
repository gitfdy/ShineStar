import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/StoreProvider';
import BasePage from '../components/BasePage';
import { StatusBarStyles } from '../constants/StatusBarStyles';
import theme from '../styles/theme';

const HomeScreen = observer(() => {
  const { userStore } = useStore();

  return (
    <BasePage 
      barStyle={StatusBarStyles.DARK_CONTENT}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>欢迎回到 ShineStar</Text>
        <Text style={styles.subtitle}>
          开始您的语音转录之旅
        </Text>
      </View>
    </BasePage>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.neutral.darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen; 