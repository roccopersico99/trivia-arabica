import '../App.css';
import React, { useState } from 'react'
import { Container, Button, ListGroup, Stack, Form, Spinner } from 'react-bootstrap';
import * as FirestoreBackend from '../services/Firestore.js'
import Background from './Background.js'

function QuizCreator() {
  const [activeQuestion, setActiveQuestion] = useState(0);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);

  const [loaded, setLoaded] = useState(false) //this is to denote if we have loaded all of the elements
  const [loading, setLoading] = useState(false) //janky: while loading elements, setting state will retrigger loading of the elements again... so we use this state to stop that

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

    setLoading(false)
  }

  const setupCreator = async () => {
    getQuiz();
    setLoaded(true)
  }

  function isActive(n) {
    if (activeQuestion === n)
      return true;
    return false;
  }

  function handleAddQuestion() {
    console.log("user clicked add question...")
  }

  function handleRemoveQuestion() {
    console.log("user clicked remove question...")

  }


  const onSubmit = (e) => {
    e.preventDefault();
    const ele = e.target.elements;
    ele.questionNum.value = "";
    ele.formName.value = "";
    ele.choice1[0].checked = false;
    ele.choice1[1].value = "";
    ele.choice2[0].checked = false;
    ele.choice2[1].value = "";
    ele.choice3[0].checked = false;
    ele.choice3[1].value = "";
    ele.choice4[0].checked = false;
    ele.choice4[1].value = "";
  };
  if (!loaded) {
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
                            {quizQuestions.map((quest, index) => {
                              return (  <ListGroup.Item key={index} className="list-group-item" as="li" active={isActive(index)} action onClick={() => setActiveQuestion(index)}>{quest.question_title}</ListGroup.Item>)

                            })}
                          {/*
                                <ListGroup.Item className="list-group-item" as="li" active={isActive(0)} action onClick={() => setActiveQuestion(0)}>How many iron ingots are required to craft a full set of armor?</ListGroup.Item>
                                <ListGroup.Item className="list-group-item" as="li" active={isActive(1)} action onClick={() => setActiveQuestion(1)}>How much coal is needed to smelt a full stack of iron ingots?</ListGroup.Item>
                                <ListGroup.Item className="list-group-item" as="li" active={isActive(2)} action onClick={() => setActiveQuestion(2)}>On what year did Minecraft first officially release?</ListGroup.Item>
                                <ListGroup.Item className="list-group-item" as="li" active={isActive(3)} action onClick={() => setActiveQuestion(3)}>Which food item restores the most hunger points?</ListGroup.Item>
                          */}
                        </ListGroup>
                    </Stack>
                    <Stack style={{width:"2%"}}></Stack>
                    <Stack gap={3} style={{width:"58%"}}>
                        <Form onSubmit={(e) => onSubmit(e)}>
                            <Form.Group controlId="formName">
                                <Form.Control type="text" placeholder="Question Text" />
                            </Form.Group>
                            <Form.Group controlId="questionNum">
                                <Form.Control type="text" placeholder="Question #" />
                            </Form.Group>
                            <Form.Group controlId="choice1">
                                <Form.Check aria-label="correct1" />
                                <Form.Control type="text" placeholder="Choice 1" />
                            </Form.Group>
                            <Form.Group controlId="choice2">
                                <Form.Check aria-label="correct2" />
                                <Form.Control type="text" placeholder="Choice 2" />
                            </Form.Group>
                            <Form.Group controlId="choice3">
                                <Form.Check aria-label="correct3" />
                                <Form.Control type="text" placeholder="Choice 3" />
                            </Form.Group>
                            <Form.Group controlId="choice4">
                                <Form.Check aria-label="correct4" />
                                <Form.Control type="text" placeholder="Choice 4" />
                            </Form.Group>
                            <Button type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Stack>
                </Stack>
            </Container>
        </Background>
  );
}

export default QuizCreator;