import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "id.devin.nihongohub",
  appName: "Nihongo Hub",
  webDir: "dist",
  // Use https://localhost so service workers + Web Speech work in Android
  // WebView. The app is fully bundled into APK assets so it works offline
  // out of the box.
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
