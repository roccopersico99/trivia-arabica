import React from "react";
import "./App.css";
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import Navigation from './components/Navigation.js'
import QuizCreator from './components/QuizCreator.js'
import QuizPreview from "./components/QuizPreview";

export default function App() {


  return (
    <div className="App">
        <Navigation />
        <Switch>
          <Route path="/creator"      exact component={QuizCreator}/>
          <Route path="/preview"      exact component={QuizPreview}/>
          <Route path="/profile"      exact component={Profile}/>
          <Route path="/profile/:id"  exact component={Profile}/>
          <Route path="/"             exact component={Home}/>
        </Switch>
    </div>
  );
}