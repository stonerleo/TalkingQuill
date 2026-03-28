import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesListScreen } from '../../features/notes/screens/NotesListScreen';
import { NoteDetailScreen } from '../../features/notes/screens/NoteDetailScreen';
import { theme } from '../../shared/styles/theme';

export type RootStackParamList = {
  NotesList: undefined;
  NoteDetail: { noteId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}>
        <Stack.Screen 
          name="NotesList" 
          component={NotesListScreen} 
          options={{ title: 'TalkingQuill Notes' }}
        />
        <Stack.Screen 
          name="NoteDetail" 
          component={NoteDetailScreen} 
          options={{ title: 'Note Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
