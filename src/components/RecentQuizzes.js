import * as FirestoreBackend from '../services/Firestore.js'
// import { Container, Row } from "react-bootstrap";
// import QuizCard from './profile-components/QuizCard.js';
import { useState } from 'react';
import Quizzes from './profile-components/Quizzes.js'
import { Container } from 'react-bootstrap';

function RecentQuizzes() {
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState([]);
  const getRecent = async () => {
    if (loading) {
      return;
    }
    FirestoreBackend.searchQuizzes("", 6).then(async (query_snapshot) => {
      let quizzes = [];
      let counter = query_snapshot.docs.length;
      setLoading(true);
      query_snapshot.docs.forEach(async (quiz, index) => {
        const data = await FirestoreBackend.resolveQuizRef(quiz.ref)
        quizzes[index] = data;
        counter -= 1;
        if(counter === 0)
          setRecent(quizzes);
      })
      
    });
  };
  if (!loading) {
    getRecent();
    return (null);
  } else {
    console.log(recent)
    return (
      <Container>
        <h2 align="left">Recent Quizzes</h2>
        <Quizzes quizzes={recent}></Quizzes>
      </Container>
      
    )
  }
}

export default RecentQuizzes;