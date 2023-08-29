// iOS 스크린 캡처 NativeModule의 구현 예시 (Swift)

@objc(ScreenCaptureModule)
class ScreenCaptureModule: NSObject {
  
  @objc
  func captureScreen(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
    if let window = UIApplication.shared.keyWindow {
      UIGraphicsBeginImageContextWithOptions(window.bounds.size, false, 0)
      window.drawHierarchy(in: window.bounds, afterScreenUpdates: true)
      if let image = UIGraphicsGetImageFromCurrentImageContext() {
        UIGraphicsEndImageContext()
        if let imageData = image.jpegData(compressionQuality: 1.0) {
          let filePath = NSTemporaryDirectory().appending("screenshot.jpg")
          do {
            try imageData.write(to: URL(fileURLWithPath: filePath))
            resolve(filePath)
          } catch {
            reject("CAPTURE_FAILED", "Failed to save screenshot", error)
          }
        }
      } else {
        reject("CAPTURE_FAILED", "Failed to capture screenshot", nil)
      }
    } else {
      reject("CAPTURE_FAILED", "No active window", nil)
    }
  }
}
