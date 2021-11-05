import { Col, Card, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { React, useEffect } from "react";

function QuizCard({ quiz }) {
  const history = useHistory();
  const handleOnClick = (event) => {
    history.push({
      pathname: "/preview/" + quiz.id,
      state: quiz,
    });
  };
  useEffect(() => {
    console.log(quiz);
  }, [quiz])
  return (
    <Card as={Col} style={{ margin: "10px" }}>
      <Card.Body>
        <Card.Title>{quiz?.title}</Card.Title>
        <Card.Img variant="top" src={quiz?.image}></Card.Img>
        <Card.Text>{quiz?.description}</Card.Text>
        <Link
          to={{ pathname: "/preview/" + quiz?.id, state: quiz }}
          onClick={handleOnClick}
          className="btn btn-primary"
        >
          Play
        </Link>
        <Button variant="success">Like</Button>
        <Button variant="danger">Dislike</Button>
      </Card.Body>
    </Card>
  );
}

export default QuizCard;