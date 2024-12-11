// Background.js
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

export default function Background({ children }) {
  return (
    <ImageBackground
      source={require('../assets/background.jpg')} // Ensure this path matches where your background image is stored
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
  },
});
