// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
import "firebase/storage";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBVAZK_fmOGQJZzPJ4uJzJdBFYklf4VydU",
  authDomain: "instagram-clone-react-5460c.firebaseapp.com",
  databaseURL:
    "https://instagram-clone-react-5460c-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-5460c",
  storageBucket: "instagram-clone-react-5460c.appspot.com",
  messagingSenderId: "373042302048",
  appId: "1:373042302048:web:013ecd35e125dd08ea8705",
  measurementId: "G-VWB8ZB1XNE",
});

const db = firebaseApp.firestore(); // to access db
const auth = firebase.auth(); // for authentiction
const storage = firebase.storage(); // how we can uplode photos and stuff

export { db, auth, storage };
