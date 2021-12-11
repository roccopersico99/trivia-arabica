import * as FirestoreBackend from '../services/Firestore.js'
import { useState } from 'react';
import Quizzes from './profile-components/Quizzes.js'
import { Container, Spinner, Button } from 'react-bootstrap';

function HomePageQuizzes(props) {
  const [loading, setLoading] = useState(false)
  const [lastQuizSnapshot, setLastQuizSnapshot] = useState("")
  const [quizList, setQuizList] = useState([])
  const [noMoreQuizzes, setNoMoreQuizzes] = useState(false)
  const getquizList = async () => {
    if (loading) {
      return;
    }
    switch(props.title){
      case "Recent Quizzes":
        searchRecent(6)
        break;
      case "All Time Popular Quizzes":
        searchAllTimePopular(3)
        break;
    }
    
  };

  function searchRecent(numQuizzes, startAfterQuiz="") {
    FirestoreBackend.searchQuizzes("", numQuizzes, "publish_date", "desc", startAfterQuiz).then(async (query_snapshot) => processSearch(query_snapshot));
  }

  function searchAllTimePopular(numQuizzes, startAfterQuiz="") {
    FirestoreBackend.mostPopularAllTimeQuizzes(numQuizzes, startAfterQuiz).then(async (query_snapshot) => processSearch(query_snapshot));
  }

  function processSearch(query_snapshot){
    let quizzes = [];
    let counter = query_snapshot.docs.length;
    if(counter < 3){
      setNoMoreQuizzes(true);
    }
    setLoading(true);
    query_snapshot.docs.forEach(async (quiz, index) => {
      const data = await FirestoreBackend.resolveQuizRef(quiz.ref)
      quizzes[index] = data;
      if(index == query_snapshot.docs.length-1) {
        console.log(quiz)
        setLastQuizSnapshot(quiz)
      }
      counter -= 1;
      if(counter === 0)
        setQuizList(quizList.concat(quizzes));
    })
  }

  function loadMore() {
    switch(props.title){
      case "Recent Quizzes":
        searchRecent(3, lastQuizSnapshot)
        break;
      case "All Time Popular Quizzes":
        searchAllTimePopular(3, lastQuizSnapshot)
        break;
    }
  }

  if (!loading) {
    getquizList();
    return (
      <Container>
        <h2 align="left">quizList Quizzes</h2>
        <Spinner style={{ marginTop: "100px" }} animation="border" role="status"></Spinner>
      </Container>
    );
  } else {
    console.log(quizList)
    return (
      <Container>
        <h2 align="left">{props.title}</h2>
        <Quizzes quizzes={quizList}></Quizzes>
        <Button onClick={loadMore} disabled={noMoreQuizzes}>Load More</Button>
        <br></br>
        <br></br>
      </Container>
    )
  }
}

export default HomePageQuizzes;