module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [ 'module-resolver',
      {
        alias: {
          '@src': './src',
          '@assets': './assets',
        },
      },
    ],
    ['module:react-native-dotenv', { moduleName: '@env', path: '.env' }]
  ]
};
