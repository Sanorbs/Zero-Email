module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {
      runtime: 'automatic'  // This avoids needing to import React in every file
    }]
  ]
};