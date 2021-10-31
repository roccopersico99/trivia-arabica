import '../App.css';
import React from 'react'
import * as FirestoreBackend from '../services/Firestore.js'

function BackendTestButtons() {

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
        FirestoreBackend.setQuizQuestion("samplequiz", '2', "", "this is a question", 
        {
          choice1: {
            text: "Lorem ipsum sdfgt amet. 1",
            times_picked: 0
          },
          choice2: {
            text: "Lorem ipsusdfgr sit amet. 2",
            times_picked: 0
          },
          choice3: {
            text: "Lorem ipsum dolor sit amet. 3",
            times_picked: 0
          },
          choice4: {
            text: "Lorem ipsum dolor sit amet. 4",
            times_picked: 0
          }
        });
      }}>
        Test add question (path samplequiz, num 1, url "")
      </button>
      <br/>
      <button onClick={()=>{
        const quiz_query = FirestoreBackend.getQuiz('samplequiz');
        quiz_query.then((query_snapshot)=>{
            const quizref = query_snapshot.ref;
            if(query_snapshot.data().quiz_title == 'Hello World'){
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
      </div>
      
  );
}

export default BackendTestButtons;