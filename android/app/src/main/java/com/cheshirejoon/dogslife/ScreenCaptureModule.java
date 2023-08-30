// 안드로이드 스크린 캡처를 위한 NativeModule 예시 (Java)
package com.cheshirejoon.dogslife;

import android.util.Base64;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.os.Environment;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.ByteArrayOutputStream;


/*
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
*/
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

        WritableMap bitmapMap = Arguments.createMap();
        byte[] bitToByte = convertBitmapToByteArray(screenshot);

        bitmapMap.putString("string", Base64.encodeToString(bitToByte, Base64.DEFAULT));
        promise.resolve(bitmapMap);
    }

    private byte[] convertBitmapToByteArray(Bitmap bitmap) {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
        return stream.toByteArray();
    }
}
