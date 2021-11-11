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
      FirestoreBackend.searchQuizzes().then((query_snapshot)=>{
        query_snapshot.forEach(async (quiz)=>{
          FirestoreBackend.resolveQuizRef(quiz.ref).then((data)=>{
            quizzes.push(data);
            setLoading(true);
            setRecent(recent => [...recent, data]);
          });
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