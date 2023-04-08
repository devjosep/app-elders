/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
module.exports = {
  resolver: {
    alias: {
      '@client': path.resolve(__dirname, 'src/packages'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    }
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
