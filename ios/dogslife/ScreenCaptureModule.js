// src/ScreenCaptureModule.js

import { NativeModules } from 'react-native';

const { ScreenCaptureModule } = NativeModules;

export const captureScreeniOS = async () => {
  try {
    const base64Img = await ScreenCaptureModule.captureScreen();
    return base64Img;
  } catch (error) {
    console.error('Error capturing screen:', error);
  }
};
