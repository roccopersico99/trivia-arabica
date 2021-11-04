import { Container, Row } from "react-bootstrap";
import QuizCard from "./QuizCard.js";

function Quizzes(props) {
  return (
    <Container>
      {/*
        get number of quizzes from this user
        generate n rows for every i (3) quizzes
        */}

      <Row>
        <QuizCard quiz={props.quizzes[0]}></QuizCard>
        <QuizCard quiz={props.quizzes[1]}></QuizCard>
        <QuizCard quiz={props.quizzes[2]}></QuizCard>
      </Row>
    </Container>
  );
}

export default Quizzes;
