// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// --- SVG support ---
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// (optional) keep your earlier shims if you added them:
config.resolver.extraNodeModules = {
    process: require.resolve('process'),
    buffer: require.resolve('buffer/'),
};

module.exports = config;
