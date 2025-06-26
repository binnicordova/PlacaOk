import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME,
  slug: process.env.APP_SLUG,
  version: process.env.APP_VERSION_NAME,
  orientation: 'portrait',
  icon: 'assets/images/icon.png',
  scheme: process.env.APP_SCHEME,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    googleServicesFile: './GoogleService-Info.plist',
    bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER,
    buildNumber: '1',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: 'assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    googleServicesFile: './google-services.json',
    package: process.env.ANDROID_PACKAGE,
    versionCode: Number(process.env.APP_VERSION_CODE),
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: 'assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: 'assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    'expo-localization',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
    POSTHOG_HOST: process.env.POSTHOG_HOST,
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
    APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
    APPWRITE_COLLECTION_ID: process.env.APPWRITE_COLLECTION_ID,
    EXPO_PROJECT_ID: process.env.EXPO_PROJECT_ID,
    EXPO_OWNER: process.env.EXPO_OWNER,
    APP_NAME: process.env.APP_NAME,
    APP_SLUG: process.env.APP_SLUG,
    APP_SCHEME: process.env.APP_SCHEME,
    APP_VERSION_NAME: process.env.APP_VERSION_NAME,
    APP_VERSION_CODE: process.env.APP_VERSION_CODE,
    ANDROID_PACKAGE: process.env.ANDROID_PACKAGE,
    IOS_BUNDLE_IDENTIFIER: process.env.IOS_BUNDLE_IDENTIFIER,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  owner: process.env.EXPO_OWNER,
  updates: {
    fallbackToCacheTimeout: 0,
    checkAutomatically: 'ON_LOAD',
    enabled: true,
    url: `https://u.expo.dev/${process.env.EXPO_PROJECT_ID}`,
  },
});
