import '../App.css';
import React from 'react'
import Background from './Background.js'
import RecentQuizzes from './RecentQuizzes';
import AllTimePopularQuizzes from './AllTimePopularQuizzes';

function Home() {

  return (
    <Background>
      <br></br>
      <h1>Home</h1>

      {/* test buttons for backend functions */}
      <RecentQuizzes></RecentQuizzes>
      <AllTimePopularQuizzes></AllTimePopularQuizzes>

    </Background>
  );
}

export default Home;