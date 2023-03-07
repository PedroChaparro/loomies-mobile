/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  },
  resolver: {
    assetExts: [
      'jpg',
      'jpeg',
      'png',
      'svg',
      'wav',
      'ttf',
      'glb'
    ]
  }
};
