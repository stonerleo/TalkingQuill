import { useState, useEffect, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

export interface VoiceState {
  isRecording: boolean;
  transcript: string;
  error: string | null;
}

export const useVoiceRecognition = () => {
  const [state, setState] = useState<VoiceState>({
    isRecording: false,
    transcript: '',
    error: null,
  });

  const resetState = useCallback(() => {
    setState({
      isRecording: false,
      transcript: '',
      error: null,
    });
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setState(prevState => ({ ...prevState, isRecording: true, error: null }));
    };

    Voice.onSpeechEnd = () => {
      setState(prevState => ({ ...prevState, isRecording: false }));
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setState(prevState => ({ ...prevState, error: e.error?.message || 'Unknown error', isRecording: false }));
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setState(prevState => ({ ...prevState, transcript: e.value![0] }));
      }
    };

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setState(prevState => ({ ...prevState, transcript: e.value![0] }));
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setState(prevState => ({ ...prevState, error: 'Microphone permission denied' }));
          return;
        }
      }
      resetState();
      await Voice.start('en-US');
    } catch (e: any) {
      setState(prevState => ({ ...prevState, error: e.message || 'Failed to start recording' }));
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (e: any) {
      setState(prevState => ({ ...prevState, error: e.message || 'Failed to stop recording' }));
    }
  };

  const cancelRecording = async () => {
    try {
      await Voice.cancel();
      resetState();
    } catch (e: any) {
      setState(prevState => ({ ...prevState, error: e.message || 'Failed to cancel recording' }));
    }
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    resetState,
  };
};
