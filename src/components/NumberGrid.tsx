import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  FRAME_NUMBERS,
  PRIME_NUMBERS,
  REQUIRED_SELECTION_COUNT,
  TOTAL_LOTOFACIL_NUMBERS,
  formatBallNumber,
} from '../utils/lotofacilUtils';

interface NumberGridProps {
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  onClear: () => void;
  onRandomFill: () => void;
}

export const NumberGrid: React.FC<NumberGridProps> = ({
  selectedNumbers,
  onToggleNumber,
  onClear,
  onRandomFill,
}) => {
  const selectedSet = React.useMemo(() => new Set(selectedNumbers), [selectedNumbers]);
  const count = selectedNumbers.length;
  const isComplete = count === REQUIRED_SELECTION_COUNT;
  const progressPercent = Math.min(100, Math.round((count / REQUIRED_SELECTION_COUNT) * 100));

  const numbers = React.useMemo(() => {
    return Array.from({ length: TOTAL_LOTOFACIL_NUMBERS }, (_, i) => i + 1);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top bar with count & progress */}
      <View style={styles.counterRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.sectionTitle}>Volante de Dezenas</Text>
          <Text style={styles.sectionSubtitle}>
            {isComplete
              ? '20 dezenas marcadas. Pronto para gerar as apostas.'
              : `Marque mais ${REQUIRED_SELECTION_COUNT - count} ${
                  REQUIRED_SELECTION_COUNT - count === 1 ? 'dezena' : 'dezenas'
                }`}
          </Text>
        </View>

        <View style={[styles.counterBadge, isComplete ? styles.counterBadgeComplete : null]}>
          <Text style={[styles.counterText, isComplete ? styles.counterTextComplete : null]}>
            {count} / {REQUIRED_SELECTION_COUNT}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressPercent}%` },
            isComplete ? styles.progressBarFillComplete : null,
          ]}
        />
      </View>

      {/* 5x5 Grid */}
      <View style={styles.gridContainer}>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.gridRow}>
            {numbers.slice(rowIndex * 5, rowIndex * 5 + 5).map((num) => {
              const isSelected = selectedSet.has(num);
              const isFrame = FRAME_NUMBERS.has(num);
              const isPrime = PRIME_NUMBERS.has(num);

              return (
                <Pressable
                  key={num}
                  style={({ pressed }) => [
                    styles.ballButton,
                    isSelected ? styles.ballSelected : styles.ballUnselected,
                    pressed && styles.ballPressed,
                  ]}
                  onPress={() => onToggleNumber(num)}
                >
                  <Text
                    style={[
                      styles.ballText,
                      isSelected ? styles.ballTextSelected : styles.ballTextUnselected,
                    ]}
                  >
                    {formatBallNumber(num)}
                  </Text>

                  {/* Micro tags */}
                  <View style={styles.tagIndicatorContainer}>
                    {isFrame && (
                      <View
                        style={[
                          styles.dotIndicator,
                          isSelected ? styles.dotFrameSelected : styles.dotFrameUnselected,
                        ]}
                      />
                    )}
                    {isPrime && (
                      <View
                        style={[
                          styles.dotIndicator,
                          isSelected ? styles.dotPrimeSelected : styles.dotPrimeUnselected,
                        ]}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Quick Action Tools */}
      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onRandomFill}
        >
          <Text style={styles.secondaryButtonText}>
            {count === 0 ? 'SURPRESINHA' : 'COMPLETAR'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.outlineButton,
            count === 0 && styles.disabledButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onClear}
          disabled={count === 0}
        >
          <Text
            style={[
              styles.outlineButtonText,
              count === 0 && styles.disabledButtonText,
            ]}
          >
            LIMPAR
          </Text>
        </Pressable>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dotLegend, styles.dotFrameLegend]} />
          <Text style={styles.legendText}>Moldura (borda)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dotLegend, styles.dotPrimeLegend]} />
          <Text style={styles.legendText}>Número Primo</Text>
        </View>
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
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D2D4DA',
    shadowColor: '#1F2A47',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleWrapper: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 16,
    color: '#1F2A47',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontFamily: 'BBCReithSans-Regular',
    fontSize: 12,
    color: '#4C556C',
    marginTop: 2,
  },
  counterBadge: {
    backgroundColor: '#F4F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D2D4DA',
  },
  counterBadgeComplete: {
    backgroundColor: '#a8348c',
    borderColor: '#84206c',
  },
  counterText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#1F2A47',
    fontSize: 13,
  },
  counterTextComplete: {
    color: '#FFFFFF',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E8E9EC',
    borderRadius: 2,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#a8348c',
    borderRadius: 2,
  },
  progressBarFillComplete: {
    backgroundColor: '#a8348c',
  },
  gridContainer: {
    gap: 8,
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  ballButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ballUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D2D4DA',
  },
  ballSelected: {
    backgroundColor: '#a8348c',
    borderWidth: 2,
    borderColor: '#84206c',
    shadowColor: '#a8348c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  ballPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
  ballText: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 16,
  },
  ballTextUnselected: {
    color: '#1F2A47',
  },
  ballTextSelected: {
    color: '#FFFFFF',
  },
  tagIndicatorContainer: {
    position: 'absolute',
    bottom: 3,
    flexDirection: 'row',
    gap: 4,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotLegend: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotFrameUnselected: {
    backgroundColor: '#4C556C',
  },
  dotFrameSelected: {
    backgroundColor: '#E2E8F0',
  },
  dotPrimeUnselected: {
    backgroundColor: '#FF6000',
  },
  dotPrimeSelected: {
    backgroundColor: '#FED7AA',
  },
  dotFrameLegend: {
    backgroundColor: '#4C556C',
  },
  dotPrimeLegend: {
    backgroundColor: '#FF6000',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#a8348c',
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#84206c',
  },
  secondaryButtonText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  outlineButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D2D4DA',
  },
  outlineButtonText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#4C556C',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  disabledButton: {
    backgroundColor: '#F4F4F6',
    borderColor: '#E8E9EC',
    opacity: 0.6,
  },
  disabledButtonText: {
    color: '#A5AAB5',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    fontFamily: 'BBCReithSans-Medium',
    fontSize: 12,
    color: '#1F2A47',
  },
});
