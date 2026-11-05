import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { REQUIRED_SELECTION_COUNT } from '../utils/lotofacilUtils';

const buttonIconSource = require('../../assets/images/logo-lotofacil-icon.png');

interface ActionBarProps {
  selectedCount: number;
  hasGeneratedGames: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  selectedCount,
  hasGeneratedGames,
  isGenerating,
  onGenerate,
}) => {
  const isReady = selectedCount === REQUIRED_SELECTION_COUNT;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isCancelled = false;

    const runAnimation = () => {
      if (isCancelled || !isReady || isGenerating || hasGeneratedGames) return;
      pulseAnim.setValue(0);
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: Platform.OS !== 'web',
      }).start(({ finished }) => {
        if (finished && !isCancelled && isReady && !hasGeneratedGames && !isGenerating) {
          runAnimation();
        }
      });
    };

    if (isReady && !hasGeneratedGames && !isGenerating) {
      runAnimation();
    } else {
      pulseAnim.setValue(0);
    }

    return () => {
      isCancelled = true;
      pulseAnim.stopAnimation();
    };
  }, [isReady, hasGeneratedGames, isGenerating, pulseAnim]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.32],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.75, 0.3, 0],
  });

  return (
    <View style={styles.container}>
      {/* Botão de Ação Principal com Logo e Glow Pulsante */}
      {isReady ? (
        <View style={styles.readyWrapper}>
          {/* Anel de Glow Pulsante (visível enquanto não clicado/gerado) */}
          {!isGenerating && !hasGeneratedGames && (
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                },
              ]}
            />
          )}

          <Pressable
            style={({ pressed }) => [
              styles.circularButton,
              pressed && styles.circularButtonPressed,
            ]}
            onPress={onGenerate}
            disabled={isGenerating}
            accessibilityLabel="Gerar Jogos"
          >
            {isGenerating ? (
              <ActivityIndicator color="#a8348c" size="large" />
            ) : (
              <Image
                source={buttonIconSource}
                style={styles.circularLogo}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </View>
      ) : (
        <View style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>
            SELECIONE 20 DEZENAS ({selectedCount}/{REQUIRED_SELECTION_COUNT})
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 14,
    alignItems: 'center',
  },
  readyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 108,
    height: 108,
    position: 'relative',
    marginVertical: 4,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(168, 52, 140, 0.25)',
    borderWidth: 2.5,
    borderColor: '#a8348c',
  },
  circularButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#a8348c',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a8348c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2,
  },
  circularButtonPressed: {
    transform: [{ scale: 0.93 }],
    backgroundColor: '#FDF4FF',
  },
  circularLogo: {
    width: 52,
    height: 52,
  },
  disabledButton: {
    width: '100%',
    backgroundColor: '#F4F4F6',
    borderRadius: 4,
    height: 42,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D2D4DA',
  },
  disabledButtonText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#94A3B8',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
