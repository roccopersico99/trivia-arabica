import '../App.css';
import React, { useState } from 'react'
import { Container, Button, ListGroup, Stack, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import * as FirestoreBackend from '../services/Firestore.js'
import Background from './Background.js'

function QuizCreator() {

  const [refreshKey, setRefreshKey] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);

  const [loading, setLoading] = useState(false) //janky: while loading elements, setting state will retrigger loading of the elements again... so we use this state to stop that

  const [choices, setChoices] = useState([]);
  const [answers, setAnswers] = useState([]); //boolean values for if a choice is correct or not

  const [questionNames, setQuestionNames] = useState([]); //non-updating array to hold question names as to not dynamically update them before saving


  const setupQuestionNames = (quests) => { //specifically grabs question names from the quizQuestions array and updates them.
    let names = Array.from(quests, x => x.question_title)
    setQuestionNames(names)
  }

  const getQuiz = async () => {
    if (loading) {
      return;
    }
    setLoading(true)
    const quiz_query = FirestoreBackend.getQuiz('samplequiz');
    quiz_query.then((query_snapshot) => {
      setQuizTitle(query_snapshot.data().quiz_title);
    });

    const question_query = await FirestoreBackend.getQuizQuestions('samplequiz');
    let quizQuests = [];
    question_query.docs.forEach((doc) => {
      quizQuests.push(doc.data());
    });
    setQuizQuestions(quizQuests);
    setupQuestionNames(quizQuests);
    let qz = quizQuests[activeQuestion]
    let chs = [qz.question_choices.choice1.text, qz.question_choices.choice2.text, qz.question_choices.choice3.text, qz.question_choices.choice4.text]
    setChoices(chs)
    let ans = [qz.question_choices.choice1.correct, qz.question_choices.choice2.correct, qz.question_choices.choice3.correct, qz.question_choices.choice4.correct]
    setAnswers(ans)
    setLoading(false)
  }

  const setupCreator = async () => {
    getQuiz();
  }

  function setActive(index) {
    setActiveQuestion(index)
    let qz = quizQuestions[index]
    let chs = [qz.question_choices.choice1.text, qz.question_choices.choice2.text, qz.question_choices.choice3.text, qz.question_choices.choice4.text]
    setChoices(chs)
    let ans = [qz.question_choices.choice1.correct, qz.question_choices.choice2.correct, qz.question_choices.choice3.correct, qz.question_choices.choice4.correct]
    setAnswers(ans)
  }

  function isActive(n) {
    if (activeQuestion === n)
      return true;
    return false;
  }

  function handleAddQuestion() {
    console.log("user clicked add question..." + activeQuestion)
    let qz = quizQuestions
    qz.push({
      question_title: "",
      question_choices: {
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
      }
    })
    setQuizQuestions(qz)
    setupQuestionNames(qz)
    setRefreshKey(refreshKey + 1)
  }

  function handleRemoveQuestion() {
    console.log("user clicked remove question...")

  }

  const onChangeQuestionText = (event) => {
    let updated = [...quizQuestions]
    updated[activeQuestion].question_title = event.target.value;
    setQuizQuestions(updated)
  }

  function onChangeQuestionChoice1(event) {
    setChoices([
      event.target.value, choices[1], choices[2], choices[3]
    ])
  }

  function onChangeQuestionChoice2(event) {
    setChoices([choices[0],
      event.target.value, choices[2], choices[3]
    ])
  }

  function onChangeQuestionChoice3(event) {
    setChoices([choices[0], choices[1],
      event.target.value, choices[3]
    ])
  }

  function onChangeQuestionChoice4(event) {
    setChoices([choices[0], choices[1], choices[2],
      event.target.value
    ])
  }

  function onChangeAnswer1(event) {
    setAnswers([true, false, false, false])
  }

  function onChangeAnswer2(event) {
    setAnswers([false, true, false, false])
  }

  function onChangeAnswer3(event) {
    setAnswers([false, false, true, false])
  }

  function onChangeAnswer4(event) {
    setAnswers([false, false, false, true])
  }

  function saveClicked() {
    //re-build question from choices state, answers state, and questionText state
    let chs = {
      choice1: {
        correct: answers[0],
        text: choices[0],
      },
      choice2: {
        correct: answers[1],
        text: choices[1],
      },
      choice3: {
        correct: answers[2],
        text: choices[2],
      },
      choice4: {
        correct: answers[3],
        text: choices[3],
      }
    }

    FirestoreBackend.setQuizQuestion("samplequiz", "" + (activeQuestion + 1), "", quizQuestions[activeQuestion].question_title, chs)
    setupCreator()
  }

  if (quizQuestions.length === 0) {
    setupCreator()
    return (
      <Background>
          <Spinner style={{marginTop:"100px"}} animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Background>
    )
  }
  return (
    <Background>
            <Container>
                <h1>Welcome to the Quiz Creator!</h1>
                <h2> Currently Editing: {quizTitle}</h2>
                <br></br>
                <Stack direction="horizontal">
                    <Stack style={{width:"40%"}}>
                        <Stack direction="horizontal" gap={4} style={{margin:"auto"}}>
                            <Button variant="outline-success" onClick={handleAddQuestion}>Add Question</Button>
                            <Button variant="outline-danger" onClick={handleRemoveQuestion}>Remove Question</Button>
                        </Stack>
                        <ListGroup as="ol" numbered>
                            {questionNames.map((quest, index) => {
                              return (  <ListGroup.Item key={index} className="list-group-item" as="li" active={isActive(index)} action onClick={() => setActive(index)}>{quest}</ListGroup.Item>)
                            })}
                        </ListGroup>
                    </Stack>
                    <Stack style={{width:"2%"}}></Stack>
                    <Stack gap={3} style={{width:"70%"}}>
                        <InputGroup className="mb-3">
                          <InputGroup.Text id="inputGroup-sizing-default"> Question Text </InputGroup.Text>
                          <FormControl aria-label="Default" onChange={onChangeQuestionText} value={quizQuestions[activeQuestion].question_title} placeholder="Question Text"  />
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroup.Text id="inputGroup-sizing-default"> Choice 1 </InputGroup.Text>
                          <FormControl aria-label="Default" onChange={onChangeQuestionChoice1} value={choices[0]} placeholder="Choice 1" />
                          <InputGroup.Text id="inputGroup-sizing-default"> Answer </InputGroup.Text>
                          <InputGroup.Radio name="answer" onChange={onChangeAnswer1} checked={answers[0]} aria-label="Text input with radio button"/>
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroup.Text id="inputGroup-sizing-default"> Choice 2 </InputGroup.Text>
                          <FormControl aria-label="Default" onChange={onChangeQuestionChoice2} value={choices[1]} placeholder="Choice 2" />
                          <InputGroup.Text id="inputGroup-sizing-default"> Answer </InputGroup.Text>
                          <InputGroup.Radio name="answer" onChange={onChangeAnswer2} checked={answers[1]} aria-label="Text input with radio button"/>
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroup.Text id="inputGroup-sizing-default"> Choice 3 </InputGroup.Text>
                          <FormControl aria-label="Default" onChange={onChangeQuestionChoice3} value={choices[2]} placeholder="Choice 3" />
                          <InputGroup.Text id="inputGroup-sizing-default"> Answer </InputGroup.Text>
                          <InputGroup.Radio name="answer" onChange={onChangeAnswer3} checked={answers[2]} aria-label="Text input with radio button"/>
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroup.Text id="inputGroup-sizing-default"> Choice 4 </InputGroup.Text>
                          <FormControl aria-label="Default" onChange={onChangeQuestionChoice4} value={choices[3]} placeholder="Choice 4" />
                          <InputGroup.Text id="inputGroup-sizing-default"> Answer </InputGroup.Text>
                          <InputGroup.Radio name="answer" onChange={onChangeAnswer4} checked={answers[3]} aria-label="Text input with radio button"/>
                        </InputGroup>
                        <div className="mb-2">
                          <Button onClick={saveClicked}>Save Changes</Button>
                        </div>
                    </Stack>
                </Stack>
            </Container>
        </Background>
  );
}

export default QuizCreator;