import * as FirestoreBackend from '../services/Firestore.js'
import { Container, Row } from "react-bootstrap";
import QuizCard from './profile-components/QuizCard.js';
import { useState } from 'react';
import Quizzes from './profile-components/Quizzes.js'

function RecentQuizzes() {
    const [loading, setLoading] = useState(false)
    const [recent, setRecent] = useState([]);
    let quizzes = [];
    const getRecent = async () => {
      if(loading) {
        return;
      }
      const data = FirestoreBackend.recentQuizzes(3);
      data.then(async (query_snapshot)=>{
        query_snapshot.forEach(async (qz)=>{
          const url = await FirestoreBackend.getImageURL(qz.data().quiz_image);
          quizzes.push({
            id: qz.id,
            title: qz.data().quiz_title,
            description: qz.data().quiz_desc,
            image: url,
            creator: "",
            platform: "unset",
            ratings: qz.data().quiz_ratings,
          });
          setLoading(true);
          setRecent(recent.concat(quizzes));
        });
      });
    };
    if(!loading){
      getRecent();
      return(null);
    }
    else {
      console.log(recent)
      return (
        <Quizzes quizzes={recent}></Quizzes>
      )
    }
  }

export default RecentQuizzes;