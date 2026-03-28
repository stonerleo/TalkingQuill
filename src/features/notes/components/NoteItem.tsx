import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Note } from '../types';
import { theme } from '../../../shared/styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NoteItemProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({ note, onPress, onDelete }) => {
  const date = new Date(note.createdAt).toLocaleDateString();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
        <Text style={styles.transcript} numberOfLines={2}>{note.transcript}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Icon name="delete-outline" size={24} color={theme.colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  content: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  transcript: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: theme.spacing.sm,
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
});
