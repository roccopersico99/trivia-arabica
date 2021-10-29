import '../App.css';
import React from 'react'
import Background from './Background.js'
import * as FirestoreBackend from '../services/Firestore.js'

function Home() {

  const test = () => {

  }

  return (
    <Background>
      <p>Home</p>
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

    </Background>
  );
}

export default Home;