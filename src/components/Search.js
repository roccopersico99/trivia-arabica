import { Container, Row, Stack, InputGroup, FormControl, Spinner, Button, Dropdown, DropdownButton } from "react-bootstrap";
import QuizCard from "./profile-components/QuizCard";
import { useState, useEffect } from 'react'
import * as FirestoreBackend from "../services/Firestore";
import { useParams } from "react-router-dom";

function Search(props) {
  const [completedFilter, setCompletedFilter] = useState("All Quizzes");
  const [searchFilter, setSearchFilter] = useState("Ascending");
  const [searchTarget, setSearchTarget] = useState("")
  const [quizzes, setQuizzes] = useState([]);
  const params = useParams();
  const page = window.location.pathname.split("/")[1];

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
    console.log(page);
    setQuizzes([]);
    const searchQuery = searchTarget;
    let order = 'desc';
    if (searchFilter === "Ascending")
        order = 'asc';
    console.log("searching for: '", searchQuery, "'");
    if(page === 'discover'){
        searchDiscover(searchQuery, order);
    } else if(page === 'profile'){
        searchProfile(searchQuery, order);
    }
  }

    const searchDiscover = async (searchQuery, order) => {
        //TODO: ACTUALLY FILTER COMPLETED/NOT COMPLETED QUIZZES
        const results = FirestoreBackend.searchQuizzes(searchQuery, 99, 'quiz_title', order);
        results.then(async (query_snapshot) => {
            if (query_snapshot.empty) {
            console.log("nothing found!");
            }
            for (const quiz of query_snapshot.docs) {
                const resolvedQuiz = await FirestoreBackend.resolveQuizRef(quiz.ref);
                filterCompleted(resolvedQuiz);
            };
        });
    }

    const searchProfile = async (searchQuery, order) => {
        const yourProfile = props.userDetails.id === params.id
        const results = FirestoreBackend.searchUserQuizzes(params.id, yourProfile, searchQuery, 99, 'quiz_title', order);
        results.then(async (query_snapshot) => {
            if (query_snapshot.empty) {
                console.log("nothing found!");
            }
            for (const quiz of query_snapshot.docs) {
                const resolvedQuiz = await FirestoreBackend.resolveQuizRef(quiz.ref);
                if(yourProfile)
                    filterPublished(resolvedQuiz);
                else
                    filterCompleted(resolvedQuiz);
            };
        });
    }

    const filterCompleted = async (resolvedQuiz) => {
        console.log(completedFilter, " | ", resolvedQuiz.completed_state);
        if(completedFilter === "Completed" && resolvedQuiz.completed_state){
            setQuizzes(results => [...results, resolvedQuiz]);
        } else if(completedFilter === "Not Completed" && !resolvedQuiz.completed_state){
            setQuizzes(results => [...results, resolvedQuiz]);
        } else if (completedFilter === "All Quizzes") {
            setQuizzes(results => [...results, resolvedQuiz]);
        }
    }

    const filterPublished = async (resolvedQuiz) => {
        if(resolvedQuiz){
            resolvedQuiz.allowed = true;
            if (completedFilter === "Published" && resolvedQuiz.publish_state) {
                setQuizzes(results => [...results, resolvedQuiz]);
            } else if (completedFilter === "Not Published" && !resolvedQuiz.publish_state) {
                setQuizzes(results => [...results, resolvedQuiz]);
            } else if (completedFilter === "All Quizzes") {
                setQuizzes(results => [...results, resolvedQuiz]);
            }
        }
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
    </Row>
    ));
    let profile = false;
    if(props.userDetails){
        profile = (props.userDetails.id === params.id);
    }

  return (
    <div>
        <Stack direction="horizontal" gap={2} style={{ margin: "10px" }}>
            <InputGroup>
                <Button onClick={handleSearch} variant="secondary" id="button-addon1">🔍</Button>
                <FormControl onChange={searchChanged} aria-label="Example text with button addon" placeholder="Enter search terms..." aria-describedby="basic-addon1" />
            </InputGroup>
            {profile && <DropdownButton variant="outline-secondary" onSelect={handleFilterChange} title={completedFilter + " "} id="input-group-dropdown-1">
                <Dropdown.Item eventKey="All Quizzes">All Quizzes</Dropdown.Item>
                <Dropdown.Item eventKey="Published">Published</Dropdown.Item>
                <Dropdown.Item eventKey="Not Published">Not Published</Dropdown.Item>
            </DropdownButton>}
            {!profile && <DropdownButton variant="outline-secondary" onSelect={handleFilterChange} title={completedFilter + " "} id="input-group-dropdown-1">
                <Dropdown.Item eventKey="All Quizzes">All Quizzes</Dropdown.Item>
                <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                <Dropdown.Item eventKey="Not Completed">Not Completed</Dropdown.Item>
            </DropdownButton>}
            <DropdownButton variant="outline-secondary" onSelect={handleSortChange} title={searchFilter + " "} id="input-group-dropdown-2">
                <Dropdown.Item eventKey="Ascending">Ascending</Dropdown.Item>
                <Dropdown.Item eventKey="Descending">Descending</Dropdown.Item>
            </DropdownButton>
        </Stack>
        <br></br>
        {quizzes.length===0 && <Spinner style={{ marginTop: "100px" }} animation="border" role="status"></Spinner>}
        {quizzes.length>0 && <Container>{content}</Container>}
    </div>
  );
}

export default Search;