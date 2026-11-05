import React from 'react';
import { Image, Platform, Pressable, StyleSheet, useWindowDimensions } from 'react-native';

const logoSource = require('../../assets/images/Logo_da_Lotofacil.png');
const LOGO_ASPECT_RATIO = 3500 / 706; // 4.9575

interface HeaderProps {
  onPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPress }) => {
  const { width: windowWidth } = useWindowDimensions();
  const containerWidth = Math.min(windowWidth, 680);
  const headerHeight = Math.round(containerWidth / LOGO_ASPECT_RATIO);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.header,
        { height: headerHeight },
        pressed && styles.pressed,
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Atualizar página da Lotofácil"
    >
      <Image
        source={logoSource}
        style={{ width: '100%', height: headerHeight }}
        resizeMode="contain"
        accessibilityLabel="Logo Lotofácil"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#D2D4DA',
    padding: 0,
    margin: 0,
  },
  pressed: {
    opacity: 0.85,
  },
});
