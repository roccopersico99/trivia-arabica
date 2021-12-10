import '../App.css';
import React from 'react'
import Background from './Background.js'
import BackendTestButtons from './BackendTestButtons.js'
import RecentQuizzes from './RecentQuizzes';

function Home() {

  return (
    <Background>
      <br></br>
      <h1>Home</h1>

      {/* test buttons for backend functions */}
      {/* <BackendTestButtons></BackendTestButtons>  */}
      <RecentQuizzes></RecentQuizzes>

    </Background>
  );
}

export default Home;