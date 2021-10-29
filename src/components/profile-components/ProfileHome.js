import { Button, Container, Col, Row, Card } from "react-bootstrap";
import QuizCard from "./QuizCard.js";

function ProfileHome(props) {
  return (
    <Container>
      <Row>
        <QuizCard
          as={Col}
          style={{ margin: "10px" }}
          title={props.featured_quiz.title}
          image={props.featured_quiz.image}
          description={props.featured_quiz.description}
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
            <Card.Title>{props.featured_quiz.questions[0].title}</Card.Title>
          </Card.Body>
        </Card>
      </Row>

      <Row>
        <Card as={Col}>
          <Card.Body>
            <Card.Title>{props.featured_post.title}</Card.Title>
            <Card.Text>{props.featured_post.content}</Card.Text>
            <Button variant="success">Like</Button>
            <Button variant="danger">Dislike</Button>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}

export default ProfileHome;
