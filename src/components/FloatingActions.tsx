import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface FloatingActionsProps {
  visible: boolean;
  onCopyAll: () => void;
  onOpenExport: () => void;
  onOpenHowItWorks: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  visible,
  onCopyAll,
  onOpenExport,
  onOpenHowItWorks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Pulso contínuo enquanto o menu estiver fechado e visível
  useEffect(() => {
    let isCancelled = false;

    const runPulse = () => {
      if (isCancelled || !visible || isOpen) return;
      pulseAnim.setValue(0);
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: Platform.OS !== 'web',
      }).start(({ finished }) => {
        if (finished && !isCancelled && visible && !isOpen) {
          runPulse();
        }
      });
    };

    if (visible && !isOpen) {
      runPulse();
    } else {
      pulseAnim.setValue(0);
    }

    return () => {
      isCancelled = true;
      pulseAnim.stopAnimation();
    };
  }, [visible, isOpen, pulseAnim]);

  // Fecha o menu caso a visibilidade geral seja desativada
  useEffect(() => {
    if (!visible) {
      setIsOpen(false);
      anim.setValue(0);
    }
  }, [visible, anim]);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(anim, {
      toValue,
      friction: 6,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    setIsOpen(!isOpen);
  };

  const handleAction = (callback: () => void) => {
    toggleMenu();
    callback();
  };

  if (!visible) return null;

  const rotateMain = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const option1TranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const option2TranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const option3TranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 0],
  });

  const optionsOpacity = anim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0.3, 1],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.34],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 0.25, 0],
  });

  return (
    <>
      {/* Backdrop transparente para fechar ao clicar fora */}
      {isOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={toggleMenu}
          accessibilityLabel="Fechar menu de ações"
        />
      )}

      <View style={styles.fabContainer}>
        {/* Opção 3: Como Funciona a Filtragem */}
        <Animated.View
          style={[
            styles.optionRow,
            {
              opacity: optionsOpacity,
              transform: [{ translateY: option3TranslateY }],
            },
          ]}
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          <Pressable
            style={({ pressed }) => [
              styles.optionPill,
              pressed && styles.optionPressed,
            ]}
            onPress={() => handleAction(onOpenHowItWorks)}
          >
            <Text style={styles.optionLabel}>Como Funciona a Filtragem</Text>
            <View style={styles.optionIconCircle}>
              {/* Ícone de Informação (i) Vetorial */}
              <View style={styles.infoDot} />
              <View style={styles.infoStem} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Opção 2: Exportar TXT / CSV */}
        <Animated.View
          style={[
            styles.optionRow,
            {
              opacity: optionsOpacity,
              transform: [{ translateY: option2TranslateY }],
            },
          ]}
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          <Pressable
            style={({ pressed }) => [
              styles.optionPill,
              pressed && styles.optionPressed,
            ]}
            onPress={() => handleAction(onOpenExport)}
          >
            <Text style={styles.optionLabel}>Exportar TXT / CSV</Text>
            <View style={styles.optionIconCircle}>
              {/* Ícone de Download Vetorial */}
              <View style={styles.downloadArrowStem} />
              <View style={styles.downloadArrowHead} />
              <View style={styles.downloadTray} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Opção 1: Copiar Todos */}
        <Animated.View
          style={[
            styles.optionRow,
            {
              opacity: optionsOpacity,
              transform: [{ translateY: option1TranslateY }],
            },
          ]}
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          <Pressable
            style={({ pressed }) => [
              styles.optionPill,
              pressed && styles.optionPressed,
            ]}
            onPress={() => handleAction(onCopyAll)}
          >
            <Text style={styles.optionLabel}>Copiar Todos</Text>
            <View style={styles.optionIconCircle}>
              {/* Ícone de Cópia / Folhas Sobrepostas */}
              <View style={styles.copyBackSheet} />
              <View style={styles.copyFrontSheet} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Botão Principal do FAB com Glow Pulsante */}
        <View style={styles.mainFabWrapper}>
          {/* Anel de Pulso / Glow luminoso */}
          {!isOpen && (
            <Animated.View
              style={[
                styles.pulseHalo,
                {
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                },
              ]}
            />
          )}

          <Pressable
            style={({ pressed }) => [
              styles.mainFab,
              isOpen ? styles.mainFabOpen : styles.mainFabClosed,
              pressed && styles.fabPressed,
            ]}
            onPress={toggleMenu}
            accessibilityLabel="Ações rápidas de exportação e informações"
          >
            <Animated.View
              style={[
                styles.mainIconWrapper,
                { transform: [{ rotate: rotateMain }] },
              ]}
            >
              {/* Ícone '+' branco em alto contraste */}
              <View style={styles.plusH} />
              <View style={styles.plusV} />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(31, 42, 71, 0.2)',
    zIndex: 998,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 18,
    right: 16,
    alignItems: 'flex-end',
    gap: 8,
    zIndex: 999,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingLeft: 12,
    paddingRight: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D2D4DA',
    gap: 6,
    shadowColor: '#1F2A47',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
  },
  optionLabel: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 11,
    color: '#1F2A47',
    letterSpacing: 0.2,
  },
  optionIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334E68',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  optionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  // Ícone de Informação (i)
  infoDot: {
    width: 2.2,
    height: 2.2,
    borderRadius: 1.1,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 5,
  },
  infoStem: {
    width: 2,
    height: 7,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 9,
  },
  // Ícone de Download
  downloadArrowStem: {
    width: 1.5,
    height: 8,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 5,
  },
  downloadArrowHead: {
    width: 5,
    height: 5,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#FFFFFF',
    position: 'absolute',
    top: 8,
    transform: [{ rotate: '45deg' }],
  },
  downloadTray: {
    width: 10,
    height: 3,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#FFFFFF',
    position: 'absolute',
    bottom: 5,
    borderRadius: 1,
  },
  // Ícone de Cópia
  copyBackSheet: {
    width: 8,
    height: 10,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
    borderRadius: 1.5,
    position: 'absolute',
    top: 5,
    left: 6,
    opacity: 0.7,
  },
  copyFrontSheet: {
    width: 8,
    height: 10,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
    backgroundColor: '#334E68',
    borderRadius: 1.5,
    position: 'absolute',
    top: 8,
    left: 9,
  },
  // Botão FAB Principal e Halo Pulsante Compacto
  mainFabWrapper: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseHalo: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 78, 104, 0.25)',
    borderWidth: 1.5,
    borderColor: '#334E68',
  },
  mainFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#1F2A47',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 2,
  },
  mainFabClosed: {
    backgroundColor: '#334E68',
    borderColor: '#243B53',
  },
  mainFabOpen: {
    backgroundColor: '#1F2933',
    borderColor: '#121A21',
  },
  fabPressed: {
    transform: [{ scale: 0.92 }],
  },
  mainIconWrapper: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plusH: {
    width: 13,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    position: 'absolute',
  },
  plusV: {
    width: 2,
    height: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    position: 'absolute',
  },
});
