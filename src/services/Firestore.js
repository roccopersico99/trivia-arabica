import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { collection, query, where, getDocs, getDoc, limit, updateDoc, orderBy, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Timestamp } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
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
    featured_quiz: "",
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

export const addUserRatedQuiz = async (userid, quizID, rating) => {
  const docSnap = await db.collection('users').doc(userid);
  return setDoc(doc(docSnap, "rated_quizzes", quizID), {
    like: rating
  });
}

export const getUserRatedQuizzes = async (userid) => {
  const docSnap = await db.collection('users').doc(userid).collection("rated_quizzes").get();
  return docSnap;
}

export const updateUserRatedQuizzes = async (userid, quizID, rating) => {
  return db.collection('users').doc(userid).collection('rated_quizzes').doc(quizID).set({like: rating});
}

// returns ratings array = [likes, dislikes]
export const getQuizRatings = async (quizID) => {
  let ratings = [];
  const docSnap = await db.collection('quizzes').doc(quizID)
  const retreivedDoc = await getDoc(docSnap)
  ratings[0] = retreivedDoc.data().quiz_likes;
  ratings[1] = retreivedDoc.data().quiz_dislikes;
  return ratings;
}

export const updateQuizRatings = async (quizID, likes, dislikes) => {
  const quiz = await (await getQuiz(quizID)).data()
  const docSnap = await setDoc(doc(db, "quizzes", quizID), {
    quiz_creator: quiz.quiz_creator,
    quiz_title: quiz.quiz_title,
    quiz_image: quiz.quiz_image,
    quiz_desc: quiz.quiz_desc,
    quiz_likes: likes,
    quiz_dislikes: dislikes,
    quiz_settings: {
      explicit: false,
      question_time_seconds: 60,
      total_time_minutes: 10
    },
    publish_state: false,
    publish_date: null,
    search_index: quiz.search_index
  });
  return docSnap
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
  let title = quizTitle.toLowerCase()
  let str = '';
  let searchIndex = [];
  for(let i = 0; i<title.length; i++) {
    console.log(str[i]);
    str = str.concat(title[i]);
    console.log(str);
    searchIndex.push(str);
    console.log(searchIndex);
  }
  const docSnap = await db.collection('quizzes')
    .add({
      quiz_creator: userId,
      quiz_title: quizTitle,
      quiz_image: imgPath,
      quiz_desc: quizDesc,
      quiz_likes: 0,
      quiz_dislikes: 0,
      quiz_settings: {
        explicit: false,
        question_time_seconds: 60,
        total_time_minutes: 10
      },
      publish_state: false,
      publish_date: null,
      search_index: searchIndex
    });
  return docSnap;
};

export const deleteQuiz = async (quizPath) => {
  console.log(quizPath);
  db.collection('quizzes').doc(quizPath).get().then((snapshot)=>{
    const userid = snapshot.data().quiz_creator;
    const imgname = snapshot.data().quiz_image;
    const batch = db.batch();
    batch.delete(doc(collection(doc(userRef, userid), 'userquizzes'), quizPath));
    batch.delete(doc(quizRef, quizPath));
    batch.commit();
    console.log("deleted quiz");
    deleteFile(imgname);
  });
}

export const resolveUserRef = async (userRef) => {
  const snapshot = (await db.collection('users').doc(userRef).get()).data();
  return snapshot;
}

export const resolveQuizRef = async (quizRef) => {
  const snapshot = await getDoc(quizRef);
  const imageUrl = await getImageURL(snapshot.data().quiz_image);
  
  return {
    id: snapshot.id,
    allowed: false,
    platform: "unset",
    title: snapshot.data().quiz_title,
    description: snapshot.data().quiz_desc,
    image: imageUrl,
    creator: snapshot.data().quiz_creator,
    likes: snapshot.data().quiz_likes,
    dislikes: snapshot.data().quiz_dislikes,
    ratings: snapshot.data().quiz_ratings,
  }
}

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

export const searchQuizzes = (search = "", limitResults = 5, completionState = "all", orderOn = "publish_date", order = "desc") => {
  search = search.toLowerCase();
  const q = query(quizRef, where('publish_state', '==', true), where('search_index', 'array-contains', search), orderBy('publish_date', 'desc'), limit(limitResults));
  return getDocs(q);
}

// FIREBASE STORAGE

const storage = getStorage(firebaseApp)

export const uploadFile = async (userid, file) => {
  const storageRef = ref(storage, "" + userid + "/" + file.name);
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

export const deleteFile = async (filepath) => {
  console.log(filepath);
  const storageRef = ref(storage, filepath);
  deleteObject(storageRef).then(()=>{
    console.log("deleted file: " + filepath);
  }).catch((error)=>{
    console.log("error deleting file");
  });
}

// to update search_index in every quiz, for reference when collections need to be updated as a whole

export const updateSearchIndex = async () => {
  const thing = getDocs(quizRef)
  thing.then((snapshot)=> {
    snapshot.forEach((doc)=>{
      let quizTitle = doc.data().quiz_title
      let title = quizTitle.toLowerCase()
      let str = '';
      let searchIndex = [];
      for(let i = 0; i<title.length; i++) {
        console.log(str[i]);
        str = str.concat(title[i]);
        console.log(str);
        searchIndex.push(str);
        console.log(searchIndex);
      }
      updateDoc(doc.ref, {
        search_index: searchIndex
      })
    })
  })
}