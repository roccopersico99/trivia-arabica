import '../App.css';
//000 React
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from "react-router-dom";
//000 Context
import { useAuthState } from "../Context/index";
//000 Database
import * as FirestoreBackend from '../services/Firestore.js'
//000 Elements
import Background from './Background.js'
import { InputGroup, FormControl, ListGroup, Modal, Stack, Spinner, Container, Image, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap'


function QuizEditor() {

  //000000000 states
  //000 editor states
  const [loading, setLoading] = useState(true)
  const [changesMade, setChangesMade] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [activeQuestionNum, setActiveQuestionNum] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState()
  const [currentQuestionTitle, setCurrentQuestionTitle] = useState("")
  const [currentQuestionChoices, setCurrentQuestionChoices] = useState([])
  const [choicesInvalid, setChoicesInvalid] = useState([])
  const [questionTitleInvalid, setQuestionTitleInvalid] = useState(false)
  const [questionTitleInvalidText, setQuestionTitleInvalidText] = useState("")
  const [publishErrorText, setPublishErrorText] = useState("")
  const [publishInvalid, setPublishInvalid] = useState(false)
  //000 quiz states
  const [quizRef, setQuizRef] = useState()
  const [quizTitle, setQuizTitle] = useState("")
  const [quizImage, setQuizImage] = useState(undefined)
  const [quizPlatformName, setQuizPlatformName] = useState("None")
  const [quizPlatformID, setQuizPlatformID] = useState(undefined)

  //000 question states
  const [questions, setQuestions] = useState([])
  const [questionImage, setQuestionImage] = useState("")
  //000 user states
  const [platforms, setPlatforms] = useState([])

  //000000000 misc consts
  const params = useParams()
  const userDetails = useAuthState()
  const history = useHistory()


  //000000000 hooks
  useEffect(async () => {

    if (userDetails.id === undefined || userDetails.id === "" || quizRef !== undefined) { return }

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

    let questionArray = await reloadQuestions()
    setActiveQuestion(questionArray[activeQuestionNum])
    setCurrentQuestionTitle(questionArray[activeQuestionNum].question_title)
    setCurrentQuestionChoices(questionArray[activeQuestionNum].question_choices)
    setQuestionImage(await FirestoreBackend.getImageURL(questionArray[activeQuestionNum].question_image))


    const quizReq = await FirestoreBackend.getQuiz(params.id);
    setQuizRef(quizReq.ref)
    const quiz = quizReq.data()

    //check if we shouldn't be here
    if (quiz.publish_state || quiz.quiz_creator !== userDetails.id) {
      history.push("/")
    }

    //set up platform state
    if (quiz.platform_id === undefined || quiz.platform_id === null) {
      setQuizPlatformID(undefined)
      setQuizPlatformName("None")
    } else {
      setQuizPlatformID(quiz.platform_id)
      setQuizPlatformName(quiz.platform_name)
    }

    //final setup steps
    setQuizTitle(quiz.quiz_title)
    setQuizImage(await FirestoreBackend.getImageURL(quiz.quiz_image))
    setLoading(false)

  }, [userDetails])

  //000000000 events
  const onImgSelected = async (event) => {
    setQuizImage(undefined)
    let imgPath = ""
    if (event.target.files[0] !== null && event.target.files[0] !== undefined) {
      const imgSnap = await FirestoreBackend.uploadFile(userDetails.id, params.id, event.target.files[0])
      imgPath = imgSnap.ref.fullPath
    }
    FirestoreBackend.updateData(quizRef, { quiz_image: imgPath });
    setQuizImage(URL.createObjectURL(event.target.files[0]))
  }

  const onImgQuestionSelected = async (event) => {
    let imgPath = ""
    if (event.target.files[0] !== null && event.target.files[0] !== undefined) {
      const imgSnap = await FirestoreBackend.uploadFile(userDetails.id, params.id + "/" + activeQuestion.number, event.target.files[0])
      imgPath = imgSnap.ref.fullPath
    }
    await FirestoreBackend.updateQuizQuestion(params.id, activeQuestion.number, {
      question_image: imgPath
    })
    setQuestionImage(URL.createObjectURL(event.target.files[0]))
  }

  const platformClicked = async (id, name) => {
    if (id === quizPlatformID) { return }
    setQuizPlatformName(name)
    setQuizPlatformID(id)
    if (id === undefined) {
      await FirestoreBackend.updateData(quizRef, { platform_id: null, platform_name: null });
    } else {
      await FirestoreBackend.updateData(quizRef, { platform_id: id, platform_name: name });
    }
  }

  const onChangeQuestionTitle = (event) => {
    setCurrentQuestionTitle(event.target.value)
    setQuestionTitleInvalid(false)
    setChangesMade(true)
  }

  const saveChangesClicked = async () => {
    const saving = await saveChanges()
    if (saving) {
      setChangesMade(false)
    }

  }

  const publishModalClicked = async () => {
    //save current question
    const saving = await saveChanges()
    //now, go through EVERY question and validate them.
    //if a question cannot be validated, note it.
    let publishable = true

    let noTitles = ""
    let noAnswers = ""
    let emptyQuestions = ""

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].question_title === "") {
        publishable = false //question at i lacks a title
        noTitles = noTitles.concat(i + 1, ", ")

      }
      let ans = false;
      let ret = false;
      for (let j = 0; j < questions[i].question_choices.length; j++) {
        if (questions[i].question_choices[j].correct) {
          ans = true;
        }
        if (questions[i].question_choices[j].text === "") {
          ret = true
        }
      }
      if (!ans) {
        publishable = false //this question doesn't have an answer
        noAnswers = noAnswers.concat(i + 1, ", ")
      }
      if (ret) {
        publishable = false //this question has a blank answer
        emptyQuestions = emptyQuestions.concat(i + 1, ", ")
      }

    }
    if (!publishable) {
      let errText = "There are problems with your quiz:\n"
      if (noTitles !== "") {
        errText = errText + "There is no question text for questions: " + noTitles.slice(0, -2) + "\n"
      }
      if (noAnswers !== "") {
        errText = errText + "There is no correct answer selected for questions: " + noAnswers.slice(0, -2) + "\n"
      }
      if (emptyQuestions !== "") {
        errText = errText + "There are empty answers in questions: " + emptyQuestions.slice(0, -2)
      }
      setPublishErrorText(errText)
      setPublishInvalid(true)
    } else {
      //publishable! go do it!
      await FirestoreBackend.publishQuiz(params.id);
      history.push("/preview/" + params.id)
    }

  }
  const answerChanged = (index) => {
    let newChoices = [...currentQuestionChoices]
    for (let i = 0; i < newChoices.length; i++) {
      if (i === index) {
        newChoices[i].correct = true
      } else {
        newChoices[i].correct = false
      }
    }
    setCurrentQuestionChoices(newChoices)
    setQuestionTitleInvalid(false)
    setChangesMade(true)
  }

  const choiceChanged = (event, index) => {
    let newChoices = [...currentQuestionChoices]
    newChoices[index].text = event.target.value
    setCurrentQuestionChoices(newChoices)
    setChoicesInvalid([])
    setChangesMade(true)
  }

  const addChoice = () => {
    let newChoices = [...currentQuestionChoices]
    newChoices.push({ text: "", correct: false })
    setCurrentQuestionChoices(newChoices)
    setChoicesInvalid([])
    setChangesMade(true)
  }

  const removeChoice = () => {
    let newChoices = [...currentQuestionChoices]
    newChoices.pop()
    setCurrentQuestionChoices(newChoices)
    setChoicesInvalid([])
    setChangesMade(true)
  }

  const addQuestionClicked = async () => {
    if (changesMade) {
      const saving = await saveChangesNoReload()
      if (!saving) { return }
    }
    let newQuestions = await reloadQuestions()
    let blank = {
      question_title: "",
      num_choices: 4,
      number: newQuestions[newQuestions.length - 1].number + 1,
      question_choices: [
        { correct: true, text: "" },
        { correct: false, text: "" },
        { correct: false, text: "" },
        { correct: false, text: "" }
      ],
      question_image: ""
    }
    newQuestions.push(blank)
    await FirestoreBackend.createQuizQuestion(params.id, blank.number, blank)
    setQuestions(newQuestions)
    setChangesMade(true)
    setActiveQuestion(blank)
    setQuestionImage("")
    setActiveQuestionNum(newQuestions.length - 1)
    setCurrentQuestionTitle(blank.question_title)
    setCurrentQuestionChoices(blank.question_choices)
  }

  const removeQuestionClicked = async () => {
    let whereToGo = activeQuestionNum
    if (whereToGo !== 0) {
      whereToGo = whereToGo - 1
    }
    FirestoreBackend.deleteQuestion(params.id, activeQuestion.number + "")
    await reloadQuestions()
    setActiveQuestion(questions[whereToGo])
    setActiveQuestionNum(whereToGo)
    setCurrentQuestionTitle(questions[whereToGo].question_title)
    setCurrentQuestionChoices(questions[whereToGo].question_choices)
    setQuestionImage(await FirestoreBackend.getImageURL(questions[whereToGo].question_image))
    setChangesMade(false)
    setChoicesInvalid([])
    setQuestionTitleInvalid(false)
  }

  const selectedQuestion = async (index) => {
    if (changesMade) {
      const saving = await saveChanges()
      if (!saving) { return }
      setChangesMade(false)
    }
    setActiveQuestion(questions[index])
    setActiveQuestionNum(index)
    setCurrentQuestionTitle(questions[index].question_title)
    setQuestionImage(await FirestoreBackend.getImageURL(questions[index].question_image))
    setCurrentQuestionChoices(questions[index].question_choices)
  }

  //000000000 functions
  const saveChanges = async () => {
    if (!validate()) {
      return false
    }
    //save updated question
    await FirestoreBackend.updateQuizQuestion(params.id, activeQuestion.number, {
      question_title: currentQuestionTitle,
      question_choices: currentQuestionChoices,
      num_choices: currentQuestionChoices.length
    })

    //repopulate questions
    await reloadQuestions()

    return true
  }

  const saveChangesNoReload = async () => {
    if (!validate()) {
      return false
    }
    //save updated question
    await FirestoreBackend.updateQuizQuestion(params.id, activeQuestion.number, {
      question_title: currentQuestionTitle,
      question_choices: currentQuestionChoices,
      num_choices: currentQuestionChoices.length
    })
    //repopulate questions
    return true
  }
  const reloadQuestions = async () => {
    const quests = await FirestoreBackend.getQuizQuestions(params.id);
    let questionArray = []
    quests.forEach(quest => {
      questionArray.push(quest.data())
    })
    setQuestions(questionArray)
    return questionArray
  }

  const validate = () => {
    if (currentQuestionTitle === "") {
      setQuestionTitleInvalid(true)
      setQuestionTitleInvalidText("Your question must be a question!")
      return false
    }
    let ans = false;
    let ret = false;
    let validAr = []
    for (let i = 0; i < currentQuestionChoices.length; i++) {
      if (currentQuestionChoices[i].correct) {
        ans = true;
      }
      if (currentQuestionChoices[i].text === "") {
        validAr.push(true)
        ret = true
      } else {
        validAr.push(false)
      }
    }
    setChoicesInvalid(validAr)
    if (!ans) {
      setQuestionTitleInvalid(true)
      setQuestionTitleInvalidText("Your question must have an answer!")
      return false
    }
    if (ret) {
      return false
    }
    return true
  }


  //000000000 html
  if (userDetails.id === "" || loading) {
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
        <br/>
        <h2> Currently Editing: {quizTitle} </h2>
        { (quizImage !== undefined && quizImage !== "") &&
          <Image
          style={{ width: "250px", backgroundSize: "cover" }}
          src={quizImage}
          alt="Quiz Image"
        ></Image>
        }
        {
          (quizImage === "") &&
          <h4> No Image Selected for Quiz </h4>
        }
        {
          (quizImage === undefined) &&
          <Spinner
            style={{ marginTop: "100px" }}
            animation="border"
            role="status"
          >
            <span className="visually-hidden">Loading Quiz Image</span>
          </Spinner>
        }
        <Form.Group controlId="formFile" className="mb-3" style={{ margin: "auto", width: "fit-content" }}>
          Quiz Image
          <Form.Control onChange={onImgSelected} accept=".jpg, .jpeg, .png" type="file" />
        </Form.Group>
        <p style={{marginBottom:"0px"}}> Dedicate to platform </p>
        <DropdownButton variant="secondary" id="dropdown-basic-button" title={quizPlatformName}>
          <Dropdown.Item onClick={() => platformClicked(undefined, "None")} eventKey={"None"}>None</Dropdown.Item>
          {platforms.map((platform, index) => (
            <Dropdown.Item onClick={() => platformClicked(platform.id, platform.name)} eventKey={platform.id}>{platform.name}</Dropdown.Item>
          ))}
        </DropdownButton>
        <br/>
        <Stack style={{width: "fit-content", margin:"auto"}} gap={1}>
          <Button disabled={!changesMade} onClick={saveChangesClicked}> Save Changes </Button>
          <Button variant="success" onClick={() => setModalShow(true)}>Publish Quiz</Button>
        </Stack>
        <hr/>

        <Stack gap={3} direction="horizontal">
          <Stack gap={3} style={{ width: "40%" }}>
            <ListGroup as="ol" numbered>
              {questions.map((question, index) => {
                return (<ListGroup.Item key={index} onClick={() => selectedQuestion(index)} className="list-group-item" as="li" active={activeQuestionNum === index} action>{question.question_title}</ListGroup.Item>)
              })}
            </ListGroup>
            <Stack direction="horizontal" gap={4} style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Button variant="outline-success" onClick={addQuestionClicked}>Add Question</Button>
              <Button variant="outline-danger" disabled={questions.length === 1} onClick={removeQuestionClicked}>Remove Question</Button>
            </Stack>
          </Stack>
          <Stack style={{ borderRight:"1px solid #c8c9ca", width: "2%" }}></Stack>
          <Stack gap={2} style={{ width: "70%" }}>
            <InputGroup style={{position:"relative"}} hasValidation className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default"> Question Text </InputGroup.Text>
              <FormControl aria-label="Default" isInvalid={questionTitleInvalid} onChange={onChangeQuestionTitle} value={currentQuestionTitle} placeholder="Question Text" />
              <Form.Control.Feedback style={{position:"absolute", bottom:"-20px", left:"0px"}} type="invalid">{questionTitleInvalidText}</Form.Control.Feedback>
            </InputGroup>
            { (questionImage !== undefined && questionImage !== "") &&
              <Image
              style={{ margin:"auto", width: "200px", backgroundSize: "cover" }}
              src={questionImage}
              alt="Question Image"
            ></Image>
            }
            {
              (questionImage === "" || questionImage === undefined) &&
              <h5> No Image Selected for Question </h5>
            }
            <Form.Group controlId="formFile" className="mb-3" style={{ margin: "auto", width: "fit-content" }}>
              Question Image
              <Form.Control onChange={onImgQuestionSelected} accept=".jpg, .jpeg, .png" type="file" />
            </Form.Group>
            {currentQuestionChoices.map((choice, index) => {
              return (
              <InputGroup style={{position:"relative"}} hasValidation className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default"> Choice {index+1} </InputGroup.Text>
                <FormControl isInvalid={choicesInvalid[index]} id={index+1} aria-label="Default" value={choice.text} onChange={(event) => choiceChanged(event, index)} placeholder={"Choice " + (index+1)} />
                <InputGroup.Text id="inputGroup-sizing-default"> Answer </InputGroup.Text>
                <InputGroup.Radio id={index+1} name="answer" onChange={() => answerChanged(index)} checked={choice.correct} aria-label="Text input with radio button" />
                <Form.Control.Feedback style={{position:"absolute", bottom:"-20px", left:"0px"}} type="invalid">Choice must not be left blank!</Form.Control.Feedback>
              </InputGroup>
              )
            })}
            <Stack direction="horizontal" gap={4} style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Button variant="outline-success" onClick={addChoice} disabled={currentQuestionChoices.length === 8}>Add Answer Choice</Button>
              <Button variant="outline-danger" onClick={removeChoice} disabled={currentQuestionChoices.length === 2}>Remove Answer Choice</Button>
            </Stack>
          </Stack>
        </Stack>

      </Container>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        centered
        onExited={() => {
          setPublishInvalid(false)
          setPublishErrorText("")
        }}
        >
        <Modal.Header closeButton>
          <Modal.Title>Publish Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>After you publish a quiz, you will no longer be able to edit it.</p>
          {publishInvalid &&
              publishErrorText.split('\n').map((i, index) => {
                if (index === 0) {
                  return (<p style={{fontWeight:"bold", color:"red"}}> {i} </p>)
                }else {
                  return (<p style={{marginBottom:"0px", fontWeight:"bold", color:"red"}}> {i} </p>)
                }

              })
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={publishModalClicked} disabled={publishInvalid} variant="warning">Create</Button>
          <Button onClick={() => setModalShow(false)} variant="secondary"> Cancel </Button>
        </Modal.Footer>
      </Modal>

    </Background>
  );

}

export default QuizEditor;