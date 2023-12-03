import 'dotenv/config';

export default {


  "expo": {
    "name": "La Magia del Chef",
    "slug": "HayyimApp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/IconLogo.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/fondoInicio.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },

    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.hayyimcito.hayyimApp"

    },
    "android": {
      "package": "com.hayyimcito.hayyimApp",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    }
  }

}
