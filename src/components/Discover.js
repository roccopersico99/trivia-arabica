import { Container, Row, Stack, InputGroup, FormControl, Spinner, Button, Dropdown, DropdownButton } from "react-bootstrap";
import QuizCard from "./profile-components/QuizCard";
import { useState, useEffect } from 'react'
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
  useEffect(() => {
    handleSearch()
  }, [completedFilter, searchFilter])

  const handleFilterChange = (e) => {
    setCompletedFilter(e)
  }

  const handleSortChange = (e) => {
    setSearchFilter(e)
  }

  const searchChanged = (e) => {
    setSearchTarget(e.target.value)
  }

  const handleSearch = async () => {
    setQuizzes([]);
    const searchQuery = searchTarget;
    let order = 'desc';
    if (searchFilter === "Ascending")
        order = 'asc';
    console.log("searching for: '", searchQuery, "'");
    const results = FirestoreBackend.searchQuizzes(searchQuery, 99, 'quiz_title', order);
    results.then(async (query_snapshot) => {
        if (query_snapshot.empty) {
        console.log("nothing found!");
        }
        for (const quiz of query_snapshot.docs) {
        const resolvedQuiz = await FirestoreBackend.resolveQuizRef(quiz.ref);
        resolvedQuiz.allowed = false;
        console.log(completedFilter, " | ", resolvedQuiz.completed_state);
        if(completedFilter === "Completed" && resolvedQuiz.completed_state){
            setQuizzes(results => [...results, resolvedQuiz]);
        }
        else if(completedFilter === "Not Completed" && !resolvedQuiz.completed_state){
            setQuizzes(results => [...results, resolvedQuiz]);
        }
        else if (completedFilter === "All Quizzes") {
            setQuizzes(results => [...results, resolvedQuiz]);
        }
        };
    });
    //sortQuizzes();
  }

  function sortQuizzes() {
    if(quizzes.length > 0) {
        quizzes.sort(function(a, b){
            let x = a.title.toLowerCase();
            let y = b.title.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
        console.log(quizzes)
        setQuizzes(quizzes)
    }
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
            {quizzes.length===0 && <Spinner style={{ marginTop: "100px" }} animation="border" role="status"></Spinner>}
            {quizzes.length>0 && <Container>{content}</Container>}
        </Background>
  );
}

export default Discover;