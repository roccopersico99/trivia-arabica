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
      FirestoreBackend.searchQuizzes().then(async (query_snapshot)=>{
        for (const quiz of query_snapshot.docs) {
          const data = await FirestoreBackend.resolveQuizRef(quiz.ref)
          quizzes.push(data);
          setLoading(true);
          setRecent(recent => [...recent, data]);
        }
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