import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { collection, query, where, getDocs, getDoc, limit, updateDoc, orderBy, doc, setDoc } from "firebase/firestore";
import { Timestamp } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userRef = collection(db, 'users')
const quizRef = collection(db, 'quizzes')

//FIREBASE FIRESTORE

export const updateData = (docRef, updatedData) => {
  updateDoc(docRef, updatedData);
}

export const createUser = (userName, userId, imageURL) => {
  return setDoc(doc(db, "users", userId), {
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

export const getUserQuizzes = async (userid) => {
  const docSnap = await db.collection('users').doc(userid).collection("userquizzes").get();
  return docSnap;
}

export const assignQuizToUser = async (userid, quizID, quizRef) => {
  const docSnap = await db.collection('users').doc(userid).collection("userquizzes").doc(quizID).set({
    quizRef: quizRef
  });
  console.log(docSnap)
  return docSnap;
}

export const getQuiz = async (quizPath) => {
  const docSnap = await db.collection('quizzes').doc(quizPath).get();
  return docSnap
};

export const createQuiz = async (userId, quizTitle, quizDesc, imgPath) => {
  const docSnap = await db.collection('quizzes')
    .add({
      quiz_creator: userId,
      quiz_title: quizTitle,
      quiz_image: imgPath,
      quiz_desc: quizDesc,
      quiz_ratings: {},
      quiz_settings: {
        explicit: false,
        question_time_seconds: 60,
        total_time_minutes: 10
      },
      publish_state: false,
      publish_date: null,
    });
  return docSnap;
};

export const getQuizFromRef = async (quizRef) => {
  const docSnap = await getDoc(quizRef);
  return docSnap
}

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

export const publishQuiz = (quizPath) => {
  const batch = db.batch();
  const quiz_query = getQuiz(quizPath);
  quiz_query.then((query_snapshot) => {
    const quizref = query_snapshot.ref;
    batch.update(quizref, { publish_state: true });
    batch.update(quizref, { publish_date: Timestamp.now() });
    batch.commit();
  });
}

export const recentQuizzes = (limitResults = 10) => {
  const q = query(quizRef, orderBy("publish_date", "desc"), limit(limitResults));
  return getDocs(q)
}




// FIREBASE STORAGE

const storage = getStorage(firebaseApp)

export const uploadFile = async (userid, file) => {
  const storageRef = await ref(storage, "" + userid + "/" + file.name);
  const snap = await uploadBytes(storageRef, file).then(async (snapshot) => {
    return snapshot
  })
  return snap
}

export const getImageURL = async (filepath) => {
  if (filepath === "") {
    return ""
  }
  const geturl = await getDownloadURL(ref(storage, filepath)).then(async (url) => {
    return url
  })
  return geturl
}