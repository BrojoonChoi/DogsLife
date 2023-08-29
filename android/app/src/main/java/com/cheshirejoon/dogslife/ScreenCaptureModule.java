// 안드로이드 스크린 캡처를 위한 NativeModule 예시 (Java)
package com.cheshirejoon.dogslife;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.os.Environment;
import android.view.View;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class ScreenCaptureModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ScreenCaptureModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ScreenCaptureModule";
    }

    @ReactMethod
    public void captureScreen(Promise promise) {
        View rootView = getCurrentActivity().getWindow().getDecorView().getRootView();
        Bitmap screenshot = Bitmap.createBitmap(rootView.getWidth(), rootView.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(screenshot);
        rootView.draw(canvas);

        String filePath = Environment.getExternalStorageDirectory() + "/screenshot.jpg";
        File imageFile = new File(filePath);
        try {
            FileOutputStream outputStream = new FileOutputStream(imageFile);
            screenshot.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
            outputStream.flush();
            outputStream.close();
            promise.resolve(filePath);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject("CAPTURE_FAILED", "Failed to save screenshot", e);
        }
    }
}
