import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GameResult } from '../types';
import {
  FRAME_NUMBERS,
  PRIME_NUMBERS,
  formatBallNumber,
} from '../utils/lotofacilUtils';

interface GameCardProps {
  game: GameResult;
  displayIndex: number;
  onCopyGame: (game: GameResult) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  displayIndex,
  onCopyGame,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyGame(game);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeIndexContainer}>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>Aposta #{String(displayIndex).padStart(2, '0')}</Text>
          </View>
          <Text style={styles.gameIdText}>15 Dezenas</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.copyButton,
            copied ? styles.copyButtonActive : null,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCopy}
        >
          <Text style={[styles.copyButtonText, copied ? styles.copyButtonTextActive : null]}>
            {copied ? 'Copiado' : 'Copiar'}
          </Text>
        </Pressable>
      </View>

      {/* 15 Balls Grid */}
      <View style={styles.ballsContainer}>
        {game.numbers.map((num) => {
          const isFrame = FRAME_NUMBERS.has(num);
          const isPrime = PRIME_NUMBERS.has(num);

          return (
            <View key={num} style={styles.ballWrapper}>
              <View style={styles.ball}>
                <Text style={styles.ballNumber}>{formatBallNumber(num)}</Text>
              </View>
              <View style={styles.microBadgesRow}>
                {isFrame && <View style={styles.microDotFrame} />}
                {isPrime && <View style={styles.microDotPrime} />}
              </View>
            </View>
          );
        })}
      </View>

      {/* Metrics Indicators Bar */}
      <View style={styles.metricsBar}>
        <View style={styles.metricBadge}>
          <Text style={styles.metricLabel}>Soma</Text>
          <Text style={styles.metricValue}>{game.metrics.sum}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricBadge}>
          <Text style={styles.metricLabel}>Ímpares</Text>
          <Text style={styles.metricValue}>{game.metrics.oddCount}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricBadge}>
          <Text style={styles.metricLabel}>Moldura</Text>
          <Text style={styles.metricValue}>{game.metrics.frameCount}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricBadge}>
          <Text style={styles.metricLabel}>Primos</Text>
          <Text style={styles.metricValue}>{game.metrics.primeCount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
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
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9EC',
  },
  badgeIndexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indexBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  indexText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#1F2A47',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  gameIdText: {
    fontFamily: 'BBCReithSans-Medium',
    color: '#4C556C',
    fontSize: 12,
  },
  copyButton: {
    backgroundColor: '#F4F4F6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#D2D4DA',
  },
  copyButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#059669',
  },
  copyButtonText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#a8348c',
    fontSize: 12,
  },
  copyButtonTextActive: {
    color: '#059669',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  ballsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
    paddingVertical: 4,
  },
  ballWrapper: {
    width: '18%',
    alignItems: 'center',
    marginBottom: 4,
  },
  ball: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#a8348c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#84206c',
    shadowColor: '#a8348c',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  ballNumber: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#FFFFFF',
    fontSize: 15,
  },
  microBadgesRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 3,
    height: 5,
  },
  microDotFrame: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4C556C',
  },
  microDotPrime: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF6000',
  },
  metricsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E8E9EC',
  },
  metricBadge: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 10,
    color: '#4C556C',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metricValue: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 13,
    color: '#1F2A47',
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#D2D4DA',
  },
});
