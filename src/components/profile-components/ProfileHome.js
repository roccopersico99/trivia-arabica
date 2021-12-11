import { Container, Col, Row, Card } from "react-bootstrap";
import QuizCard from "./QuizCard.js";

function ProfileHome(props) {
  return (
    <Container>
      <Row>
        <h3> Featured </h3>
        <QuizCard
          as={Col}
          quiz={props.featuredQuiz}
        ></QuizCard>

        <Card
          as={Col}
          style={{
            margin: "50px",
            position: "relative",
            top: "50%",
          }}
        >
          <Card.Body>
            <Card.Title>heya</Card.Title>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}

export default ProfileHome;