import * as FirestoreBackend from '../services/Firestore.js'
import { useState } from 'react';
import Quizzes from './profile-components/Quizzes.js'
import { Container } from 'react-bootstrap';

function AllTimePopularQuizzes() {
  const [loading, setLoading] = useState(false)
  const [popular, setPopular] = useState([]);
  const getRecent = async () => {
    if (loading) {
      return;
    }
    FirestoreBackend.mostPopularAllTimeQuizzes(6).then(async (query_snapshot) => {
      let quizzes = [];
      let counter = query_snapshot.docs.length;
      setLoading(true);
      query_snapshot.docs.forEach(async (quiz, index) => {
        const data = await FirestoreBackend.resolveQuizRef(quiz.ref)
        quizzes[index] = data;
        counter -= 1;
        if(counter === 0)
          setPopular(quizzes);
      })
      
    });
  };
  if (!loading) {
    getRecent();
    return (null);
  } else {
    console.log(popular)
    return (
      <Container>
        <h2 align="left">All Time Popular Quizzes</h2>
        <Quizzes quizzes={popular}></Quizzes>
      </Container>
      
    )
  }
}

export default AllTimePopularQuizzes;