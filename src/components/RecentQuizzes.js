import * as FirestoreBackend from '../services/Firestore.js'
import { Container, Row } from "react-bootstrap";
import QuizCard from './profile-components/QuizCard.js';
import { useState } from 'react';

function RecentQuizzes() {
    const [recent, setRecent] = useState(null);
    const getRecent = async () => {
        const data = FirestoreBackend.recentQuizzes(3);
        let quizzes = [];
        data.then((query_snapshot)=>{
            query_snapshot.forEach((quiz)=>{
                quizzes.push({
                    title: quiz.data().quiz_title,
                    image: quiz.data().quiz_image,
                    description: quiz.data().quiz_desc
                });
            });
            console.log(quizzes);
            setRecent(
              <Container>
                <Row>
                  <QuizCard
                    title={quizzes[0].title}
                    image={quizzes[0].image}
                    description={quizzes[0].description}
                  ></QuizCard>
                  <QuizCard
                    title={quizzes[1].title}
                    image={quizzes[1].image}
                    description={quizzes[1].description}
                  ></QuizCard>
                  <QuizCard
                    title={quizzes[2].title}
                    image={quizzes[2].image}
                    description={quizzes[2].description}
                  ></QuizCard>
                </Row>
              </Container>);
        });
    };
    if(recent === null){
      getRecent();
    }
    return (
        recent
      );
  }

export default RecentQuizzes;