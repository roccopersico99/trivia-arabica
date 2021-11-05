import { Container, Row } from "react-bootstrap";
import QuizCard from "./QuizCard.js";
import { useEffect } from 'react'

function Quizzes({ quizzes }) {

  useEffect(() => {
    console.log(quizzes);
  }, [quizzes])

  return (
    <Container>
      {/*
        get number of quizzes from this user
        generate n rows for every i (3) quizzes
        */}

      <Row>
        {quizzes.map((quiz, index) => {
          return (  <QuizCard quiz={quiz} key={index}></QuizCard>)
        })}
      </Row>
    </Container>
  );
}

export default Quizzes;