import '../App.css';
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { useAuthState } from "../Context/index";
import { DropdownButton, Dropdown, Container, Button, ListGroup, Stack, Spinner, InputGroup, Form, FormControl, Image } from 'react-bootstrap';
import * as FirestoreBackend from '../services/Firestore.js'
import Background from './Background.js'
import { text } from 'dom-helpers';

function QuizCreator() {
  const params = useParams();
  const userDetails = useAuthState();
  const history = useHistory();

  const [refreshKey, setRefreshKey] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const [quizRef, setQuizRef] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizImage, setQuizImage] = useState("")
  const [quizImageChanged, setQuizImageChanged] = useState(false);
  const [imgFile, setImgFile] = useState(null)
  const [quizPlatformName, setQuizPlatformName] = useState("None")
  const [quizPlatformID, setQuizPlatformID] = useState()
  const [platforms, setPlatforms] = useState([])

  const [quizQuestions, setQuizQuestions] = useState([]);

  const [loading, setLoading] = useState(false) //janky: while loading elements, setting state will retrigger loading of the elements again... so we use this state to stop that

  const [max, setMax] = useState(0) //keep track of max doc id

  const getQuiz = async (removed) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const quiz_query = FirestoreBackend.getQuiz(params.id);
    quiz_query.then(async (query_snapshot) => {
      if (query_snapshot.data().publish_state) {
        history.push("/");
      }
      if (query_snapshot.data().platform_id === undefined || query_snapshot.data().platform_id === null) {
        setQuizPlatformID(undefined)
        setQuizPlatformName("None")
      } else {
        setQuizPlatformID(query_snapshot.data().platform_id)
        setQuizPlatformName(query_snapshot.data().platform_name)
      }
      setQuizRef(query_snapshot.ref);
      setQuizTitle(query_snapshot.data().quiz_title);
      setQuizImage(await FirestoreBackend.getImageURL(query_snapshot.data().quiz_image));
    });

    const question_query = await FirestoreBackend.getQuizQuestions(params.id);
    let quizQuests = [];
    question_query.docs.forEach((doc) => {
      quizQuests.push(doc.data());
      if (max < parseInt(doc.id)) {
        setMax(parseInt(doc.id) + 1)
      }
    });
    setQuizQuestions(quizQuests);
    let qz;
    if (removed) {
      qz = quizQuests[activeQuestion - 1]
    } else {
      qz = quizQuests[activeQuestion]
    }
    setLoading(false)
  }

  const setupCreator = async (removed) => {
    getQuiz(removed);
  }

  function setActive(index) {
    setActiveQuestion(index)
  }

  function isActive(n) {
    if (activeQuestion === n)
      return true;
    return false;
  }

  const platformClicked = (id, name) => {
    setQuizPlatformName(name)
    setQuizPlatformID(id)
  }

  useEffect(async () => {
    if (userDetails.id === undefined || userDetails.id === "") { return }
    const plats = await FirestoreBackend.getUserPlatforms(userDetails.id)
    let platformArray = []
    plats.forEach(pform => {
      let platform = {
        name: pform.data().name,
        id: pform.id
      }
      platformArray.push(platform)
    })
    setPlatforms(platformArray)
  }, [userDetails])

  function handleAddQuestion() {
    let qz = quizQuestions
    let choices = [{ text: "", correct: true }]; //preload first question to be true
    for (let i = 1; i < 4; i++) {
      choices.push({ text: "", correct: false });
    }
    qz.push({
      question_title: "",
      number: max,
      question_choices: choices,
      num_choices: 4
    })
    setMax(max + 1)
    setQuizQuestions(qz)
    setRefreshKey(refreshKey + 1)
  }

  function handleRemoveQuestion() {
    if (quizQuestions.length === 1) {
      return
    }
    FirestoreBackend.deleteQuestion(params.id, "" + quizQuestions[activeQuestion].number)
    setActiveQuestion(activeQuestion - 1)
    setupCreator(true)
    setRefreshKey(refreshKey + 1)
  }

  function handleAddChoice() {
    let updated = [...quizQuestions]
    updated[activeQuestion].question_choices[updated[activeQuestion].num_choices] = {
      correct: false,
      text: ""
    };
    updated[activeQuestion].num_choices += 1;
    setQuizQuestions(updated)
  }

  function handleRemoveChoice() {
    let updated = [...quizQuestions]
    let choicepopped = updated[activeQuestion].question_choices.pop()
    if (choicepopped.correct) {
      updated[activeQuestion].question_choices[0].correct = true;
    }
    updated[activeQuestion].num_choices -= 1;
    setQuizQuestions(updated)
  }

  const onChangeQuestionText = (event) => {
    let updated = [...quizQuestions]
    updated[activeQuestion].question_title = event.target.value;
    setQuizQuestions(updated)
  }

  function onChangeQuestionChoice(event) {
    let updated = [...quizQuestions]
    updated[activeQuestion].question_choices[event.target.id - 1].text = event.target.value;
    setQuizQuestions(updated)
  }

  function onChangeAnswer(event) {
    let updated = [...quizQuestions]
    for (let i = 0; i < updated[activeQuestion].num_choices; i++) {
      if (i == event.target.id - 1)
        updated[activeQuestion].question_choices[i].correct = true;
      else
        updated[activeQuestion].question_choices[i].correct = false;
    }
    console.log(updated)
    setQuizQuestions(updated)
  }

  const onImgUpld = async (event) => {
    setQuizImageChanged(true);
    setImgFile(event.target.files[0])
  }

  async function saveClicked() {
    //re-build question from choices state, answers state, and questionText state
    for (let x = 0; x < quizQuestions.length; x++) {
      let chs = [];
      for (let i = 0; i < quizQuestions[x].question_choices.length; i++) {
        chs[i] = {
          correct: quizQuestions[x].question_choices[i].correct,
          text: quizQuestions[x].question_choices[i].text
        }
      }

      let imgPath = ""
      if (imgFile !== null && imgFile !== undefined) {
        const imgSnap = await FirestoreBackend.uploadFile(userDetails.id, params.id, imgFile)
        imgPath = imgSnap.ref.fullPath
      }

      if (quizImageChanged) {
        await FirestoreBackend.updateData(quizRef, { quiz_image: imgPath });
      }

      FirestoreBackend.setQuizQuestion(params.id, "" + (quizQuestions[x].number), "", quizQuestions[x].question_title, chs)
    }
    if (quizPlatformID === undefined) {
      await FirestoreBackend.updateData(quizRef, { platform_id: null, platform_name: null });
    } else {
      await FirestoreBackend.updateData(quizRef, { platform_id: quizPlatformID, platform_name: quizPlatformName });
    }

    setupCreator(false)
  }

  async function publish() {
    //todo check there is at least one(maybe more for minimum?) question
    //todo check that all questions have question text and choices filled in
    await FirestoreBackend.publishQuiz(params.id);
    window.location.href = ('/preview/' + params.id);
  }

  if (quizQuestions.length === 0) {
    setupCreator(false)
    return (
      <Background>
        <Spinner style={{ marginTop: "100px" }} animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Background>
    )
  }
  let inputgroup = [];
  inputgroup.push((
    <InputGroup className="mb-3">
      <InputGroup.Text id="inputGroup-sizing-default"> Question Text </InputGroup.Text>
      <FormControl aria-label="Default" onChange={onChangeQuestionText} value={quizQuestions[activeQuestion].question_title} placeholder="Question Text" />
    </InputGroup>
  ))
  for (let i = 0; i < quizQuestions[activeQuestion].num_choices; i++) {
    inputgroup.push((
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default"> Choice {i+1} </InputGroup.Text>
        <FormControl id={i+1} aria-label="Default" onChange={onChangeQuestionChoice} value={quizQuestions[activeQuestion].question_choices[i].text} placeholder={"Choice " + (i+1)} />
        <InputGroup.Text id="inputGroup-sizing-default"> Answer </InputGroup.Text>
        <InputGroup.Radio id={i+1} name="answer" onChange={onChangeAnswer} checked={quizQuestions[activeQuestion].question_choices[i].correct} aria-label="Text input with radio button" />
      </InputGroup>
    ))
  }
  inputgroup.push((
    <Stack direction="horizontal" gap={4} style={{ marginLeft: "auto", marginRight: "auto" }}>
      <Button variant="outline-success" onClick={handleAddChoice} disabled={quizQuestions[activeQuestion].num_choices === 8}>Add Answer Choice</Button>
      <Button variant="outline-danger" onClick={handleRemoveChoice} disabled={quizQuestions[activeQuestion].num_choices === 2}>Remove Answer Choice</Button>
    </Stack>
  ))
  return (
    <Background>
      <Container>
        <br></br>
        <h2> Currently Editing: {quizTitle}</h2>
        <Image
          style={{ width: "250px", backgroundSize: "cover" }}
          src={quizImage}
          alt="Quiz Image"
        ></Image>
        <Form.Group controlId="formFile" className="mb-3" style={{ margin: "auto", width: "25%" }}>
          Quiz Image
          <Form.Control onChange={onImgUpld} accept=".jpg, .jpeg, .png" type="file" />
        </Form.Group>
        <br/>
        <p style={{marginBottom:"0px"}}> Dedicate to platform </p>
        <DropdownButton variant="secondary" id="dropdown-basic-button" title={quizPlatformName}>
          <Dropdown.Item onClick={() => platformClicked(undefined, "None")} eventKey={"None"}>None</Dropdown.Item>
          {platforms.map((platform, index) => (
            <Dropdown.Item onClick={() => platformClicked(platform.id, platform.name)} eventKey={platform.id}>{platform.name}</Dropdown.Item>
          ))}
        </DropdownButton>
        <br/>
        <div className="mb-2">
          <Button onClick={saveClicked}>Save Changes</Button>
          <Button onClick={publish} variant="success">Publish Quiz</Button>
        </div>
        <hr></hr>
        <Stack direction="horizontal">
          <Stack gap={3} style={{ width: "40%" }}>
            <ListGroup as="ol" numbered>
              {quizQuestions.map((question, index) => {
                return (<ListGroup.Item key={index} className="list-group-item" as="li" active={isActive(index)} action onClick={() => setActive(index)}>{question.question_title}</ListGroup.Item>)
              })}
            </ListGroup>
            <Stack direction="horizontal" gap={4} style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Button variant="outline-success" onClick={handleAddQuestion}>Add Question</Button>
              <Button variant="outline-danger" onClick={handleRemoveQuestion}>Remove Question</Button>
            </Stack>
          </Stack>
          <Stack style={{ width: "2%" }}></Stack>
          <Stack gap={2} style={{ width: "70%" }}>
            {inputgroup}
          </Stack>
        </Stack>
      </Container>
    </Background>
  );
}

export default QuizCreator;