import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { collection, query, where, getDocs, getDoc, limit, updateDoc, orderBy, doc, setDoc, addDoc, startAt } from "firebase/firestore";
import { Timestamp } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import "firebase/firestore";
import { getAuth } from "@firebase/auth";

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
const auth = getAuth();

//FIREBASE FIRESTORE

export const updateData = (docRef, updatedData) => {
  updateDoc(docRef, updatedData);
}

export const createUser = (userName, userId, imageURL, uid) => {
  return setDoc(doc(db, "users", userId), {
    display_name: userName,
    user_id: userId,
    uid: uid,
    medals: 0,
    profile_image: imageURL,
    user_bio: "",
    featured_quiz: "",
    youtubeURL: "",
    facebookURL: "",
    twitterURL: "",
    redditURL: ""
  });
};


//this returns a promise object
export const getUser = async (userId) => {
  const docSnap = await db.collection('users').doc(userId).get();
  return docSnap
};


export const getUserQuizzes = async (userid) => {
  const docSnap = await db.collection('users').doc(userid).collection("userquizzes").get();
  return docSnap;
}

export const addUserCompletedQuiz = async (userid, quizID, addedMedals) => {
  const docSnap = await db.collection('users').doc(userid);
  return setDoc(doc(docSnap, "completed_quizzes", quizID), {
    earnedMedals: addedMedals
  });
}

export const getUserCompletedQuizMedals = async (userID, quizID) => {
  const docSnap = db.collection('users').doc(userID).collection('completed_quizzes').doc(quizID).get();
  return docSnap;
}

export const getUserMedalCount = async (userID) => {
  let medals = await (await db.collection('users').doc(userID).get()).data().medals;
  return medals
}

export const updateUserMedals = async (userid, addedMedals) => {
  let newMedals = await (await db.collection('users').doc(userid).get()).data().medals;
  if (isNaN(newMedals)) {
    newMedals = 0;
  }
  newMedals += addedMedals;
  const docSnap = await updateDoc(doc(db, "users", userid), {
    medals: newMedals,
  });
  console.log("newMedals: " + newMedals)
  return newMedals;
}

export const setUserFeaturedQuiz = async (userid, quizID) => {
  const docSnap = await updateDoc(doc(db, "users", userid), {
    featured_quiz: quizID,
  });
  return docSnap
}

export const addUserRatedQuiz = async (userid, quizID, rating) => {
  const docSnap = await db.collection('users').doc(userid);
  return setDoc(doc(docSnap, "rated_quizzes", quizID), {
    like: rating
  });
}

export const getUserRatedQuizzes = async (userid) => {
  if (userid === undefined || userid === null || userid === "") {
    return
  }
  const docSnap = await db.collection('users').doc(userid).collection("rated_quizzes").get();
  return docSnap;
}

