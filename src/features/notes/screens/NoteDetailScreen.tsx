import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useNotesStore } from '../../../app/store/useNotesStore';
import { theme } from '../../../shared/styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/AppNavigator';
import { generateSummary } from '../services/aiSummaryService';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetail'>;

export const NoteDetailScreen = ({ route }: Props) => {
  const { noteId } = route.params;
  const note = useNotesStore(state => state.notes.find(n => n.id === noteId));
  const updateNoteSummary = useNotesStore(state => state.updateNoteSummary);
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  if (!note) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Note not found</Text>
      </View>
    );
  }

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const summaryText = await generateSummary(note.transcript);
      await updateNoteSummary(note.id, summaryText);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const date = new Date(note.createdAt).toLocaleString();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.date}>{date}</Text>
      
      {note.summary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>AI Summary</Text>
          <Text style={styles.summary}>{note.summary}</Text>
        </View>
      )}

      <View style={styles.transcriptContainer}>
        <Text style={styles.transcriptTitle}>Transcript</Text>
        <Text style={styles.transcript}>{note.transcript}</Text>
      </View>
      
      {(!note.summary || isSummarizing) && (
        <TouchableOpacity 
          style={styles.summarizeButton} 
          onPress={handleSummarize}
          disabled={isSummarizing}
        >
          {isSummarizing ? (
            <ActivityIndicator color={theme.colors.background} />
          ) : (
            <Text style={styles.summarizeButtonText}>Generate AI Summary</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 18,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: theme.spacing.xl,
  },
  summaryContainer: {
    backgroundColor: theme.colors.primary + '20', // slight primary tint
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    marginBottom: theme.spacing.md,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  summaryTitle: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  summary: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  transcriptContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    minHeight: 150,
  },
  transcriptTitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  transcript: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  summarizeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  summarizeButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
