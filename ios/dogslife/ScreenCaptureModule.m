// iOS 스크린 캡처를 위한 NativeModule 예시 (Objective-C)

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenCaptureModule, NSObject)

RCT_EXTERN_METHOD(captureScreen:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
