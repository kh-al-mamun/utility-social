// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_Firebase_apiKey,
  authDomain: import.meta.env.VITE_Firebase_authDomain,
  projectId: import.meta.env.VITE_Firebase_projectId,
  storageBucket: import.meta.env.VITE_Firebase_storageBucket,
  messagingSenderId: import.meta.env.VITE_Firebase_messagingSenderId,
  appId: import.meta.env.VITE_Firebase_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export default app;
const auth = getAuth(app);
export default auth;