// BASE_URL é definido pelo GitHub Actions (ex.: /nome-do-repositorio) para o GitHub Pages.
module.exports = {
  expo: {
    name: 'Rota',
    slug: 'rota-diario',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    ios: { supportsTablet: true, bundleIdentifier: 'br.escola.rota' },
    android: { package: 'br.escola.rota' },
    web: { bundler: 'metro', output: 'single', name: 'Rota' },
    experiments: { baseUrl: process.env.BASE_URL || '' },
    plugins: [
      ['expo-image-picker', { cameraPermission: 'A câmera é usada para fotografar seus registros de viagem.', photosPermission: 'A galeria é usada para escolher fotos dos seus registros.' }],
      ['expo-location', { locationWhenInUsePermission: 'A localização é usada para marcar onde você fez cada registro.' }]
    ]
  }
};
