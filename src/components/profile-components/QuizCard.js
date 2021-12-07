import { Col, Card, Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import * as FirestoreBackend from "../../services/Firestore";
import { useAuthState } from "../../Context/index";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { default as logo } from "../../logo.svg";

function QuizCard(props) {

  const userDetails = useAuthState();

  const [isLiked, setIsLiked] = useState(async () => {
    const userquizzes = await FirestoreBackend.getUserRatedQuizzes(userDetails.id)
    if (userquizzes !== undefined) {
      let rated_quizzii = []
      let quizRatings = []
      userquizzes.docs.forEach(async (doc) => {
        rated_quizzii.push(doc.id);
        quizRatings.push(doc.data())
      });

      if (rated_quizzii.includes(props.quiz?.id)) {
        if (quizRatings[rated_quizzii.indexOf(props.quiz?.id)].like === false)
          setIsLiked(2)
        else if (quizRatings[rated_quizzii.indexOf(props.quiz?.id)].like === true)
          setIsLiked(1)
        else
          setIsLiked(0)
      }
    }
  });

  async function handleLike() {
    console.log("like clicked!")
    setIsLiked(1)
    const userquizzes = await FirestoreBackend.getUserRatedQuizzes(userDetails.id)
    let rated_quizzii = []
    let quizRatings = []
    let newRating = true;
    let changingRating = false;
    userquizzes.docs.forEach(async (doc) => {
      rated_quizzii.push(doc.id);
      quizRatings.push(doc.data())
    });

    if (rated_quizzii.includes(props.quiz?.id)) {
      newRating = false;
      if (quizRatings[rated_quizzii.indexOf(props.quiz?.id)].like === false) {
        changingRating = true;
        console.log("changing rating from dislike -> like")
      } else
        console.log("quiz already liked!")
    }

    if (newRating) {
      console.log("adding ", props.quiz?.id, " to user ", userDetails.id)
      FirestoreBackend.addUserRatedQuiz(userDetails.id, props.quiz?.id, true);
      // add 1 like to current quiz
      let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
      FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0] + 1, ratings[1])
    } else {
      // if user is changing rating from like to dislike, then do this. if they already disliked and are clicking dislike again, do nothing
      if (changingRating) {
        console.log("updating user ", userDetails.id, " rating for quiz ", props.quiz?.id, " to TRUE")
        FirestoreBackend.updateUserRatedQuizzes(userDetails.id, props.quiz?.id, true);
        // add 1 like and remove 1 dislike from current quiz
        let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
        FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0] + 1, ratings[1] - 1)
      }
    }
  }

  async function handleDislike() {
    console.log("dislike clicked!")
    setIsLiked(2)
    const userquizzes = await FirestoreBackend.getUserRatedQuizzes(userDetails.id)
    let rated_quizzii = [];
    let quizRatings = [];
    let newRating = true;
    let changingRating = false;
    userquizzes.docs.forEach(async (doc) => {
      rated_quizzii.push(doc.id);
      quizRatings.push(doc.data())
    });

    if (rated_quizzii.includes(props.quiz?.id)) {
      newRating = false;
      if (quizRatings[rated_quizzii.indexOf(props.quiz?.id)].like === true) {
        changingRating = true;
        console.log("changing rating from like -> dislike")
      } else
        console.log("quiz already disliked!")
    }

    if (newRating) {
      console.log("adding ", props.quiz?.id, " to user ", userDetails.id)
      FirestoreBackend.addUserRatedQuiz(userDetails.id, props.quiz?.id, false);
      // add 1 dislike to current quiz
      let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
      FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0], ratings[1] + 1)
    } else {
      if (changingRating) {
        console.log("updating user ", userDetails.id, " rating for quiz ", props.quiz?.id, " to FALSE")
        FirestoreBackend.updateUserRatedQuizzes(userDetails.id, props.quiz?.id, false);
        // add 1 dislike and remove 1 like from current quiz
        let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
        FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0] - 1, ratings[1] + 1)
      }
    }
  }

  async function handleDelete() {
    console.log("delete clicked");
    await FirestoreBackend.deleteQuiz(props.quiz?.id);
    console.log(props);
    props.onDelete()
  }

  const handleFeatured = () => {
    if (userDetails.id === null || userDetails.id === undefined) {
      console.log("attempted with id \"", userDetails.id, "\"")
      return
    }
    if (!props.quiz?.allowed) {
      console.log("user attempted to feature not their own quiz")
      return
    }
    FirestoreBackend.setUserFeaturedQuiz(userDetails.id, props.quiz.id)
  }

  return (
    <Card as={Col} style={{ margin: "10px" }}>
      <Card.Body>
        <Card.Title>{props.quiz?.title}</Card.Title>
        <Card.Img
          style={{maxHeight: "100%", height: "150px", maxWidth: "100%", width: "250px", backgroundSize: "contain" }}
          variant="top"
          src={props.quiz?.image === "" ? logo : props.quiz?.image}
        ></Card.Img>
        <Card.Text>{props.quiz?.description}</Card.Text>
        <Row>
          <Link
            to={{ pathname: "/preview/" + props.quiz?.id, state: props.quiz }}
            className="btn btn-primary mx-auto"
            style={{width: '100px'}}
          >
            Preview
          </Link>
        </Row>
        {!props.quiz?.allowed && userDetails.user !== "" && <Button onClick={handleLike} variant="light" disabled={isLiked === 1}><FaThumbsUp /></Button>}
        {!props.quiz?.allowed && userDetails.user !== "" && <Button onClick={handleDislike} variant="light" disabled={isLiked === 2}><FaThumbsDown /></Button>}
        {!props.quiz?.publish_state && props.quiz?.allowed && userDetails.user !== "" && <Button href={"/creator/" + props.quiz?.id} variant="warning">Edit</Button>}
        {props.quiz?.allowed && userDetails.user !== "" && <Button onClick={handleDelete} variant="danger">Delete</Button>}
        {props.quiz?.allowed && userDetails.user !== "" && <Button onClick={handleFeatured} variant="info" >Set Featured</Button>}
      </Card.Body>
    </Card>
  );
}

export default QuizCard;