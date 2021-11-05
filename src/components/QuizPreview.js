import "../App.css";
import React from "react";
import Background from "./Background.js";
import {
  Container,
  Stack,
  Button,
  Image,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useAuthState } from "../Context/index";

function QuizPreview(props) {
  const history = useHistory();
  const userDetails = useAuthState();
  const quiz = history.location.state;

  const likes = 85;
  const dislikes = 15;

  const handleOnClick = (event) => {
    history.push({
      pathname: "/play/" + quiz?.id,
      state: quiz,
    });
  };

  if (userDetails.user === "") {
    return (
      <Background>
        <Spinner
          style={{ marginTop: "100px" }}
          animation="border"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Background>
    );
  }
  return (
    <Background>
      <Container>
        <Stack direction="horizontal" gap={3}>
          <Stack gap={3} style={{width:"48%"}}>
            <br></br>
            <Stack
              gap={5}
              direction="horizontal"
              className="block-example border border-dark"
            >
              <Image
                style={{
                  width: "100px",
                  height: "100px",
                }}
                src={userDetails.imageUrl}
                alt="Profile Image"
                className="block-example border border-dark"
              ></Image>
              <h1>{userDetails.user}</h1>
            </Stack>
            <h2>Quiz Created: 10/29/2021</h2>
            <h2>Community Rating:</h2>
            <ProgressBar>
              <ProgressBar
                variant="success"
                now={85}
                key={1}
                label={`${likes}%`}
              />
              <ProgressBar
                variant="danger"
                now={15}
                key={2}
                label={`${dislikes}%`}
              />
            </ProgressBar>
            <Stack direction="horizontal" gap={3}>
              <Link
                to={{ pathname: "/play/" + quiz?.id, state: quiz }}
                onClick={handleOnClick}
                className="btn btn-success w-50 p-3"
              >
                Play!
              </Link>
              <Button variant="danger" className="w-50 p-3">
                Report
              </Button>
            </Stack>
          </Stack>
          <Stack gap={3} style={{width:"48%"}}>
            <br></br>
            <Image
              style={{
                height: "350px",
              }}
              src={quiz?.image}
              alt="Quiz Image"
              className="block-example border border-dark w-100 p-3"
            ></Image>
            <h1 className="block-example border border-dark">{quiz?.title}</h1>
            <p className="block-example border border-dark">
              {quiz?.description === "" ? "This is where the quiz description would go, IF IT EXISTED!" : quiz?.description}
            </p>
          </Stack>
        </Stack>
      </Container>
    </Background>
  );
}

export default QuizPreview;