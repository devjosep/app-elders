module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-syntax-decorators', { decoratorsBeforeExport: true } ],
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],

  ]
};