export const updateUserRatedQuizzes = async (userid, quizID, rating) => {
  return db.collection('users').doc(userid).collection('rated_quizzes').doc(quizID).set({ like: rating });
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

export const setUserYoutube = async (userid, yturl) => {
  const docSnap = await updateDoc(doc(db, "users", userid), {
    youtubeURL: yturl,
  });
  return docSnap
}

export const setUserFacebook = async (userid, fburl) => {
  const docSnap = await updateDoc(doc(db, "users", userid), {
    facebookURL: fburl,
  });
  return docSnap
}

export const setUserTwitter = async (userid, twitterurl) => {
  const docSnap = await updateDoc(doc(db, "users", userid), {
    twitterURL: twitterurl,
  });
  return docSnap
}

export const setUserReddit = async (userid, redditurl) => {
  const docSnap = await updateDoc(doc(db, "users", userid), {
    redditURL: redditurl,
  });
  return docSnap
}

export const updateQuizRatings = async (quizID, likes, dislikes) => {
  //const quiz = await (await getQuiz(quizID)).data()
  const docSnap = await updateDoc(doc(db, "quizzes", quizID), {
    quiz_likes: likes,
    quiz_dislikes: dislikes,
  });
  return docSnap
}

export const assignQuizToUser = async (userid, quizID, quizRef) => {
  const docSnap = await db.collection('users').doc(userid).collection("userquizzes").doc(quizID).set({
    quizRef: quizRef
  });
  return docSnap;
}

export const getQuiz = async (quizPath) => {
  const docSnap = await db.collection('quizzes').doc(quizPath).get();
  return docSnap
};

export const getQuizFromString = async (quizID) => {
  //exports quiz in resolveQuizRef format however can be done on an empty quizPath
  if (quizID === "" || quizID === undefined || quizID === null) {
    return undefined
  }
  const docSnap = await db.collection('quizzes').doc(quizID).get();
  if (docSnap.data() === undefined) {
    return undefined
  }
  const imageUrl = await getImageURL(docSnap.data().quiz_image);

  return {
    id: docSnap.id,
    allowed: false,
    platform: "unset",
    title: docSnap.data().quiz_title,
    description: docSnap.data().quiz_desc,
    image: imageUrl,
    creator: docSnap.data().quiz_creator,
    likes: docSnap.data().quiz_likes,
    dislikes: docSnap.data().quiz_dislikes,
    ratings: docSnap.data().quiz_ratings,
    publish_date: docSnap.data().publish_date,
    publish_state: docSnap.data().publish_state
  }
}

export const getAllQuizzes = async () => {
  const quizzes = [];
  let id = 0;
  db.collection('quizzes').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      let title = doc.data().quiz_title;
      let desc = doc.data().quiz_desc;
      quizzes.push({ id, title, desc })
      id++;
    })
  });
  return quizzes
}

export const getQuizzes = async (quizIDs) => {
  const quizzes = await db.collection('quizzes').where('__name__', 'in', quizIDs).get()
  return quizzes
}

// TODO: gets random quiz ID, but not in time for Nav component to use
export const getRandomQuiz = async () => {
  let quizId = ""
  let quizzes = [];
  let key = db.collection('quizzes').doc().id;
  console.log(key);
  let random = await getDocs(query(quizRef, where('publish_state', '==', true), where('__name__', '>=', key), orderBy('__name__'), limit(1)));
  while (!random.docs[0])
    key = db.collection('quizzes').doc().id;
  random = await getDocs(query(quizRef, where('publish_state', '==', true), where('__name__', '>=', key), orderBy('__name__'), limit(1)));
  return (random.docs[0].id);
}

