import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { QuantityOption } from '../types';

interface FilterControlsProps {
  quantity: QuantityOption;
  onQuantityChange: (qty: QuantityOption) => void;
}

const QUANTITY_OPTIONS: { label: string; value: QuantityOption }[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: 'Todos', value: 'all' },
];

export const FilterControls: React.FC<FilterControlsProps> = ({
  quantity,
  onQuantityChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quantidade de Jogos para Exibir</Text>
        <Text style={styles.sectionSubtitle}>
          Defina quantos jogos aprovados pelos critérios estatísticos deseja visualizar
        </Text>
      </View>

      <View style={styles.pillRow}>
        {QUANTITY_OPTIONS.map((opt) => {
          const isSelected = quantity === opt.value;
          return (
            <Pressable
              key={opt.label}
              style={[
                styles.pill,
                isSelected ? styles.pillSelected : styles.pillUnselected,
              ]}
              onPress={() => onQuantityChange(opt.value)}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
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
  sectionHeader: {
    marginBottom: 12,
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
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  pill: {
    flex: 1,
    height: 38,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillUnselected: {
    backgroundColor: '#F4F4F6',
    borderWidth: 1,
    borderColor: '#D2D4DA',
  },
  pillSelected: {
    backgroundColor: '#a8348c',
    borderWidth: 1,
    borderColor: '#84206c',
  },
  pillText: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 15,
    letterSpacing: 0.2,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: Platform.OS === 'web' ? 36 : 18,
  },
  pillTextUnselected: {
    color: '#4C556C',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
});
