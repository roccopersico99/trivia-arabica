import { Container, Row, Stack, InputGroup, FormControl, Button, Dropdown, DropdownButton } from "react-bootstrap";
import QuizCard from "./profile-components/QuizCard";
import { useState } from 'react'
import Background from "./Background";
import * as FirestoreBackend from "../services/Firestore";
//import { ReactSearchAutocomplete } from "react-search-autocomplete";
//import Fuse from 'fuse.js'

function Discover() {
  const [completedFilter, setCompletedFilter] = useState("All Quizzes");
  const [searchFilter, setSearchFilter] = useState("Ascending");
  const [searchTarget, setSearchTarget] = useState("")

  const [quizzes, setQuizzes] = useState([]);

//   const testQuizzes = [{
//       id: 0,
//       title: "Pokemon Quiz",
//       desc: "A movie about love",
//     },
//     {
//       id: 1,
//       title: "WWE Quiz",
//       desc: "A movie about poetry and the meaning of life",
//     },
//     {
//       id: 2,
//       title: "Minecraft Quiz",
//       desc: "A robot from the future is sent back in time",
//     },
//     {
//       id: 3,
//       title: "Test Quiz",
//       desc: "Ripley is back for a new adventure",
//     },
//   ];

//   const handleOnSearch = (string, results) => {
//     console.log(string, results);

//   };

//   const handleOnSelect = async (item) => {
//     console.log(item.title);
//     const fetchQuiz = await FirestoreBackend.getQuizzes()
//   };

  const handleFilterChange = (e) => {
    setCompletedFilter(e)
    handleSearch()
  }

  const handleSortChange = (e) => {
    setSearchFilter(e)
    handleSearch();
  }

  const searchChanged = (e) => {
    setSearchTarget(e.target.value)
  }

  const handleSearch = async (target) => {
    setQuizzes([]);
    const searchQuery = searchTarget;
    let order = 'desc';
    if (searchFilter === "Ascending")
        order = 'asc';
    console.log("searching for: '", searchQuery, "'");
    const results = FirestoreBackend.searchQuizzes(searchQuery, 99, 'publish_date', order);
    results.then(async (query_snapshot) => {
        if (query_snapshot.empty) {
        console.log("nothing found!");
        }
        for (const quiz of query_snapshot.docs) {
        const resolvedQuiz = await FirestoreBackend.resolveQuizRef(quiz.ref);
        resolvedQuiz.allowed = false;
        console.log(completedFilter, " | ", resolvedQuiz.completed_state);
        if(completedFilter === "Completed" && resolvedQuiz.completed_state){
            console.log("first")
            setQuizzes(results => [...results, resolvedQuiz]);
        }
        else if(completedFilter === "Not Completed" && !resolvedQuiz.completed_state){
            console.log("2nd")
            setQuizzes(results => [...results, resolvedQuiz]);
        }
        else if (completedFilter === "All Quizzes") {
            console.log("3rd")
            setQuizzes(results => [...results, resolvedQuiz]);
        }
        };
    });
  }

  const rows = [...Array(Math.ceil(quizzes.length / 3))];
  const quizRows = rows.map((row, index) => quizzes.slice(index * 3, index * 3 + 3))

  const content = quizRows.map((row, index) => (
    <Row className="row" key={index}>
            {row.map(quiz => (
                <QuizCard quiz={quiz} key={quiz.id}></QuizCard>
            ))}
        </Row>));

  return (
    <Background>
            <br></br>
            <h1>Welcome to the Quiz Discover Page!</h1>
            <br></br>
            {/*<ReactSearchAutocomplete
                items={testQuizzes}
                onSearch={handleOnSearch}
                onSelect={handleOnSelect}
                fuseOptions={{ keys: ["title", "desc"] }}
                resultStringKeyName="title"
                autoFocus
            />*/}
            <Stack direction="horizontal" gap={2} style={{ margin: "10px" }}>
                  <InputGroup>
                      <Button onClick={handleSearch} variant="secondary" id="button-addon1">🔍</Button>
                      <FormControl onChange={searchChanged} aria-label="Example text with button addon" placeholder="Enter search terms..." aria-describedby="basic-addon1" />
                  </InputGroup>
                  <DropdownButton variant="outline-secondary" onSelect={handleFilterChange} title={completedFilter + " "} id="input-group-dropdown-1">
                        <Dropdown.Item eventKey="All Quizzes">All Quizzes</Dropdown.Item>
                        <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                        <Dropdown.Item eventKey="Not Completed">Not Completed</Dropdown.Item>
                    </DropdownButton>
                  <DropdownButton variant="outline-secondary" onSelect={handleSortChange} title={searchFilter + " "} id="input-group-dropdown-2">
                  <Dropdown.Item eventKey="Ascending">Ascending</Dropdown.Item>
                    <Dropdown.Item eventKey="Descending">Descending</Dropdown.Item>
                    {/* <Dropdown.Item as="button"><div onClick={(e) => setSearchFilter(e.target.textContent)}>SmartSort</div></Dropdown.Item> */}
                  </DropdownButton>
                </Stack>
            <br></br>
            <Container>
                {content}
            </Container>
        </Background>
  );
}

export default Discover;