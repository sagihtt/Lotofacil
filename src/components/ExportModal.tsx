import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GameResult } from '../types';
import { exportToCsv, exportToTxt } from '../utils/lotofacilUtils';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  games: GameResult[];
  chosenNumbers: number[];
  onCopyContent: (content: string, label: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onClose,
  games,
  chosenNumbers,
  onCopyContent,
}) => {
  const [format, setFormat] = useState<'txt' | 'csv'>('txt');

  const txtContent = React.useMemo(
    () => exportToTxt(games, chosenNumbers),
    [games, chosenNumbers]
  );
  const csvContent = React.useMemo(() => exportToCsv(games), [games]);

  const activeContent = format === 'txt' ? txtContent : csvContent;

  const handleCopy = () => {
    onCopyContent(activeContent, format.toUpperCase());
  };

  const handleDownloadWeb = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const mime = format === 'txt' ? 'text/plain' : 'text/csv';
      const ext = format === 'txt' ? 'txt' : 'csv';
      const blob = new Blob([activeContent], { type: `${mime};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lotofacil_jogos_${Date.now()}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      handleCopy();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Exportar Apostas</Text>
              <Text style={styles.subtitle}>{games.length} jogos gerados</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              onPress={onClose}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </Pressable>
          </View>

          {/* Format Tabs */}
          <View style={styles.tabsRow}>
            <Pressable
              style={[styles.tab, format === 'txt' && styles.tabActive]}
              onPress={() => setFormat('txt')}
            >
              <Text style={[styles.tabText, format === 'txt' && styles.tabTextActive]}>
                Formato TXT (Texto)
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tab, format === 'csv' && styles.tabActive]}
              onPress={() => setFormat('csv')}
            >
              <Text style={[styles.tabText, format === 'csv' && styles.tabTextActive]}>
                Formato CSV (Excel)
              </Text>
            </Pressable>
          </View>

          {/* Content Preview */}
          <View style={styles.previewContainer}>
            <ScrollView style={styles.previewScroll} nestedScrollEnabled>
              <Text style={styles.previewText}>{activeContent}</Text>
            </ScrollView>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                styles.copyBtn,
                pressed && styles.pressed,
              ]}
              onPress={handleCopy}
            >
              <Text style={styles.copyBtnText}>Copiar {format.toUpperCase()}</Text>
            </Pressable>

            {Platform.OS === 'web' && (
              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.downloadBtn,
                  pressed && styles.pressed,
                ]}
                onPress={handleDownloadWeb}
              >
                <Text style={styles.downloadBtnText}>Baixar Arquivo</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 42, 71, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D2D4DA',
    shadowColor: '#1F2A47',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F6',
  },
  title: {
    fontFamily: 'BBCReithSans-Bold',
    fontSize: 18,
    color: '#1F2A47',
  },
  subtitle: {
    fontFamily: 'BBCReithSans-Regular',
    fontSize: 12,
    color: '#4C556C',
    marginTop: 2,
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    backgroundColor: '#F4F4F6',
    borderWidth: 1,
    borderColor: '#D2D4DA',
  },
  closeText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#4C556C',
    fontSize: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F6',
    borderRadius: 4,
    padding: 3,
    marginBottom: 12,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 3,
  },
  tabActive: {
    backgroundColor: '#a8348c',
  },
  tabText: {
    fontFamily: 'BBCReithSans-Medium',
    fontSize: 12,
    color: '#4C556C',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  previewContainer: {
    backgroundColor: '#F4F4F6',
    borderRadius: 4,
    padding: 12,
    height: 240,
    borderWidth: 1,
    borderColor: '#D2D4DA',
    marginBottom: 14,
  },
  previewScroll: {
    flex: 1,
  },
  previewText: {
    color: '#1F2A47',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtn: {
    backgroundColor: '#005CA9',
  },
  copyBtnText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#FFFFFF',
    fontSize: 13,
  },
  downloadBtn: {
    backgroundColor: '#a8348c',
  },
  downloadBtnText: {
    fontFamily: 'BBCReithSans-Bold',
    color: '#FFFFFF',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.8,
  },
});
