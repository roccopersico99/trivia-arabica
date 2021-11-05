import '../App.css';
import React, { useState } from 'react'
import Background from './Background.js'
import { useParams } from "react-router-dom";
import { default as defQuestionImage } from "../shark_nose.jpg";
import { Stack, Image, Button, ListGroup, Spinner } from 'react-bootstrap';
import * as FirestoreBackend from '../services/Firestore.js'

function QuizPlay() {
    const params = useParams();
    const [currQuestionNum, setCurrQuestionNum] = useState(1);
    const [selectedChoice, setSelectedChoice] = useState(-1);
    const [numCorrect, setNumCorrect] = useState(0);

    const [quizTitle, setQuizTitle] = useState("");
    const [quizQuestions, setQuizQuestions] = useState([]);

    const [questionNames, setQuestionNames] = useState([]);

    const [loading, setLoading] = useState(false) //janky: while loading elements, setting state will retrigger loading of the elements again... so we use this state to stop that

    const [questionText, setQuestionText] = useState("")
    const [questionImage, setQuestionImage] = useState(defQuestionImage)
    const [choices, setChoices] = useState([]);
    const [answers, setAnswers] = useState([]); //boolean values for if a choice is correct or not

    const setupQuestionNames = (quests) => { //specifically grabs question names from the quizQuestions array and updates them.
        let names = Array.from(quests, x => x.question_title)
        setQuestionNames(names)
    }

    const getQuiz = async () => {
        if (loading) {
          return;
        }
        setLoading(true)

        const quiz_query = FirestoreBackend.getQuiz(params.id);
        quiz_query.then((query_snapshot) => {
            setQuizTitle(query_snapshot.data().quiz_title);
        });
    
        const question_query = await FirestoreBackend.getQuizQuestions(params.id);
        let quizQuests = [];
        question_query.docs.forEach((doc) => {
          quizQuests.push(doc.data());
        });

        setQuizQuestions(quizQuests);
        setupQuestionNames(quizQuests);

        setQuestionText(quizQuests[0].question_title);
        quizQuests[0].question_image = "" ? setQuestionImage(defQuestionImage) : setQuestionImage(quizQuests[0].question_image);
        let qz = quizQuests[0]
        let chs = [qz.question_choices.choice1.text, qz.question_choices.choice2.text, qz.question_choices.choice3.text, qz.question_choices.choice4.text]
        setChoices(chs)
        let ans = [qz.question_choices.choice1.correct, qz.question_choices.choice2.correct, qz.question_choices.choice3.correct, qz.question_choices.choice4.correct]
        setAnswers(ans)
        setLoading(false)
      }

    const setupPlay = async () => {
        getQuiz();
    }

    function isActive(n) {
        if (selectedChoice === n)
            return true;
        return false;
    }

    function handleSubmitChoice() {
        console.log("user submitted choice #", selectedChoice)
        if(selectedChoice === -1) {
            console.log("Please select a choice before submitting!")
        }
        else if(answers[selectedChoice]){
            console.log("Correct!")
            setNumCorrect(numCorrect+1);
            setSelectedChoice(-1)
            nextQuestion()
        }
        else{
            console.log("Incorrect!")
            setSelectedChoice(-1)
            nextQuestion()
        }
    }

    function nextQuestion() {
        setLoading(true)
        console.log("moving to next question...")
        setCurrQuestionNum(currQuestionNum+1)
        if (currQuestionNum < quizQuestions.length) {
            console.log("now on question #", currQuestionNum)
            setQuestionText(quizQuestions[currQuestionNum].questionText);
            setQuestionImage(quizQuestions[currQuestionNum].questionImage);
            let qz = quizQuestions[currQuestionNum];
            let chs = [qz.question_choices.choice1.text, qz.question_choices.choice2.text, qz.question_choices.choice3.text, qz.question_choices.choice4.text]
            setChoices(chs)
            let ans = [qz.question_choices.choice1.correct, qz.question_choices.choice2.correct, qz.question_choices.choice3.correct, qz.question_choices.choice4.correct]
            setAnswers(ans)
            setLoading(false)
        }
        else
            console.log("reached last question!")
    }

    if (quizQuestions.length === 0) {
        setupPlay()
        return (
          <Background>
              <Spinner style={{marginTop:"100px"}} animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Background>
        )
    }
    else if(currQuestionNum > quizQuestions.length){
        return (
            <Background>
                <br></br>
                <h1>Quiz Completed!</h1>
                <h1>You scored {numCorrect}/{quizQuestions.length}</h1>
            </Background>
        )
    }
    return (
        <Background>
        <Stack>
                <br></br>
                <h1>{quizTitle}</h1>
                <h4>Time remaining - 00:00</h4>
                <h2>Question {currQuestionNum}/{quizQuestions.length}</h2>
                <br></br>
                <Image
                    style={{
                        display: "block",
                        margin: "auto",
                        width: "50%",
                        height: "300px",
                    }}
                    src={questionImage}
                    alt="Question Image">
                </Image>
                <br></br>
                <h2>{questionNames[currQuestionNum-1]}</h2>
                <br></br>
                <p style={{color: "gray", fontSize: "14px"}}>Multiple Choice (Select One)</p>
                <Stack>
                    <ListGroup as="ol" style={{width:"75%", margin:"auto"}}>
                        <ListGroup.Item as="li" active={isActive(0)} action onClick={() => setSelectedChoice(0)}>{choices[0]}</ListGroup.Item>
                        <ListGroup.Item as="li" active={isActive(1)} action onClick={() => setSelectedChoice(1)}>{choices[1]}</ListGroup.Item>
                        <ListGroup.Item as="li" active={isActive(2)} action onClick={() => setSelectedChoice(2)}>{choices[2]}</ListGroup.Item>
                        <ListGroup.Item as="li" active={isActive(3)} action onClick={() => setSelectedChoice(3)}>{choices[3]}</ListGroup.Item>
                    </ListGroup>
                </Stack>
                <br></br>
                <Button style={{width:"15%", margin:"auto"}} variant="success" onClick={handleSubmitChoice}>Submit</Button>
        </Stack>
        </Background>
    );
}

export default QuizPlay;