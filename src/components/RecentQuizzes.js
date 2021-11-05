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
      data.then((query_snapshot)=>{
        query_snapshot.forEach((qz)=>{
            quizzes.push({
              id: qz.id,
              title: qz.data().quiz_title,
              description: qz.data().quiz_desc,
              image: qz.data().quiz_image,
              creator: "",
              platform: "unset",
              ratings: qz.data().quiz_ratings,
            });
        });
        setRecent(quizzes);
        setLoading(true);
      });
    };
    if(!loading){
      getRecent();
      return(null);
    }
    else {
      return (
        <Quizzes quizzes={recent}></Quizzes>
      )
    }
  }

export default RecentQuizzes;