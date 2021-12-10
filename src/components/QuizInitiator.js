import '../App.css';
import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { useAuthState } from "../Context/index";
import { Button, Stack, InputGroup, FormControl, Form } from 'react-bootstrap';
import * as FirestoreBackend from '../services/Firestore.js'
import Background from './Background.js'
import { getAuth } from '@firebase/auth';

function QuizInitiator() {

  const auth = getAuth();
  const userDetails = useAuthState();
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [imgFile, setImgFile] = useState(null)

  const history = useHistory();

  const createClicked = async () => {
    if (name === "") {
      return
    }
    //create a quiz with a blank question with the name given
    let res = await FirestoreBackend.createQuiz(userDetails.id, name, desc, "", auth.currentUser.uid);
    FirestoreBackend.setQuizQuestion(res.id, 1 + "", "", "", [{
        text: "",
        correct: true
      },
      {
        text: "",
        correct: false
      },
      {
        text: "",
        correct: false
      },
      {
        text: "",
        correct: false
      }
    ])
    //after created, use the ref to that quiz to give to the user
    const ref = await FirestoreBackend.getQuiz(res.id)
    FirestoreBackend.assignQuizToUser(userDetails.id, res.id, ref.ref)
    let imgPath = ""
    if (imgFile !== null && imgFile !== undefined) {
      const imgSnap = await FirestoreBackend.uploadFile(userDetails.id, res.id, imgFile)
      imgPath = imgSnap.ref.fullPath
    }
    await FirestoreBackend.updateData(ref.ref, { quiz_image: imgPath });
    //after that, route over to the quizcreator for that quiz.
    history.push("/creator/" + ref.id);
  }

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const onDescChange = (event) => {
    setDesc(event.target.value)
  }

  const onImgUpld = async (event) => {
    setImgFile(event.target.files[0])
  }

  return (
    <Background>
      <br></br>
      <h1> Quiz Creator </h1>
      <Stack style={{alignItems:"center", marginTop:"50px"}}>
      <InputGroup style={{width:"50%"}} className="mb-3">
        <FormControl  aria-label="Default" onChange={onNameChange} placeholder="Quiz Name" />
      </InputGroup>
      <InputGroup style={{width:"70%"}} className="mb-3">
        <FormControl as="textarea" onChange={onDescChange} placeholder="Quiz Description" />
      </InputGroup>
      <Form.Group controlId="formFile" className="mb-3">
        Quiz Image
        <Form.Control onChange={onImgUpld} accept=".jpg, .jpeg, .png" type="file" />
      </Form.Group>
      <Button onClick={createClicked}>Create Quiz</Button>
    </Stack>
    </Background>
  );
}

export default QuizInitiator;