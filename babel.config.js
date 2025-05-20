module.exports = {
  presets: ['module:@react-native/babel-preset'],
   plugins: [
    // ... your existing plugins
    'react-native-reanimated/plugin', // Make sure this is the LAST plugin in the array
  ],
};
