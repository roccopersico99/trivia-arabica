import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { collection, query, where, getDocs, limit, updateDoc } from "firebase/firestore";



import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBv4itSAtnCyRSbobSEsuk3LnOBs6V0-8g",
  authDomain: "mystical-factor-327614.firebaseapp.com",
  projectId: "mystical-factor-327614",
  storageBucket: "mystical-factor-327614.appspot.com",
  messagingSenderId: "232679417776",
  appId: "1:232679417776:web:7413832550f5b9782d5875"
};

//const app = firebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userRef = collection(db, 'users')

export const updateData = (docRef, updatedData) => {
  updateDoc(docRef, updatedData);
}

export const createUser = (userName, userId, imageURL) => {
  return db.collection('users')
    .add({
      display_name: userName,
      user_id: userId,
      medals: 0,
      profile_image: imageURL,
      user_bio: "",
      featured_quiz: ""
    });
};

//this returns a promise object
export const getUser = (userId, observer) => {
  const q = query(userRef, where("user_id", "==", userId), limit(1));
  return getDocs(q)
};