module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'module-resolver',
      'react-native-reanimated/plugin',
      ['@babel/plugin-syntax-decorators', { decoratorsBeforeExport: true }],
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    ]
  };
};
