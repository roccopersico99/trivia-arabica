import React from "react";
import "./App.css";
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import Navigation from './components/Navigation.js'

import { useAuthState } from './Context/index'

export default function App() {

  const userDetails = useAuthState()

  return (
    <div className="App">
        <Navigation />
        <Switch>
          <Route path="/profile"  render={()=><Profile/>}/>
          <Route path="/"         render={()=><Home/>}/>
        </Switch>
    </div>
  );
}