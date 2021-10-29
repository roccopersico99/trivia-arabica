import { Col, Card, Button } from "react-bootstrap";

function QuizCard(props) {
  return (
    <Card as={Col} style={{margin: '10px'}}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Img variant="top" src={props.image}></Card.Img>
        <Card.Text>{props.description}</Card.Text>
        <Button variant="primary">Like</Button>
        <Button variant="secondar">Dislike</Button>
      </Card.Body>
    </Card>
  );
}

export default QuizCard;
