import { Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import * as FirestoreBackend from "../../services/Firestore";
import { useAuthState } from "../../Context/index";

function QuizCard(props) {

  const userDetails = useAuthState();

  async function handleLike() {
    console.log("like clicked!")
    const userquizzes = await FirestoreBackend.getUserRatedQuizzes(userDetails.id)
    let rated_quizzii = []
    let quizRatings = []
    let newRating = true;
    let changingRating = false;
    userquizzes.docs.forEach(async (doc) => {
      rated_quizzii.push(doc.id);
      quizRatings.push(doc.data())
    });

    if(rated_quizzii.includes(props.quiz?.id)) {
      newRating = false;
      if(quizRatings[rated_quizzii.indexOf(props.quiz?.id)].like === false) {
        changingRating = true;
        console.log("changing rating from dislike -> like")
      }
      else
        console.log("quiz already liked!")
    }

    if (newRating){
      console.log("adding ", props.quiz?.id, " to user ", userDetails.id)
      let res = await FirestoreBackend.addUserRatedQuiz(userDetails.id, props.quiz?.id, true);
      // add 1 like to current quiz
      let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
      let resp = await FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0]+1, ratings[1])
    }
    else {
      // if user is changing rating from like to dislike, then do this. if they already disliked and are clicking dislike again, do nothing
      if(changingRating) {
        console.log("updating user ", userDetails.id, " rating for quiz ", props.quiz?.id, " to TRUE")
        let res = await FirestoreBackend.updateUserRatedQuizzes(userDetails.id, props.quiz?.id, true);
        // add 1 like and remove 1 dislike from current quiz
        let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
        let resp = await FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0]+1, ratings[1]-1)
      }
    }
  }

  async function handleDislike() {
    console.log("dislike clicked!")
    const userquizzes = await FirestoreBackend.getUserRatedQuizzes(userDetails.id)
    let rated_quizzii = [];
    let quizRatings = [];
    let newRating = true;
    let changingRating = false;
    userquizzes.docs.forEach(async (doc) => {
      rated_quizzii.push(doc.id);
      quizRatings.push(doc.data())
    });

    if(rated_quizzii.includes(props.quiz?.id)) {
      newRating = false;
      if(quizRatings[rated_quizzii.indexOf(props.quiz?.id)].like === true) {
        changingRating = true;
        console.log("changing rating from like -> dislike")
      }
      else
        console.log("quiz already disliked!")
    }

    if (newRating){
      console.log("adding ", props.quiz?.id, " to user ", userDetails.id)
      let res = await FirestoreBackend.addUserRatedQuiz(userDetails.id, props.quiz?.id, false);
      // add 1 dislike to current quiz
      let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
      let resp = await FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0], ratings[1]+1)
    }
    else {
      if(changingRating) {
        console.log("updating user ", userDetails.id, " rating for quiz ", props.quiz?.id, " to FALSE")
        let res = await FirestoreBackend.updateUserRatedQuizzes(userDetails.id, props.quiz?.id, false);
        // add 1 dislike and remove 1 like from current quiz
        let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
        let resp = await FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0]-1, ratings[1]+1)
      }
    }
  }

  return (
    <Card as={Col} style={{ margin: "10px" }}>
      <Card.Body>
        <Card.Title>{props.quiz?.title}</Card.Title>
        <Card.Img
          style={{ maxHeight: "125px", maxWidth: "100%", width: "250px", backgroundSize: "contain" }}
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
        <Button onClick={handleLike} variant="success">Like</Button>
        <Button onClick={handleDislike} variant="danger">Dislike</Button>
        {props.quiz?.allowed && <Button href={
          "/creator/" + props.quiz?.id
        } variant="warning">Edit</Button>}
      </Card.Body>
    </Card>
  );
}

export default QuizCard;