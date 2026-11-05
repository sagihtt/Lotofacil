import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatsBannerProps {
  totalCombinations: number;
  approvedCount: number;
  displayedCount: number;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  totalCombinations,
  approvedCount,
  displayedCount,
}) => {
  const numericRate =
    totalCombinations > 0 ? (approvedCount / totalCombinations) * 100 : 0;
  const approvalRate = numericRate.toFixed(1);

  return (
    <View style={styles.container}>
      {/* Cabeçalho alinhado com a hierarquia visual das seções */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.sectionTitle}>Resultado da Filtragem Estatística</Text>
          <Text style={styles.sectionSubtitle}>
            Aproveitamento matemático das 20 dezenas selecionadas
          </Text>
        </View>

        <View style={styles.rateBadge}>
          <Text style={styles.rateText}>{approvalRate}% Aprovados</Text>
        </View>
      </View>

      {/* Grid de Métricas em Blocos Claros e Legíveis */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Combinações Totais</Text>
          <Text style={styles.statValue}>
            {totalCombinations.toLocaleString('pt-BR')}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Aprovados</Text>
          <Text style={[styles.statValue, styles.highlightValue]}>
            {approvedCount.toLocaleString('pt-BR')}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Jogos em Exibição</Text>
          <Text style={[styles.statValue, styles.displayValue]}>
            {displayedCount}
          </Text>
        </View>
      </View>

      {/* Barra de Progresso Visual de Aproveitamento */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(numericRate, 100)}%` },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#D2D4DA',
    shadowColor: '#1F2A47',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 8,
  },
  titleWrapper: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 15,
    color: '#1F2A47',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontFamily: 'BBCReithSans-Regular',
    fontSize: 12,
    color: '#4C556C',
    marginTop: 2,
    lineHeight: 16,
  },
  rateBadge: {
    backgroundColor: '#FDF4FA',
    borderWidth: 1,
    borderColor: '#a8348c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rateText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#84206c',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontFamily: 'BBCReithSans-Medium',
    fontSize: 11,
    color: '#4C556C',
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 16,
    color: '#1F2A47',
  },
  highlightValue: {
    color: '#a8348c',
  },
  displayValue: {
    color: '#334E68',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E8E9EC',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#a8348c',
    borderRadius: 2,
  },
});
