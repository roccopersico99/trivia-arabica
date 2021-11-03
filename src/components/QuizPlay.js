import '../App.css';
import React, { useState } from 'react'
import Background from './Background.js'
import { default as questionImage } from "../shark_nose.jpg";
import { Stack, Image, Button, ListGroup } from 'react-bootstrap';

function QuizPlay() {
    const [selectedChoice, setSelectedChoice] = useState(-1);

    function isActive(n) {
        if (selectedChoice === n)
            return true;
        return false;
    }

    function handleSubmitChoice() {
        console.log("clicked submit choice...")
        if(selectedChoice === 0){
            console.log("Correct!")
        }
        else{
            console.log("Incorrect!")
        }
        setSelectedChoice(-1)

    }

    return (
        <Background>
           <Stack>
                <br></br>
                <h1>Shark Quiz #69</h1>
                <h3>Time remaining - 03:15</h3>
                <h2>Question 1/5</h2>
                <br></br>
                <Image
                    style={{
                        display: "block",
                        margin: "auto",
                        width: "50%",
                        height: "300px",
                    }}
                    src={questionImage}
                    alt="Profile Image">
                </Image>
                <br></br>
                <h4>How long do sharks noses be?</h4>
                <br></br>
                <p>Multiple Choice (Select One)</p>
                <Stack>
                    <ListGroup as="ol" style={{width:"75%", margin:"auto"}}>
                        <ListGroup.Item as="li" active={isActive(0)} action onClick={() => setSelectedChoice(0)}>10 inches</ListGroup.Item>
                        <ListGroup.Item as="li" active={isActive(1)} action onClick={() => setSelectedChoice(1)}>2 feet</ListGroup.Item>
                        <ListGroup.Item as="li" active={isActive(2)} action onClick={() => setSelectedChoice(2)}>10 yards</ListGroup.Item>
                        <ListGroup.Item as="li" active={isActive(3)} action onClick={() => setSelectedChoice(3)}>3 miles</ListGroup.Item>
                    </ListGroup>
                </Stack>
                <br></br>
                <Button style={{width:"15%", margin:"auto"}} variant="success" onClick={handleSubmitChoice}>Submit</Button>
           </Stack>
        </Background>
    );
}

export default QuizPlay;