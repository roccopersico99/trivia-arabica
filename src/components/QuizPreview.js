import "../App.css";
import React, { useState, useEffect } from "react";
import Background from "./Background.js";
import {
  Container,
  Stack,
  Button,
  Image,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import * as FirestoreBackend from "../services/Firestore";
import { useAuthState } from "../Context/index";
import QuizReportPopup from "./QuizReportPopup.js";

function QuizPreview() {
  const userDetails = useAuthState();
  const params = useParams();

  const [modalShow, setModalShow] = useState(false);

  function handleReport(res) {
    let sentBy = "";
    userDetails.user === "" ? (sentBy = "Guest") : (sentBy = userDetails.id);
    let currentTime = new Date();
    try {
      window.Email.send({
        SecureToken: "36297ca5-2675-43a0-82be-c6640938db00",
        To: "rocco.persico@stonybrook.edu",
        From: "roccopersico99@gmail.com",
        Subject: "Quiz Reported: " + params.id,
        Body:
          "A quiz has been reported on Trivia Arabica...<br />" +
          "Reported Quiz: " +
          params.id +
          "<br />" +
          "Reported by User: " +
          sentBy +
          "<br />" +
          "Time of Report: " +
          currentTime.toString() +
          "<br />" +
          "User Response: " +
          res,
      })
        .then((message) =>
          message === "OK"
            ? alert("Report Submitted. Thank you!")
            : alert(message)
        )
        .then(setModalShow(false));
    } catch (e) {
      console.log(e);
    }
  }

  const [quiz, setQuiz] = useState({});
  const [quizCreator, setQuizCreator] = useState({});

  function resolveQuizRef() {
    FirestoreBackend.getQuizFromString(params.id).then(async (result) => {
      setQuiz(result);
    }).catch(err => {console.log(err)});
  }

  function resolveQuizCreatorRef() {
    FirestoreBackend.resolveUserRef(quiz?.creator).then(async (result) => {
      setQuizCreator(result);
    }).catch(err => {console.log(err)});
  }

  useEffect(() => {
    resolveQuizRef();
  }, [params]);

  useEffect(() => {
    resolveQuizCreatorRef();
  }, [quiz]);

  if (!quiz) {
    return <Background>quiz does not exist or was deleted</Background>;
  }

  const likes = quiz?.likes;
  const dislikes = quiz?.dislikes;
  let noRatings = false;
  let totalRatings = likes + dislikes;
  if (totalRatings <= 0) {
    totalRatings = 1;
    noRatings = true;
  }
  const likePercent = Math.floor((likes / totalRatings) * 100);
  const dislikePercent = Math.floor((dislikes / totalRatings) * 100);

  let date = new Date(1970,0,1);
  date.setSeconds(quiz?.publish_date?.seconds);
  
  const publishDate = date.toLocaleDateString();
  // if (userDetails.user === "") {
  //   return (
  //     <Background>
  //       <Spinner
  //         style={{ marginTop: "100px" }}
  //         animation="border"
  //         role="status"
  //       >
  //         <span className="visually-hidden">Loading...</span>
  //       </Spinner>
  //     </Background>
  //   );
  // }
  console.log(publishDate)
  return (
    <Background>
      <QuizReportPopup
        show={modalShow}
        onHide={() => setModalShow(false)}
        onSubmit={(res) => handleReport(res)}
      ></QuizReportPopup>
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
            <h2>Uploaded: {publishDate === "Invalid Date" ? "Date Unknown" : publishDate}</h2>
            <h2>Rating</h2>
            <ProgressBar>
              <ProgressBar
                variant="success"
                now={likePercent}
                key={1}
                label={noRatings ? `` : `${likePercent}%`}
              />
              <ProgressBar
                variant="danger"
                now={dislikePercent}
                key={2}
                label={`${dislikePercent}%`}
              />
            </ProgressBar>
            <Stack direction="horizontal" gap={3}>
              {userDetails.user !== "" && (
                <Link
                  to={{ pathname: "/play/" + quiz?.id, state: quiz }}
                  className="btn btn-success w-100 p-3"
                >
                  Play!
                </Link>
              )}
              {userDetails.user === "" && (
                <Link
                  to={{ pathname: "/play/" + quiz?.id, state: quiz }}
                  className="btn btn-success w-50 p-3"
                >
                  Play!
                </Link>
              )}
              {userDetails.user !== "" && (
                <Button
                  onClick={() => setModalShow(true)}
                  variant="danger"
                  className="w-50 p-3"
                >
                  Report
                </Button>
              )}
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
              {quiz?.description === ""
                ? "This is where the quiz description would go, IF IT EXISTED!"
                : quiz?.description}
            </p>
          </Stack>
        </Stack>
      </Container>
    </Background>
  );
}

export default QuizPreview;
