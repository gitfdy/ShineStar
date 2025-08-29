import {View, Text, StyleSheet, Modal} from 'react-native';
import {observer} from 'mobx-react-lite';

const RecordModal = observer(({visible, onClose}) => {
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.container}>
        <Text>RecordModal</Text>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default RecordModal;
