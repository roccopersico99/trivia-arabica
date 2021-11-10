import { Container, Row, Stack, InputGroup, FormControl, Button, Dropdown, DropdownButton } from "react-bootstrap";
import QuizCard from "./profile-components/QuizCard";
import { useState } from 'react'
import Background from "./Background";
import * as FirestoreBackend from "../services/Firestore";

function Discover() {

    const [completedFilter, setCompletedFilter] = useState("Completed");
    const [searchFilter, setSearchFilter] = useState("SmartSort");
    const [results, setResults] = useState([]);

    function handleSearch(target) {
        setResults([]);
        const searchQuery = target.nextSibling.value;
        console.log("searching for: '", searchQuery, "'");
        const results = FirestoreBackend.searchQuizzes(searchQuery);
        results.then((query_snapshot) => {
            if (query_snapshot.empty) {
                console.log("nothing found!");
            }
            query_snapshot.forEach(async (quiz) => {
                const resolvedQuiz = await FirestoreBackend.resolveQuizRef(quiz.ref);
                console.log(resolvedQuiz);
                setResults(results => [...results, resolvedQuiz]);
            }); 
        });
    }
    console.log(results);

    const rows = [...Array(Math.ceil(results.length / 3))];
    const quizRows = rows.map((row, index) => results.slice(index * 3, index * 3 + 3))

    const content = quizRows.map((row, index) => (
        <Row className="row" key={index}>
            {row.map(quiz => (
                <QuizCard quiz={quiz} key={quiz}></QuizCard>
            ))}
        </Row>));


    return (
        <Background>
            <br></br>
            <h1>Welcome to the Quiz Discover Page!</h1>
            <br></br>
            <Stack direction="horizontal" gap={2} style={{ margin: "10px" }}>
                <InputGroup>
                    <Button onClick={(e) => handleSearch(e.target)} variant="secondary" id="button-addon1">🔍</Button>
                    <FormControl aria-label="Example text with button addon" placeholder="Enter search terms..." aria-describedby="basic-addon1" />
                </InputGroup>
                <DropdownButton variant="outline-secondary" title={completedFilter + " "} id="input-group-dropdown-1">
                    <Dropdown.Item as="button"><div onClick={(e) => setCompletedFilter(e.target.textContent)}>Completed</div></Dropdown.Item>
                    <Dropdown.Item as="button"><div onClick={(e) => setCompletedFilter(e.target.textContent)}>Not Completed</div></Dropdown.Item>
                    <Dropdown.Item as="button"><div onClick={(e) => setCompletedFilter(e.target.textContent)}>All Quizzes</div></Dropdown.Item>
                </DropdownButton>
                <DropdownButton variant="outline-secondary" title={searchFilter + " "} id="input-group-dropdown-2">
                    <Dropdown.Item as="button"><div onClick={(e) => setSearchFilter(e.target.textContent)}>Ascending</div></Dropdown.Item>
                    <Dropdown.Item as="button"><div onClick={(e) => setSearchFilter(e.target.textContent)}>Descending</div></Dropdown.Item>
                    <Dropdown.Item as="button"><div onClick={(e) => setSearchFilter(e.target.textContent)}>SmartSort</div></Dropdown.Item>
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