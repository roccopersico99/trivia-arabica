import { Container, Row, Stack, InputGroup, FormControl, Spinner, Button, Dropdown, DropdownButton } from "react-bootstrap";
import QuizCard from "./profile-components/QuizCard";
import { useState, useEffect } from 'react'
import Background from "./Background";
import * as FirestoreBackend from "../services/Firestore";
import Search from "./Search";
//import { ReactSearchAutocomplete } from "react-search-autocomplete";
//import Fuse from 'fuse.js'

function Discover() {

  return (
    <Background>
            <br></br>
            <h1>Welcome to the Quiz Discover Page!</h1>
            <br></br>
            <Search></Search>
        </Background>
  );
}

export default Discover;