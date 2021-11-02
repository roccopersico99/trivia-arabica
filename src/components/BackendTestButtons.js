import '../App.css';
import React from 'react'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import * as FirestoreBackend from '../services/Firestore.js'

function BackendTestButtons() {

    const onSubmit = (e) => {
        e.preventDefault();
        const ele = e.target.elements;
        FirestoreBackend.setQuizQuestion("samplequiz", ele.questionNum.value, "", ele.formName.value, 
        {
          choice1: {
            correct: ele.choice1[0].checked,
            text: ele.choice1[1].value,
            times_picked: 0
          },
          choice2: {
            correct: ele.choice2[0].checked,
            text: ele.choice2[1].value,
            times_picked: 0
          },
          choice3: {
            correct: ele.choice3[0].checked,
            text: ele.choice3[1].value,
            times_picked: 0
          },
          choice4: {
            correct: ele.choice4[0].checked,
            text: ele.choice4[1].value,
            times_picked: 0
          }
        });
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
    <div>
      <button onClick={()=>{
        const usr_query = FirestoreBackend.getUser('1');
        usr_query.then((query_snapshot)=>{
          query_snapshot.forEach((user) => {
            console.log(user.data().display_name);
            console.log(user.data().user_bio);
            console.log(user.data().medals);
            console.log(user.ref.path);
          });
        });
        }}>Test get user where ID=1
      </button>
      <br/>
      <button onClick={()=>FirestoreBackend.createUser("gus", '2')}>
        Test add user gus ID:2
      </button>
      <br/>
      <button onClick={()=>{
        const usr_query = FirestoreBackend.getUser('1');
        usr_query.then((query_snapshot)=>{
          query_snapshot.forEach((user) => {
            const userRef = user.ref;
            const medalCount = user.data().medals;
            const data = {medals : medalCount+1};
            FirestoreBackend.updateData(userRef, data);
          });
        });
      }}>
        Test update user data (add +1 medal count to bobbert)
      </button>
      <br/>
      <button onClick={()=>{
        FirestoreBackend.createQuiz("1", "testquiz");
      }}>
        Test create empty quiz (userid bobbert, quiztitle testquiz)
      </button>
      <br/>
      <button onClick={()=>{
        const quiz_query = FirestoreBackend.getQuiz('samplequiz');
        quiz_query.then((query_snapshot)=>{
            const quizref = query_snapshot.ref;
            if(query_snapshot.data().quiz_title === 'Hello World'){
                FirestoreBackend.updateData(quizref, {quiz_title: 'Goodbye World'});
            }
            else{
                FirestoreBackend.updateData(quizref, {quiz_title: 'Hello World'});
            }
            console.log(query_snapshot.data());
         });
      }}>
        Test update quiz data (toggle samplequiz title between Hello World and Goodbye World)
      </button>
      <br/>
      <Container>
        <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group controlId="formName">
                <Form.Label>Add Question to samplequiz</Form.Label>
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
      </Container>
      <br/>
      {/* <button onClick={()=>{
        FirestoreBackend.deleteQuestions('cyr926wFrJR8lNvV136b');
        }}>Test deletequiz questions
      </button> */}
      </div>
      
      
  );
}

export default BackendTestButtons;