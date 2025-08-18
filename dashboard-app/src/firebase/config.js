import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update, serverTimestamp } from 'firebase/database';

// Your Firebase configuration (same as main app)
const firebaseConfig = {
  apiKey: "AIzaSyDo5kl5_SH9sm2Nb8M51st2tyM0TQ_yXuA",
  authDomain: "customer-service-chatbot-b5b10.firebaseapp.com",
  databaseURL: "https://customer-service-chatbot-b5b10-default-rtdb.firebaseio.com",
  projectId: "customer-service-chatbot-b5b10",
  storageBucket: "customer-service-chatbot-b5b10.firebasestorage.app",
  messagingSenderId: "604244257098",
  appId: "1:604244257098:web:d270a8a74df33120cd79b3",
  measurementId: "G-0SH8SX6D4F"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export default app;
