import { Col, Card, Button, Row, Dropdown } from "react-bootstrap";
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

  function checkPopular(ratings) {
    //check if more than 5 votes and at least 80% like/dislike ratio
    const totalRatings = ratings[0] + ratings[1];
    if(totalRatings >=5 && ratings[0]/totalRatings >= 0.8){
      return true
    }
    else{
      return false
    }
  }

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
      const popular = checkPopular([ratings[0] + 1, ratings[1]])
      FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0] + 1, ratings[1], popular)
    } else {
      // if user is changing rating from like to dislike, then do this. if they already disliked and are clicking dislike again, do nothing
      if (changingRating) {
        console.log("updating user ", userDetails.id, " rating for quiz ", props.quiz?.id, " to TRUE")
        FirestoreBackend.updateUserRatedQuizzes(userDetails.id, props.quiz?.id, true);
        // add 1 like and remove 1 dislike from current quiz
        let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
        const popular = checkPopular([ratings[0] + 1, ratings[1] - 1])
        FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0] + 1, ratings[1] - 1, popular)
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
      const popular = checkPopular([ratings[0], ratings[1] + 1])
      FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0], ratings[1] + 1, popular)
    } else {
      if (changingRating) {
        console.log("updating user ", userDetails.id, " rating for quiz ", props.quiz?.id, " to FALSE")
        FirestoreBackend.updateUserRatedQuizzes(userDetails.id, props.quiz?.id, false);
        // add 1 dislike and remove 1 like from current quiz
        let ratings = await FirestoreBackend.getQuizRatings(props.quiz?.id)
        const popular = checkPopular([ratings[0] - 1, ratings[1] + 1])
        FirestoreBackend.updateQuizRatings(props.quiz?.id, ratings[0] - 1, ratings[1] + 1, popular)
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
    props.setFeaturedQuiz(props.quiz)
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <p
      style={{cursor:"pointer"}}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <span className="threedots" />
    </p>
  ));

  return (
    <Card as={Col} style={{ margin: "10px", maxWidth:"fit-content" }}>
      {(props.canRemove || props.quiz?.allowed) &&
      <Dropdown style={{position:"absolute", right:"0"}}>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {props.canRemove && userDetails.user !== "" && <Dropdown.Item onClick={() => props.removePlatformQuiz(props.quiz?.id)}>Remove from platform</Dropdown.Item>}
          {!props.quiz?.publish_state && props.quiz?.allowed && userDetails.user !== "" && <Dropdown.Item href={"/creator/" + props.quiz?.id}>Edit</Dropdown.Item>}
          {props.quiz?.allowed && userDetails.user !== "" && <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>}
          {props.quiz?.allowed && userDetails.user !== "" && props.quiz?.publish_state && <Dropdown.Item disabled={props.featuredQuiz?.id === props.quiz?.id} onClick={handleFeatured} >Set Featured</Dropdown.Item>}
        </Dropdown.Menu>
      </Dropdown>
    }
      <Card.Body style={{paddingBottom:"0px"}}>
        <Card.Title>{props.quiz?.title}</Card.Title>
        <Card.Img
          style={{maxHeight: "100%", height: "150px", maxWidth: "100%", width: "250px", backgroundSize: "contain" }}
          variant="top"
          src={props.quiz?.image === "" ? logo : props.quiz?.image}
        ></Card.Img>
        <div style={{minHeight:"100px", height:"100px", maxHeight:"100px", overflow:"hidden"}}>
          {!props.quiz?.publish_state && <h5> (Unpublished) </h5>}
          {!props.quiz?.publish_state && <Card.Text >{props.quiz?.description}</Card.Text>}
          {props.quiz?.publish_state && <Card.Text style={{marginTop:"20px"}}>{props.quiz?.description}</Card.Text>}
        </div>
        <Row>
          <Link
            to={{ pathname: "/preview/" + props.quiz?.id, state: props.quiz }}
            className="btn btn-primary mx-auto"
            style={{width: '100px'}}
          >
            Preview
          </Link>
        </Row>
        <br/>
        {(!props.canRemove && !props.quiz?.allowed && userDetails.user !== "") && <Button onClick={handleLike} variant="light" disabled={isLiked === 1}><FaThumbsUp /></Button>}
        {(!props.canRemove && !props.quiz?.allowed && userDetails.user !== "") && <Button onClick={handleDislike} variant="light" disabled={isLiked === 2}><FaThumbsDown /></Button>}
      </Card.Body>
    </Card>
  );
}

export default QuizCard;