import React from "react";
import "./App.css";
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import Navigation from './components/Navigation.js'

import { AuthProvider } from './Context/index'

export default function App() {

  return (
    <div className="App">
      <AuthProvider>
        <Navigation />
        <Switch>
          <Route path="/profile"  render={()=><Profile/>}/>
          <Route path="/"         render={()=><Home/>}/>
        </Switch>
      </AuthProvider>
    </div>
  );
}