import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import ChatbotModal from './ChatbotModal';

export default function ChatbotButton() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/images/Chat_bot.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ChatbotModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    zIndex: 999,
  },
  icon: {
    width: 220,
    height: 120,
  },
});
