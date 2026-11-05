import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface HowItWorksModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Como Funciona a Filtragem</Text>
              <Text style={styles.subtitle}>
                Metodologia matemática e critérios estatísticos aplicados
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
              onPress={onClose}
              accessibilityLabel="Fechar"
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>

          {/* Conteúdo com Scroll */}
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Introdução Combinatória */}
            <View style={styles.introBox}>
              <Text style={styles.introTitle}>Geração Combinatória</Text>
              <Text style={styles.introText}>
                A partir das 20 dezenas escolhidas no volante, o algoritmo calcula todas as 15.504 combinações possíveis de 15 números (C 20, 15). Cada combinação é então submetida aos 4 filtros estatísticos oficiais. Apenas as combinações aprovadas em todos os critérios simultaneamente são exibidas.
              </Text>
            </View>

            {/* Critério 1: Ímpares */}
            <View style={styles.filterCard}>
              <View style={styles.filterHeader}>
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Filtro 01</Text>
                </View>
                <Text style={styles.filterName}>Números Ímpares (7 a 8)</Text>
              </View>
              <Text style={styles.filterDescription}>
                Em mais de 60% dos sorteios históricos da Lotofácil, o resultado contém 7 ou 8 números ímpares (e consequentemente 8 ou 7 pares). Jogos fora dessa faixa têm probabilidade estatística consideravelmente menor de ocorrência.
              </Text>
            </View>

            {/* Critério 2: Soma Total */}
            <View style={styles.filterCard}>
              <View style={styles.filterHeader}>
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Filtro 02</Text>
                </View>
                <Text style={styles.filterName}>Soma Total das Dezenas (170 a 220)</Text>
              </View>
              <Text style={styles.filterDescription}>
                A soma dos 15 números sorteados concentra-se predominantemente entre 170 e 220 pontos. O algoritmo descarta combinações com somas extremas (muito baixas ou muito altas), focando no núcleo de maior frequência.
              </Text>
            </View>

            {/* Critério 3: Moldura */}
            <View style={styles.filterCard}>
              <View style={styles.filterHeader}>
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Filtro 03</Text>
                </View>
                <Text style={styles.filterName}>Dezenas na Moldura (9 a 11)</Text>
              </View>
              <Text style={styles.filterDescription}>
                A moldura compreende os 16 números que formam as bordas do volante (01 a 05, 06, 10, 11, 15, 16, 20 e 21 a 25). São aprovados apenas os jogos que contêm de 9 a 11 números pertencentes a essa área periférica.
              </Text>
            </View>

            {/* Critério 4: Primos */}
            <View style={styles.filterCard}>
              <View style={styles.filterHeader}>
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Filtro 04</Text>
                </View>
                <Text style={styles.filterName}>Números Primos (4 a 6)</Text>
              </View>
              <Text style={styles.filterDescription}>
                A Lotofácil possui 9 números primos (02, 03, 05, 07, 11, 13, 17, 19 e 23). O filtro aprova apenas combinações com 4 a 6 primos, garantindo equilíbrio na distribuição aritmética.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.understoodButton,
                pressed && styles.pressed,
              ]}
              onPress={onClose}
            >
              <Text style={styles.understoodButtonText}>Entendi</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 42, 71, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    maxWidth: 580,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#D2D4DA',
    shadowColor: '#1F2A47',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F6',
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 16,
    color: '#1F2A47',
  },
  subtitle: {
    fontFamily: 'BBCReithSans-Regular',
    fontSize: 12,
    color: '#4C556C',
    marginTop: 2,
    lineHeight: 16,
  },
  closeButton: {
    backgroundColor: '#F4F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D2D4DA',
  },
  closeButtonText: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 12,
    color: '#4C556C',
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  introBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 3,
    borderLeftColor: '#a8348c',
  },
  introTitle: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 13,
    color: '#1F2A47',
    marginBottom: 4,
  },
  introText: {
    fontFamily: 'BBCReithSans-Regular',
    fontSize: 12,
    color: '#4C556C',
    lineHeight: 18,
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  filterTag: {
    backgroundColor: '#FDF4FA',
    borderWidth: 1,
    borderColor: '#a8348c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  filterTagText: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 10,
    color: '#84206c',
  },
  filterName: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 13,
    color: '#1F2A47',
  },
  filterDescription: {
    fontFamily: 'BBCReithSans-Regular',
    fontSize: 12,
    color: '#4C556C',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F6',
    backgroundColor: '#FAFAFB',
    alignItems: 'flex-end',
  },
  understoodButton: {
    backgroundColor: '#334E68',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  understoodButtonText: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.8,
  },
});
