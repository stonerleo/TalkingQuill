# TalkingQuill - AI Voice Notes

A production-ready React Native AI Voice Notes app, built with React Native CLI, Zustand, and `@react-native-voice/voice`.

## Features
- Voice recording with live Speech-To-Text (Offline capable via Android's built-in Google Speech Recognition)
- Notes Storage locally using AsyncStorage
- AI Summarization using Gemini 1.5 Flash (Add your `GEMINI_API_KEY` in `src/features/notes/services/aiSummaryService.ts`)
- Modern Dark Theme UI

## Platform-Specific Setup (Android)
This app uses native Android APIs for Speech-To-Text.
Permissions have already been added to `AndroidManifest.xml` (`RECORD_AUDIO`, `INTERNET`).

## How to Run the App (Android)

1. **Prerequisites**: Ensure you have Android Studio installed and an Android Emulator running or a physical Android device connected via Debugging.
2. **Enable Developer Mode (Nothing Phone 2)**: 
   - Go to Settings -> About Phone -> Nothing OS. 
   - Tap **Build Number** 7 times until you see "You are now a developer!".
   - Go back to Settings -> System -> Developer Options.
   - Enable **USB Debugging** (if using a cable) or **Wireless Debugging** (if debugging over Wi-Fi).
3. **Connect Your Phone**: 
   - **Wired:** Plug your Nothing Phone 2 into your Pop!_OS laptop via USB-C cable. An RSA fingerprint prompt should appear on your phone screen—tap **Allow**.
   - **Wireless:** Enable **Wireless Debugging** in Developer Options. Tap it to enter the menu, tap "Pair device with pairing code". On your Pop!_OS terminal run `adb pair IP:PORT` matching the screen, enter the pairing code, then connect to the secondary port showing on the main screen using `adb connect IP:PORT`.
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Start the Metro Bundler**:
   ```bash
   npm start
   ```
6. **Run on Android**:
   Open a new terminal and run:
   ```bash
   npm run android
   ```
   *Note: If testing STT, a physical Android device is highly recommended as Android Emulators do not always support Google Speech Recognition properly straight out of the box.*
