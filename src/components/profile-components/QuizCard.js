import { Col, Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

function QuizCard(props) {

  return (
    <Card as={Col} style={{margin: '10px'}}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Img variant="top" src={props.image}></Card.Img>
        <Card.Text>{props.description}</Card.Text>
        <Link to='/preview' className="btn btn-primary">Play</Link>
        <Button variant="success">Like</Button>
        <Button variant="danger">Dislike</Button>
      </Card.Body>
    </Card>
  );
}

export default QuizCard;


//<Button variant="primary">Play</Button>