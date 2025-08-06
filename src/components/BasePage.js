import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * BasePage 组件 - 提供基础页面结构和 StatusBar 配置
 * 
 * @param {Object} props
 * @param {string} props.barStyle - 状态栏样式: 'default' | 'light-content' | 'dark-content'
 * @param {string} props.backgroundColor - 状态栏背景色，默认为透明
 * @param {boolean} props.translucent - 是否启用透明状态栏，默认为 true
 * @param {Object} props.style - 容器样式
 * @param {React.ReactNode} props.children - 子组件
 * @param {boolean} props.useSafeArea - 是否使用 SafeAreaView，默认为 true
 */
const BasePage = ({
  barStyle = 'dark-content',
  backgroundColor = 'transparent',
  translucent = true,
  style,
  children,
  useSafeArea = true,
  ...props
}) => {
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={backgroundColor}
        translucent={translucent}
      />
      <Container style={[styles.container, style]} {...props}>
        {children}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BasePage; 