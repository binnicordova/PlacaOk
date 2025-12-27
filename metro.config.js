const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable support for custom app directory (src/app)
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

// Add support for TFLite and TXT files
config.resolver.assetExts.push('tflite');

// Add support for react-native-worklets-core
config.resolver.sourceExts.push('worklet.js');

module.exports = config;
