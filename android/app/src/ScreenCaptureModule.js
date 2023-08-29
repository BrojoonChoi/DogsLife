// src/ScreenCaptureModule.js

import { NativeModules } from 'react-native';

const { ScreenCaptureModule } = NativeModules;

export const captureScreen = async () => {
  try {
    const filePath = await ScreenCaptureModule.captureScreen();
    console.log('Captured image file path:', filePath);
  } catch (error) {
    console.error('Error capturing screen:', error);
  }
};
