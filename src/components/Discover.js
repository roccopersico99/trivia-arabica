import { Container, Row, Stack, InputGroup, FormControl, Button, Dropdown, DropdownButton } from "react-bootstrap";
import QuizCard from "./profile-components/QuizCard";
import { useState } from 'react'
import Background from "./Background";
import { searchQuizzes } from "../services/Firestore";

function Discover() {

    const [completedFilter, setCompletedFilter] = useState("Completed");
    const [searchFilter, setSearchFilter] = useState("SmartSort");

    function handleSearch(target) {
        console.log("searching for: '", target.nextSibling.value, "'")
        const results = searchQuizzes(target.nextSibling.value);
        results.then((query_snapshot)=>{
            if(query_snapshot.empty){
                console.log("nothing found!");
            }
            query_snapshot.forEach((quiz) => {
                const quizRef = quiz.ref;
                console.log(quiz.data());
            });
        });
    }

    return (
        <Background>
            <br></br>
            <h1>Welcome to the Quiz Discover Page!</h1>
            <br></br>
            <Stack direction="horizontal" gap={2} style={{margin:"10px"}}>
                <InputGroup>
                    <Button onClick={(e) => handleSearch(e.target)} variant="dark" id="button-addon1">🔍</Button>
                    <FormControl aria-label="Example text with button addon" placeholder="Enter search terms..." aria-describedby="basic-addon1"/>
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
                <Row>
                    <QuizCard></QuizCard>
                    <QuizCard></QuizCard>
                    <QuizCard></QuizCard>
                </Row>
                <Row>
                    <QuizCard></QuizCard>
                    <QuizCard></QuizCard>
                    <QuizCard></QuizCard>
                </Row>
                <Row>
                    <QuizCard></QuizCard>
                    <QuizCard></QuizCard>
                    <QuizCard></QuizCard>
                </Row>
            </Container>
        </Background>
    );
}

export default Discover;