
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5cXDo0XmFAPrpG9memJclIitdpoSSclE",
  authDomain: "thehoopslab.firebaseapp.com",
  databaseURL: "https://thehoopslab-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "thehoopslab",
  storageBucket: "thehoopslab.firebasestorage.app",
  messagingSenderId: "190081337670",
  appId: "1:190081337670:web:c5c490c57c769c5d11fd47"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
