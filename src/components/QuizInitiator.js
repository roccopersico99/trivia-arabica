import '../App.css';
import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { useAuthState } from "../Context/index";
import { Button, Stack, InputGroup, FormControl } from 'react-bootstrap';
import * as FirestoreBackend from '../services/Firestore.js'
import Background from './Background.js'

function QuizInitiator() {

  const userDetails = useAuthState();
  const [name, setName] = useState("")

  const history = useHistory();

  const createClicked = async () => {
    if (name === "") {
      return
    }
    //create a quiz with a blank question with the name given
    let res = await FirestoreBackend.createQuiz(userDetails.id, name);
    FirestoreBackend.setQuizQuestion(res.id, 1 + "", "", " ", {
      choice1: {
        text: "",
        correct: true
      },
      choice2: {
        text: "",
        correct: false
      },
      choice3: {
        text: "",
        correct: false
      },
      choice4: {
        text: "",
        correct: false
      }
    })
    //after created, use the ref to that quiz to give to the user
    const ref = await FirestoreBackend.getQuiz(res.id)
    FirestoreBackend.assignQuizToUser(userDetails.id, res.id, ref.ref)
    //after that, route over to the quizcreator for that quiz.
    history.push("/creator/" + ref.id);
  }

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  return (
    <Background>
      <h1> Quiz Creator </h1>
      <Stack style={{alignItems:"center", marginTop:"50px"}}>
      <InputGroup style={{width:"50%"}} className="mb-3">
        <FormControl  aria-label="Default" onChange={onNameChange} placeholder="Quiz Name" />
      </InputGroup>
      <Button primary onClick={createClicked}>Create Quiz</Button>
    </Stack>
    </Background>
  );
}

export default QuizInitiator;