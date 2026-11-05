import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(1800),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.toast}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    backgroundColor: '#1F2A47',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4C556C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  text: {
    fontFamily: 'BBCReithSans-Medium',
    color: '#FFFFFF',
    fontSize: 13,
  },
});
