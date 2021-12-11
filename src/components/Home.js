import '../App.css';
import React from 'react'
import Background from './Background.js'
import HomePageQuizzes from './HomePageQuizzes';
import Darkmode from 'darkmode-js';

function Home() {
  const options = {
    bottom: '64px',
    right: 'unset',
    left: '32px',
    saveInCookies: false,
    label: '🌓',
    autoMatchOsTheme: true
  }
  
  const darkmode = new Darkmode(options);
  darkmode.showWidget();

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