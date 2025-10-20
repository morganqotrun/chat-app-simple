// 🔥 PASTIKAN CONFIG INI BENAR - COPY DARI FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    authDomain: "anonymous-chat-app-12345.firebaseapp.com",
    projectId: "anonymous-chat-app-12345",
    storageBucket: "anonymous-chat-app-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();