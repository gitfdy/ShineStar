import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {observer} from 'mobx-react-lite';
import {ActionSheet} from 'react-native-ui-lib';
import BasePage from '../components/BasePage';
import {lightTheme} from '../styles/theme';
import {useTheme} from '../utils/themeUtils';
import WriteRecord from '../components/WriteRecord';
import DataStorage from '../utils/dataStorage';
import { useStore } from '../stores/StoreProvider';
const HomeScreen = observer(() => {
  const theme = useTheme();
  const { userStore } = useStore();
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
  const [isWriteRecordModalVisible, setIsWriteRecordModalVisible] =
    useState(false);
  const showRecordModal = () => {
    setIsRecordModalVisible(true);
  };

  const saveRecord = async (text) => {
    await userStore.addPost({
      title: 'text',
      content: text,
    });
  };

  useEffect(() => {
    userStore.loadPosts();
  }, [userStore]);

  return (
    <BasePage
      barStyle={theme.statusBarStyle || 'dark-content'}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.neutral.background || '#F2F2F7',
        },
      ]}>
      <FlatList
        data={userStore.posts}
        renderItem={({item}) => <Text>{item.content}</Text>}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={[
          styles.recordButton,
          {
            backgroundColor: theme.getColor('primary'),
          },
        ]}
        onPress={() => showRecordModal()}>
        <Text style={styles.buttonText}>Shine Start</Text>
      </TouchableOpacity>
      <ActionSheet
        title={'Title'}
        message={'Message goes here'}
        destructiveButtonIndex={0}
        showCancelButton
        contentContainerStyle={{
          backgroundColor: 'blue',
        }}
        containerStyle={{
          borderRadius: 10,
        }}
        visible={isRecordModalVisible}
        options={[
          {label: '录制音频', onPress: () => {}},
          {label: '上传音频文件', onPress: () => {}},
          {
            label: '输入文本',
            onPress: () => {
              setIsRecordModalVisible(false);
              setIsWriteRecordModalVisible(true);
            },
          },
        ]}
        onDismiss={() => setIsRecordModalVisible(false)}
      />
      <WriteRecord
        visible={isWriteRecordModalVisible}
        onDismiss={() => setIsWriteRecordModalVisible(false)}
        onSubmit={saveRecord}
      />
    </BasePage>
  );
});

const styles = StyleSheet.create({
  recordButton: {
    width: '90%',
    height: 60,
    backgroundColor: 'red',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    right: '5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
