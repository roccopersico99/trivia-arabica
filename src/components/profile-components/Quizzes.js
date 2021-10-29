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
        <QuizCard
          title={props.quizzes[0].title}
          image={props.quizzes[0].image}
          description={props.quizzes[0].description}
        ></QuizCard>
        <QuizCard
          title={props.quizzes[1].title}
          image={props.quizzes[1].image}
          description={props.quizzes[1].description}
        ></QuizCard>
        <QuizCard
          title={props.quizzes[2].title}
          image={props.quizzes[2].image}
          description={props.quizzes[2].description}
        ></QuizCard>
      </Row>
    </Container>
  );
}

export default Quizzes;
