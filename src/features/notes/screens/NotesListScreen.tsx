import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, Modal, Text, TouchableOpacity } from 'react-native';
import { useNotesStore } from '../../../app/store/useNotesStore';
import { NoteItem } from '../components/NoteItem';
import { RecordButton } from '../components/RecordButton';
import { theme } from '../../../shared/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/AppNavigator';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotesList'>;

export const NotesListScreen = () => {
  const { notes, fetchNotes, addNote, deleteNote } = useNotesStore();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isRecording, transcript, error, startRecording, stopRecording, resetState } = useVoiceRecognition();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.transcript.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecordPress = async () => {
    if (isRecording) {
      await stopRecording();
      if (transcript.trim().length > 0) {
        setNoteTitle('Note ' + new Date().toLocaleDateString());
        setShowSaveModal(true);
      } else {
        resetState();
      }
    } else {
      await startRecording();
    }
  };

  const handleSaveNote = async () => {
    if (transcript.trim()) {
      await addNote({
        id: Date.now().toString(),
        title: noteTitle || 'Untitled Note',
        transcript: transcript,
        createdAt: Date.now(),
      });
    }
    setShowSaveModal(false);
    resetState();
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
    resetState();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
            onDelete={() => deleteNote(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No notes found.' : 'Tap the microphone to create your first note.'}
            </Text>
          </View>
        }
      />

      {isRecording && (
        <View style={styles.liveTranscriptContainer}>
          <Text style={styles.liveTranscriptText}>{transcript || 'Listening...'}</Text>
        </View>
      )}

      {error && !isRecording && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTextItem}>{error}</Text>
        </View>
      )}

      <View style={styles.fabContainer}>
        <RecordButton isRecording={isRecording} onPress={handleRecordPress} />
      </View>

      <Modal visible={showSaveModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Note</Text>
            <TextInput
              style={styles.modalInput}
              value={noteTitle}
              onChangeText={setNoteTitle}
              placeholder="Note Title"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.modalTranscript} numberOfLines={3}>{transcript}</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelSave}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleSaveNote}>
                <Text style={styles.modalButtonTextPrimary}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 100, // Make room for FAB
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  liveTranscriptContainer: {
    position: 'absolute',
    bottom: 100,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
  },
  liveTranscriptText: {
    color: theme.colors.text,
    fontStyle: 'italic',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 100,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  errorTextItem: {
    color: theme.colors.error,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fabContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadii.md,
    padding: theme.spacing.lg,
    width: '80%',
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  modalInput: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    borderRadius: theme.borderRadii.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  modalTranscript: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadii.sm,
  },
  modalButtonText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  modalButtonTextPrimary: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
