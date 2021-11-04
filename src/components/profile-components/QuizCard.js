import { Col, Card, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import React from "react";

function QuizCard(props) {
  const history = useHistory();

  const handleOnClick = (event) => {
    history.push({
      pathname: "/preview/" + props.quiz?.id,
      quiz: props.quiz,
    });
  };

  return (
    <Card as={Col} style={{ margin: "10px" }}>
      <Card.Body>
        <Card.Title>{props.quiz?.title}</Card.Title>
        <Card.Img variant="top" src={props.quiz?.image}></Card.Img>
        <Card.Text>{props.quiz?.description}</Card.Text>
        <Link
          to={{ pathname: "/preview/" + props.quiz?.id, state: props.quiz }}
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
