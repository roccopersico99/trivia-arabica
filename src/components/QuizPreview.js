import "../App.css";
import React, { useState } from "react";
import Background from "./Background.js";
import {
  Container,
  Stack,
  Button,
  Image,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import * as FirestoreBackend from "../services/Firestore";

import { useAuthState } from "../Context/index";

function QuizPreview() {
  const history = useHistory();
  const userDetails = useAuthState();
  const params = useParams();
  const quiz = history.location.state;

  const [currQuiz, setCurrQuiz] = useState(async () => {
    await FirestoreBackend.getQuiz(params.id).then((quiz) => {
      setCurrQuiz(quiz.data());
    })
  }); 

  const [quizCreator, setQuizCreator] = useState(async () => {
    await FirestoreBackend.resolveUserRef(quiz.creator).then((user) => {
      setQuizCreator(user);
    })
  });
  
  const likes = currQuiz.quiz_likes;
  const dislikes = currQuiz.quiz_dislikes;

  const likePercent = Math.floor((likes/(likes+dislikes))*100)
  const dislikePercent = Math.floor((dislikes/(likes+dislikes))*100)

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
          <Stack gap={3} style={{ width: "48%" }}>
            <br></br>
            <Link to={{ pathname: "/profile/" + quizCreator?.user_id }}>
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
                  src={quizCreator?.profile_image}
                  alt="Profile Image"
                  className="block-example border border-dark"
                ></Image>
                <h1>{quizCreator?.display_name}</h1>
              </Stack>
            </Link>
            <h2>Quiz Created: 10/29/2021</h2>
            <h2>Community Rating:</h2>
            <ProgressBar>
              <ProgressBar
                variant="success"
                now={likePercent}
                key={1}
                label={`${likePercent}%`}
              />
              <ProgressBar
                variant="danger"
                now={dislikePercent}
                key={2}
                label={`${dislikePercent}%`}
              />
            </ProgressBar>
            <Stack direction="horizontal" gap={3}>
              <Link
                to={{ pathname: "/play/" + quiz?.id, state: quiz }}
                className="btn btn-success w-50 p-3"
              >
                Play!
              </Link>
              <Button variant="danger" className="w-50 p-3">
                Report
              </Button>
            </Stack>
          </Stack>
          <Stack gap={3} style={{ width: "48%" }}>
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
    </Background >
  );
}

export default QuizPreview;