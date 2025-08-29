import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Modal, TouchableOpacity} from 'react-native-ui-lib';
const WriteRecord = ({visible, onDismiss, onSubmit}) => {
  const [text, setText] = useState('');
  const onChangeText = text => {
    setText(text);
  };

  const onSubmitText = () => {
    onDismiss();
    onSubmit(text);
    setText('');
  };

  return (
    <Modal
      animationType="fade"
      visible={visible}
      overlayBackgroundColor="rgba(0, 0, 0, 0.5)"
      useKeyboardAvoidingView={true}
      onBackgroundPress={onDismiss}
      onDismiss={onDismiss}>
      <View
        style={{
          height: 500,
          width: '100%',
          borderRadius: 10,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 10,
            height: 50,
            backgroundColor: 'red',
          }}>
          <TouchableOpacity onPress={onDismiss}>
            <Text>取消</Text>
          </TouchableOpacity>
          <Text>輸入文本</Text>
          <TouchableOpacity onPress={onSubmitText}>
            <Text>完成</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Enter your text"
          style={{
            width: '100%',
            height: 450,
            textAlignVertical: 'top',
            textAlign: 'left',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            padding: 10,
          }}
          onChangeText={onChangeText}
          value={text}
          multiline={true}
          numberOfLines={4}
          // 讓輸入滿一行後自動換行，TextField（底層是TextInput）multiline屬性已自動換行
          // 若要防止橫向滾動，需加上scrollEnabled={false}
          scrollEnabled={false}
        />
      </View>
    </Modal>
  );
};

export default WriteRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
