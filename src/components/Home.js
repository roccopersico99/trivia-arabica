import '../App.css';
import React from 'react'
import Background from './Background.js'
import HomePageQuizzes from './HomePageQuizzes';

function Home() {

  return (
    <Background>
      <br></br>
      <h1>Home</h1>

      {/* test buttons for backend functions */}
      <HomePageQuizzes title={"Recent Quizzes"}></HomePageQuizzes>
      <HomePageQuizzes title={"All Time Popular Quizzes"}></HomePageQuizzes>

    </Background>
  );
}

export default Home;