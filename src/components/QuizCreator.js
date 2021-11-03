import '../App.css';
import React, { useState } from 'react'
import { Container, Row, Col, Button, ListGroup, Stack, Form } from 'react-bootstrap';
import Background from './Background.js'

function QuizCreator() {
    const [activeQuestion, setActiveQuestion] = useState(0);

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

    return (
        <Background>
            Welcome to the Quiz Creator!
            <Container>
                <Stack direction="horizontal">
                    <Stack gap={3}>
                        <h3>Left Stack</h3>
                        <Stack direction="horizontal" gap={5}>
                            <Button variant="outline-success" onClick={handleAddQuestion}>Add Question</Button>
                            <Button variant="outline-danger" onClick={handleRemoveQuestion}>Remove Question</Button>
                        </Stack>
                        <ListGroup as="ol" numbered className="w-75">
                                <ListGroup.Item as="li" active={isActive(0)} action onClick={() => setActiveQuestion(0)}>How many iron ingots are require...</ListGroup.Item>
                                <ListGroup.Item as="li" active={isActive(1)} action onClick={() => setActiveQuestion(1)}>How much coal is needed to smelt...</ListGroup.Item>
                                <ListGroup.Item as="li" active={isActive(2)} action onClick={() => setActiveQuestion(2)}>On what year did Minecraft first of...</ListGroup.Item>
                                <ListGroup.Item as="li" active={isActive(3)} action onClick={() => setActiveQuestion(3)}>Which food item restores the mos...</ListGroup.Item>
                        </ListGroup>
                    </Stack>
                    <Stack gap={3}>
                        <h3>Right Stack</h3>
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