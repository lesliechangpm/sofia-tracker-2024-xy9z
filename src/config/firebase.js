import { initializeApp } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

let isOnline = true;

window.addEventListener('online', async () => {
  if (!isOnline) {
    console.log('Connection restored - enabling Firestore network');
    await enableNetwork(db);
    isOnline = true;
  }
});

window.addEventListener('offline', async () => {
  if (isOnline) {
    console.log('Connection lost - disabling Firestore network');
    await disableNetwork(db);
    isOnline = false;
  }
});

export default app;