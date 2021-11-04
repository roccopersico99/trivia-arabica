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
//const quizRef = collection(db, 'quizzes')

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

export const createQuiz = (userId, quizTitle) => {
  return db.collection('quizzes')
    .add({
      quiz_creator: userId,
      quiz_title: quizTitle,
      quiz_image: "",
      quiz_desc: "",
      quiz_ratings: {},
      quiz_settings: {
        explicit: false,
        question_time_seconds: 60,
        total_time_minutes: 10
      },
      publish_state: false,
      publish_date: null,
    });
};

export const getQuiz = (quizPath) => {
  return db.collection('quizzes').doc(quizPath).get();
};

export const getQuizQuestions = async (quizPath) => {
  const docSnap = await db.collection('quizzes').doc(quizPath).collection('quiz_questions').orderBy('number').get();
  return docSnap;
}

export const setQuizQuestion = (quizPath, questionNum, imageURL, questionTitle, choices) => {
  return db.collection('quizzes').doc(quizPath).collection('quiz_questions').doc(questionNum)
    .set({
      question_title: questionTitle,
      question_image: imageURL,
      question_choices: choices,
      number: parseInt(questionNum)
    });
};

export const deleteQuestion = async (quizPath, questionNum) => {
  const res = await db.collection('quizzes').doc(quizPath).collection('quiz_questions').doc(questionNum).delete();
  return res
}

export const deleteQuestions = (quizPath) => {
  const collectionref = db.collection('quizzes').doc(quizPath).collection('quiz_questions').get();
  const batch = db.batch();
  collectionref.then((query_snapshot) => {
    query_snapshot.docs.forEach((question) => {
      batch.delete(question.ref);
    });
    batch.commit();
  });
}