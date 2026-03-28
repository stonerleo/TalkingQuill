import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../../shared/styles/theme';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
}

export const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, onPress, size = 64, style }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8}
      style={[
        styles.container, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: isRecording ? theme.colors.recording : theme.colors.primary
        },
        style
      ]}>
      <Icon 
        name={isRecording ? "stop" : "microphone"} 
        size={size * 0.5} 
        color="#FFFFFF" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
