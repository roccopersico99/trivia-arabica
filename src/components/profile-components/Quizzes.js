import { Container, Row } from "react-bootstrap";
import QuizCard from "./QuizCard.js";

function Quizzes({ setQuizzes, refreshKey, setRefreshKey, quizzes }) {

  const rows = [...Array(Math.ceil(quizzes.length / 3))];
  const quizRows = rows.map((row, index) => quizzes.slice(index * 3, index * 3 + 3))

  let keys = 1;
  const content = quizRows.map((row, index) => (
    <Row className="row" key={index}>
      {row.map(quiz => (
        <QuizCard setQuizzes={setQuizzes} refreshKey={refreshKey} setRefreshKey={setRefreshKey} quiz={quiz} key={keys++}></QuizCard>
      ))}
    </Row>));

  return (
    <Container>
      {content}
    </Container>
  );
}

export default Quizzes;