const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable support for custom app directory (src/app)
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;