export const checkQuizCompletedOnUser = async (userid, quizid) => {
  if (userid === undefined || userid === null || userid === "") {
    return
  }
  const docRef = db.collection('users').doc(userid).collection("completed_quizzes").doc(quizid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export const createQuiz = async (userId, quizTitle, quizDesc, imgPath, uid) => {
  let title = quizTitle.toLowerCase()
  let str = '';
  let searchIndex = [''];
  for (let i = 0; i < title.length; i++) {

    str = str.concat(title[i]);

    searchIndex.push(str);

  }
  const docSnap = await db.collection('quizzes')
    .add({
      quiz_creator: userId,
      uid: uid,
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
      publish_date: Timestamp.now(), // for sorting unpublished quizzes, it will be overwritten on publish
      search_index: searchIndex,
      search_title: quizTitle.toLowerCase()
    });
  return docSnap;
};

export const deleteQuiz = async (quizPath) => {
  console.log(quizPath);
  return db.collection('quizzes').doc(quizPath).get().then((snapshot) => {
    const userid = snapshot.data().quiz_creator;
    const imgname = snapshot.data().quiz_image;
    const batch = db.batch();
    batch.delete(doc(collection(doc(userRef, userid), 'userquizzes'), quizPath));
    batch.delete(doc(quizRef, quizPath));
    batch.commit();
    console.log("deleted quiz");
    deleteQuestions(quizPath);
    deleteFile(imgname);
  });
}

export const createUserPagePost = async (posterId, userpageId, postTitle, postText, uid) => {
  const docSnap = await db.collection('users').doc(userpageId).collection("user_posts").add({
    post_creator: posterId,
    uid: uid,
    post_title: postTitle,
    post_text: postText,
    post_likes: 0,
    post_dislikes: 0,
    publish_date: Timestamp.now(),
    post_deleted: false
  });
  return docSnap;
};

export const getUserPagePosts = (userPageId) => {
  const docSnap = db.collection('users').doc(userPageId).collection('user_posts').orderBy('publish_date', 'desc').get()
  return docSnap
}

export const deleteUserPagePost = (userPageId, postId) => {
  updateData(db.collection('users').doc(userPageId).collection('user_posts').doc(postId), {
    post_deleted: true,
    post_title: "",
    post_text: ""
  })
}

export const resolveUserRef = async (userRef) => {
  const snapshot = (await db.collection('users').doc(userRef).get()).data();
  return snapshot;
}

export const resolveQuizRef = async (quizRef) => {
  const snapshot = await getDoc(quizRef);
  if (snapshot.data() === undefined) {
    return undefined
  }
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
    publish_date: snapshot.data().publish_date,
    publish_state: snapshot.data().publish_state
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
      number: parseInt(questionNum),
      num_choices: choices.length
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

export const publishQuiz = async (quizPath) => {
  const batch = db.batch();
  const quiz_query = await getQuiz(quizPath);
  const quizref = quiz_query.ref;
  batch.update(quizref, { publish_state: true });
  batch.update(quizref, { publish_date: Timestamp.now() });
  await batch.commit();
}

export const recentQuizzes = (limitResults = 10) => {
  const q = query(quizRef, orderBy("publish_date", "desc"), limit(limitResults));
  return getDocs(q)
}

export const searchQuizzes = (search = "", limitResults = 99, orderOn = "publish_date", order = "desc") => {
  search = search.toLowerCase();
  const q = query(quizRef,
    where('search_index', 'array-contains', search),
    where('publish_state', '==', true),
    orderBy(orderOn, order),
    limit(limitResults));
  return getDocs(q);
}

export const searchUserQuizzes = (userid, uid, isowner, search = "", limitResults = 99, orderOn = "publish_date", order = "desc") => {
  search = search.toLowerCase();

  if (isowner) {
    const q = query(quizRef,
      where('search_index', 'array-contains', search),
      where('quiz_creator', '==', userid),
      where('uid', '==', uid),
      orderBy(orderOn, order),
      limit(limitResults));
    return getDocs(q);
  } else {
    const q = query(quizRef,
      where('search_index', 'array-contains', search),
      where('publish_state', '==', true),
      where('quiz_creator', '==', userid),
      orderBy(orderOn, order),
      limit(limitResults));
    return getDocs(q);
  }
}

export const searchPlatformQuizzes = (platformid, search = "", limitResults = 99, orderOn = "publish_date", order = "desc") => {
  search = search.toLowerCase();
  const q = query(quizRef,
    where('search_index', 'array-contains', search),
    where('publish_state', '==', true),
    where('platform_id', '==', platformid),
    orderBy(orderOn, order),
    limit(limitResults));
  return getDocs(q);
}

export const getPlatform = async (id) => {
  const docSnap = await db.collection('platforms').doc(id).get();
  return docSnap
}

export const createPlatform = async (name, owner_id, owner_name, uid) => {
  //attempt to find the platform first
  const q = query(collection(db, "platforms"), where("name", "==", name))
  const doc = await getDocs(q)
  if (!doc.empty) {
    //platform already exists
    return false
  } else {
    //platform does not exist, create it!
    const docRef = await addDoc(collection(db, "platforms"), {
      name: name,
      owner_id: owner_id,
      uid: uid,
      owner_name: owner_name,
      imageURL: "",
      description: ""
    });
    return docRef
  }
}

export const addPlatformToUser = async (userid, platformid, name, ownership) => {
  const docSnap = await db.collection('users').doc(userid).collection("userplatforms").doc(platformid).set({
    owner: ownership,
    name: name
  });
  return docSnap;
}

export const getUserPlatforms = async (userid) => {
  const docSnap = await db.collection('users').doc(userid).collection("userplatforms").get();
  return docSnap;
}

export const isUserInPlatform = async (userid, platformid) => {
  const docSnap = await db.collection('platforms').doc(platformid).collection('members').doc(userid).get();
  return docSnap
}

export const isUserAppliedPlatform = async (userid, platformid) => {
  const docSnap = await db.collection('platforms').doc(platformid).collection('applicants').doc(userid).get();
  return docSnap
}

export const getApplicants = async (platformid) => {
  const docSnap = await db.collection('platforms').doc(platformid).collection("applicants").get();
  return docSnap;
}

export const getMembers = async (platformid) => {
  const docSnap = await db.collection('platforms').doc(platformid).collection("members").get();
  return docSnap;
}

export const applyForPlatform = async (userid, platformid, username) => {
  const docSnap = await db.collection('platforms').doc(platformid).collection("applicants").doc(userid).set({
    name: username
  });
  return docSnap;
}

export const denyUserApplication = async (userid, platformid) => {
  const docSnap = await db.collection('platforms').doc(platformid).collection('applicants').doc(userid).delete();
  return docSnap
}

export const acceptUserApplication = async (userid, platformid, username) => {
  const deleteSnap = await db.collection('platforms').doc(platformid).collection('applicants').doc(userid).delete();
  const docSnap = await db.collection('platforms').doc(platformid).collection("members").doc(userid).set({
    name: username
  });
  return docSnap;
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
  deleteObject(storageRef).then(() => {
    console.log("deleted file: " + filepath);
  }).catch((error) => {
    console.log("error deleting file");
  });
}

// to update search_index in every quiz, for reference when collections need to be updated as a whole

export const updateSearchIndex = async () => {
  const thing = getDocs(quizRef)
  thing.then((snapshot) => {
    snapshot.forEach((doc) => {
      let quizTitle = doc.data().quiz_title
      let title = quizTitle.toLowerCase()
      let str = '';
      let searchIndex = [''];
      for (let i = 0; i < title.length; i++) {
        // console.log(str[i]);
        str = str.concat(title[i]);
        // console.log(str);
        searchIndex.push(str);
        // console.log(searchIndex);
      }
      let strings = title.split(" ");
      // console.log(strings)
      for (let n = 1; n < strings.length; n++) {
        let str = '';
        let string = strings[n];
        // console.log("hi " + string);
        for (let i = 0; i < string.length; i++) {
          // console.log(str[i]);
          str = str.concat(string[i]);
          // console.log(str);
          searchIndex.push(str);
          // console.log(searchIndex);
        }
      }
      updateDoc(doc.ref, {
        // search_title: title
        // search_index: searchIndex,
        // quiz_dislikes: 0,
        // quiz_likes: 0
      })
    })
  })
}

export const updateQuestionChoices = async () => {
  const thing = getDocs(quizRef)
  thing.then((snapshot) => {
    snapshot.forEach((doc) => {
      let quizid = doc.id;
      console.log(quizid);
      let questions = getQuizQuestions(quizid);
      console.log(questions);
      questions.then((qcollection) => {
        console.log(qcollection.docs);
        let qarray = [];
        let questionnum = qcollection.docs.length;
        // console.log(questionnum)
        qcollection.forEach(async (element) => {
          console.log(element.ref)
          console.log(element.data().question_choices.length)
          // let newchoices = [
          //   element.data().question_choices.choice1,
          //   element.data().question_choices.choice2,
          //   element.data().question_choices.choice3,
          //   element.data().question_choices.choice4
          // ]
          // qarray[element.data().number-1]={
          //   question_choices: newchoices,
          //   question_title: element.data().question_title,
          //   question_image: element.data().question_image
          // }
          // questionnum -= 1;
          // if(questionnum === 0){
          //   qarray = qarray.filter(n => n);
          //   console.log(qarray);
          // }
          updateDoc(element.ref, {
            // question_choices: newchoices
            num_choices: element.data().question_choices.length
          })
        });
      })

      updateDoc(doc.ref, {
        // search_title: title
        // search_index: searchIndex,
        // quiz_dislikes: 0,
        // quiz_likes: 0
      })
    })
  })
}