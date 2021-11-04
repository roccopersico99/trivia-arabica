import "../App.css";
import React, { useState } from "react";
import Background from "./Background.js";
import { default as questionImage } from "../shark_nose.jpg";
import { Stack, Image, Button, ListGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function QuizPlay() {
  const history = useHistory();
  const quiz = history.location.state;
  const [selectedChoice, setSelectedChoice] = useState(-1);

  function isActive(n) {
    if (selectedChoice === n) return true;
    return false;
  }

  function handleSubmitChoice() {
    console.log("clicked submit choice...");
    if (selectedChoice === 0) {
      console.log("Correct!");
    } else {
      console.log("Incorrect!");
    }
    setSelectedChoice(-1);
  }

  return (
    <Background>
      <Stack>
        <br></br>
        <h1>{quiz.title}</h1>
        <h3>Time remaining - 03:15</h3>
        <h2>Question 1 of {quiz.questions.length}</h2>
        <br></br>
        <Image
          style={{
            "background-size": "contain",
            display: "block",
            margin: "auto",
            width: "250px",
            height: "300px",
          }}
          src={quiz.questions[0].image}
          alt="Profile Image"
        ></Image>
        <br></br>
        <h4>{quiz.questions[0].title}</h4>
        <br></br>
        <p>Multiple Choice (Select One)</p>
        <Stack>
          <ListGroup as="ol" style={{ width: "75%", margin: "auto" }}>
            <ListGroup.Item
              as="li"
              active={isActive(0)}
              action
              onClick={() => setSelectedChoice(0)}
            >
              {quiz.questions[0].choices[0]}
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              active={isActive(1)}
              action
              onClick={() => setSelectedChoice(1)}
            >
              {quiz.questions[0].choices[1]}
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              active={isActive(2)}
              action
              onClick={() => setSelectedChoice(2)}
            >
              {quiz.questions[0].choices[2]}
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              active={isActive(3)}
              action
              onClick={() => setSelectedChoice(3)}
            >
              {quiz.questions[0].choices[3]}
            </ListGroup.Item>
          </ListGroup>
        </Stack>
        <br></br>
        <Button
          style={{ width: "15%", margin: "auto" }}
          variant="success"
          onClick={handleSubmitChoice}
        >
          Submit
        </Button>
      </Stack>
    </Background>
  );
}

export default QuizPlay;
