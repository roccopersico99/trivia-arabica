import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Navigation from "./components/Navigation.js";
import QuizCreator from "./components/QuizCreator.js";
import QuizPreview from "./components/QuizPreview";
import QuizPlay from "./components/QuizPlay";
import QuizInitiator from "./components/QuizInitiator";

export default function App() {
  return (
    <div className="App">
      <Navigation />
      <Switch>
        <Route path="/play/:id" exact component={QuizPlay} />
        <Route path="/creator/:id" exact component={QuizCreator} />
        <Route path="/creator/" exact component={QuizInitiator} />
        <Route path="/preview/:id" exact component={QuizPreview} />
        <Route path="/profile/:id" exact component={Profile} />
        <Route path="/" exact component={Home} />
      </Switch>
    </div>
  );
}