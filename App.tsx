import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useFonts } from 'expo-font';

import { ActionBar } from './src/components/ActionBar';
import { ExportModal } from './src/components/ExportModal';
import { FilterControls } from './src/components/FilterControls';
import { FloatingActions } from './src/components/FloatingActions';
import { GameCard } from './src/components/GameCard';
import { Header } from './src/components/Header';
import { HowItWorksModal } from './src/components/HowItWorksModal';
import { NumberGrid } from './src/components/NumberGrid';
import { StatsBanner } from './src/components/StatsBanner';
import { Toast } from './src/components/Toast';
import { FilterRules, GameResult, QuantityOption } from './src/types';
import {
  DEFAULT_FILTER_RULES,
  REQUIRED_SELECTION_COUNT,
  exportToTxt,
  formatBallNumber,
  generateFilteredGames,
  getRandomSelection,
} from './src/utils/lotofacilUtils';

export default function App() {
  const [fontsLoaded] = useFonts({
    'BBCReithSans-Regular': require('./assets/fonts/BBCReithSans_A_Rg.ttf'),
    'BBCReithSans-Medium': require('./assets/fonts/BBCReithSans_A_Md.ttf'),
    'BBCReithSans-Bold': require('./assets/fonts/BBCReithSans_A_Bd.ttf'),
    'BBCReithSans-ExtraBold': require('./assets/fonts/BBCReithSans_A_ExBd.ttf'),
  });

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [quantity, setQuantity] = useState<QuantityOption>(10);
  const [filters] = useState<FilterRules>(DEFAULT_FILTER_RULES);
  const [allApprovedGames, setAllApprovedGames] = useState<GameResult[]>([]);
  const [totalCombinations, setTotalCombinations] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
  const [howItWorksVisible, setHowItWorksVisible] = useState<boolean>(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Alterna a seleção de uma dezena
  const handleToggleNumber = useCallback((num: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        setAllApprovedGames([]);
        setTotalCombinations(0);
        return prev.filter((n) => n !== num);
      }
      if (prev.length >= REQUIRED_SELECTION_COUNT) {
        showToast('Limite de 20 dezenas atingido.');
        return prev;
      }
      setAllApprovedGames([]);
      setTotalCombinations(0);
      return [...prev, num].sort((a, b) => a - b);
    });
  }, [showToast]);

  // Limpa o volante e os jogos gerados
  const handleClear = useCallback(() => {
    setSelectedNumbers([]);
    setAllApprovedGames([]);
    setTotalCombinations(0);
    showToast('Volante limpo.');
  }, [showToast]);

  // Preenche ou completa com 20 dezenas aleatórias
  const handleRandomFill = useCallback(() => {
    const random = getRandomSelection(REQUIRED_SELECTION_COUNT);
    setSelectedNumbers(random);
    setAllApprovedGames([]);
    setTotalCombinations(0);
    showToast('20 dezenas selecionadas automaticamente.');
  }, [showToast]);

  // Gera os jogos filtrados a partir das 20 dezenas
  const handleGenerate = useCallback(() => {
    if (selectedNumbers.length !== REQUIRED_SELECTION_COUNT) {
      showToast(`Selecione exatamente ${REQUIRED_SELECTION_COUNT} dezenas.`);
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      try {
        const { approvedGames, totalCombinations: total } = generateFilteredGames(
          selectedNumbers,
          filters
        );

        setAllApprovedGames(approvedGames);
        setTotalCombinations(total);

        if (approvedGames.length > 0) {
          showToast(`${approvedGames.length} apostas geradas e aprovadas.`);
        } else {
          showToast('Nenhum jogo atendeu a todos os critérios estatísticos.');
        }
      } catch (error) {
        console.error('Erro ao gerar jogos:', error);
        showToast('Ocorreu um erro ao calcular os jogos.');
      } finally {
        setIsGenerating(false);
      }
    }, 50);
  }, [selectedNumbers, filters, showToast]);

  // Copia um único jogo
  const handleCopySingleGame = useCallback(
    async (game: GameResult) => {
      const formatted = game.numbers.map(formatBallNumber).join(' ');
      try {
        await Clipboard.setStringAsync(formatted);
        showToast(`Aposta #${String(game.index).padStart(2, '0')} copiada.`);
      } catch (e) {
        console.error('Clipboard error:', e);
      }
    },
    [showToast]
  );

  // Copia todos os jogos exibidos
  const handleCopyAll = useCallback(async () => {
    if (allApprovedGames.length === 0) return;
    const displayedGames =
      quantity === 'all' ? allApprovedGames : allApprovedGames.slice(0, quantity);
    const content = exportToTxt(displayedGames, selectedNumbers);
    try {
      await Clipboard.setStringAsync(content);
      showToast(`${displayedGames.length} jogos copiados para a área de transferência.`);
    } catch (e) {
      console.error('Clipboard error:', e);
    }
  }, [allApprovedGames, quantity, selectedNumbers, showToast]);

  // Copia conteúdo da modal de exportação
  const handleCopyExportContent = useCallback(
    async (content: string, label: string) => {
      try {
        await Clipboard.setStringAsync(content);
        showToast(`Conteúdo ${label} copiado.`);
      } catch (e) {
        console.error('Clipboard error:', e);
      }
    },
    [showToast]
  );

  // Jogos a serem exibidos de acordo com o seletor de quantidade
  const displayedGames = useMemo(() => {
    if (allApprovedGames.length === 0) return [];
    if (quantity === 'all') return allApprovedGames;
    return allApprovedGames.slice(0, quantity);
  }, [allApprovedGames, quantity]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#a8348c" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.webWrapper}>
        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header />

          {/* Volante de Seleção */}
          <NumberGrid
            selectedNumbers={selectedNumbers}
            onToggleNumber={handleToggleNumber}
            onClear={handleClear}
            onRandomFill={handleRandomFill}
          />

          {/* Seletor de Quantidade */}
          <FilterControls
            quantity={quantity}
            onQuantityChange={setQuantity}
          />

          {/* Barra de Ações Principais */}
          <ActionBar
            selectedCount={selectedNumbers.length}
            hasGeneratedGames={allApprovedGames.length > 0}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
          />

          {/* Banner de Estatísticas da Otimização */}
          {allApprovedGames.length > 0 && (
            <StatsBanner
              totalCombinations={totalCombinations}
              approvedCount={allApprovedGames.length}
              displayedCount={displayedGames.length}
            />
          )}

          {/* Lista de Jogos Gerados */}
          <View style={styles.gamesSection}>
            {isGenerating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#a8348c" />
                <Text style={styles.loadingText}>
                  Processando combinações e aplicando filtros estatísticos...
                </Text>
              </View>
            ) : allApprovedGames.length > 0 ? (
              <View style={styles.gamesListContainer}>
                <View style={styles.gamesListHeader}>
                  <Text style={styles.gamesListTitle}>
                    Apostas Geradas ({displayedGames.length} de {allApprovedGames.length})
                  </Text>
                </View>

                {displayedGames.map((game, idx) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    displayIndex={idx + 1}
                    onCopyGame={handleCopySingleGame}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateTitle}>Nenhuma aposta gerada</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Selecione 20 dezenas no volante acima e clique no botão circular para gerar as apostas.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Menu Flutuante FAB para Copiar, Exportar e Como Funciona */}
        <FloatingActions
          visible={allApprovedGames.length > 0}
          onCopyAll={handleCopyAll}
          onOpenExport={() => setExportModalVisible(true)}
          onOpenHowItWorks={() => setHowItWorksVisible(true)}
        />
      </View>

      {/* Modal de Explicação da Filtragem Estatística */}
      <HowItWorksModal
        visible={howItWorksVisible}
        onClose={() => setHowItWorksVisible(false)}
      />

      {/* Modal de Exportação TXT/CSV */}
      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        games={displayedGames}
        chosenNumbers={selectedNumbers}
        onCopyContent={handleCopyExportContent}
      />

      {/* Notificação Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webWrapper: {
    flex: 1,
    backgroundColor: '#F4F4F6',
    alignSelf: 'center',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 680 : undefined,
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#D2D4DA',
    position: 'relative',
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  gamesSection: {
    marginTop: 16,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'BBCReithSans-Medium',
    color: '#4C556C',
    fontSize: 14,
  },
  gamesListContainer: {
    marginTop: 6,
  },
  gamesListHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  gamesListTitle: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 16,
    color: '#1F2A47',
  },
  emptyStateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D2D4DA',
    marginTop: 10,
  },
  emptyStateTitle: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 15,
    color: '#1F2A47',
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontFamily: 'BBCReithSans-Regular',
    fontSize: 12,
    color: '#4C556C',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 40,
  },
});
