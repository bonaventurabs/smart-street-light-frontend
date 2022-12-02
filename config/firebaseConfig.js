import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB4dthPb8ysNtyU8P8dof3HnDn-ZdSFcXo",
  authDomain: "smart-street-light-f417c.firebaseapp.com",
  databaseURL: "https://smart-street-light-f417c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-street-light-f417c",
  storageBucket: "smart-street-light-f417c.appspot.com",
  messagingSenderId: "89687046401",
  appId: "1:89687046401:web:7d0f526bad1b410bd38300"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
export const database = getDatabase(firebaseApp)

export default firebaseApp