import '../App.css';
import React from 'react'
import Background from './Background.js'
import BackendTestButtons from './BackendTestButtons.js'

function Home() {

  return (
    <Background>
      <p>Home</p>

      {/* test buttons for backend functions */}
      <BackendTestButtons></BackendTestButtons> 

    </Background>
  );
}

export default Home;