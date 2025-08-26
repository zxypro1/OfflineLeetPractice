module.exports = {
  appId: 'com.offlineleetpractice.app',
  productName: 'Offline Leet Practice',
  directories: {
    output: 'dist'
  },
  files: [
    'electron-main.js',
    'electron-preload.js',
    'next.config.js',
    'package.json',
    'package-lock.json',
    '.next/**/*',
    'node_modules/**/*',
    'public/**/*',
    'problems/**/*',
    'locales/**/*',
    'scripts/**/*',
    'src/**/*',
    'pages/**/*'
  ],
  win: {
    target: 'nsis',
    icon: 'public/icon.png'
  },
  mac: {
    target: 'dmg',
    icon: 'public/icon.png',
    category: 'public.app-category.education'
  },
  linux: {
    target: 'AppImage',
    icon: 'public/icon.png',
    category: 'Development'
  },
  // Configuration to handle symbolic link issues on Windows
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  }
};