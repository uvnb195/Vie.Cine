// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "viecine-6dc11.firebaseapp.com",
    projectId: "viecine-6dc11",
    storageBucket: "viecine-6dc11.appspot.com",
    messagingSenderId: "933897597627",
    appId: "1:933897597627:web:8797388685bd9823516f9e",
    measurementId: "G-S2DHNSBDXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})

