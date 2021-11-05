import { Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";

function QuizCard(props) {
  return (
    <Card as={Col} style={{ margin: "10px" }}>
      <Card.Body>
        <Card.Title>{props.quiz?.title}</Card.Title>
        <Card.Img
          style={{ width: "100px", "background-size": "cover" }}
          variant="top"
          src={props.quiz?.image}
        ></Card.Img>
        <Card.Text>{props.quiz?.description}</Card.Text>
        <Link
          to={{ pathname: "/preview/" + props.quiz?.id, state: props.quiz }}
          className="btn btn-primary"
        >
          Play
        </Link>
        <Button variant="success">Like</Button>
        <Button variant="danger">Dislike</Button>
        <Button href={
          "/creator/" + props.quiz?.id
        } variant="warning">Edit</Button>
      </Card.Body>
    </Card>
  );
}

export default QuizCard;