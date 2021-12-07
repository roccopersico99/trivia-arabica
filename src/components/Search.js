import { Container, Row, Stack, InputGroup, FormControl, Spinner, Button, Dropdown, DropdownButton, Pagination } from "react-bootstrap";
import QuizCard from "./profile-components/QuizCard";
import { useState, useEffect } from 'react'
import * as FirestoreBackend from "../services/Firestore";
import { useParams } from "react-router-dom";
import { useAuthState } from "../Context";
import { getAuth } from "@firebase/auth";

function Search(props) {

  const userDetails = useAuthState();
  const auth = getAuth();

  const [completedFilter, setCompletedFilter] = useState("All Quizzes");
  const [orderBy, setOrderBy] = useState("Publish Date")
  const [searchFilter, setSearchFilter] = useState("Descending");
  const [searchTarget, setSearchTarget] = useState("")
  const [quizzes, setQuizzes] = useState([]);
  const [emptySearch, setEmptySearch] = useState(false);
  const [noSearch, setNoSearch] = useState(true);
  const [loading, setLoading] = useState(false)
  const [pageNum, setPageNum] = useState(1);
  const params = useParams();
  const page = window.location.pathname.split("/")[1];

  let counter = 0;

  useEffect(() => {
    //console.log(props.userDetails)
    handleSearch()
  }, [props.refreshKey, completedFilter, searchFilter, orderBy])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')
      handleSearch();
  }

  const handleFilterChange = (e) => {
    setCompletedFilter(e)
  }

  const handleSortChange = (e) => {
    setSearchFilter(e)
  }

  const handleSortByChange = (e) => {
    setOrderBy(e)
  }

  const searchChanged = (e) => {
    setSearchTarget(e.target.value)
  }

  const handleFirst = () => {
    setPageNum(1);
  }

  const handleLast = () => {
    setPageNum(quizChunks.length);
  }

  const handlePrev = () => {
    const num = pageNum - 1;
    setPageNum(num);
  }

  const handleNext = () => {
    const num = pageNum + 1;
    setPageNum(num);
  }

  const handlePageNum = (e) => {
    setPageNum(Number(e.target.text));
  }

  const handleSearch = async () => {
    setLoading(true)
    //console.log(page);
    setQuizzes([]);
    setEmptySearch(false);
    const searchQuery = searchTarget;
    let order = 'desc';
    if (searchFilter === "Ascending")
      order = 'asc';
    let orderOn = 'publish_date'
    if (orderBy === "Quiz Name")
      orderOn = 'search_title'
    //console.log("searching for: '", searchQuery, "'");
    if (page === 'discover' && searchQuery !== "") {
      searchDiscover(searchQuery, orderOn, order);
    } else if (page === 'profile') {
      searchProfile(searchQuery, orderOn, order);
    } else {
      setEmptySearch(true);
    }
  }

  const searchDiscover = async (searchQuery, orderOn, order, startOn = "") => {
    //TODO: ACTUALLY FILTER COMPLETED/NOT COMPLETED QUIZZES
    setNoSearch(false);
    const results = FirestoreBackend.searchQuizzes(searchQuery, 30, orderOn, order, startOn);
    results.then(async (query_snapshot) => {
      if (query_snapshot.empty) {
        //console.log("nothing found!");
        setEmptySearch(true);
      }
      counter = query_snapshot.docs.length;
      //console.log("counter : " + counter);
      let newResults = [];

      query_snapshot.docs.forEach(async (quiz, index) => {
        const resolvedQuiz = await FirestoreBackend.resolveQuizRef(quiz.ref);
        filterCompleted(resolvedQuiz, index, newResults);
      });
    });
  }

  const searchProfile = async (searchQuery, orderOn, order) => {
    const yourProfile = props.userDetails.id === params.id;
    const results = FirestoreBackend.searchUserQuizzes(params.id, props.uid, yourProfile, searchQuery, 30, orderOn, order);
    results.then(async (query_snapshot) => {
      if (query_snapshot.empty) {
        //console.log("nothing found!");
        setEmptySearch(true);
      }
      counter = query_snapshot.docs.length;
      //console.log("counter : " + counter);
      let newResults = [];
      query_snapshot.docs.forEach(async (quiz, index) => {
        const resolvedQuiz = await FirestoreBackend.resolveQuizRef(quiz.ref);
        if (yourProfile)
          filterPublished(resolvedQuiz, index, newResults);
        else
          filterCompleted(resolvedQuiz, index, newResults);
      });
    });
  }

  const filterCompleted = async (resolvedQuiz, index, newResults) => {
    const completed_state = await FirestoreBackend.checkQuizCompletedOnUser(userDetails.id, resolvedQuiz.id);
    //console.log(completedFilter, " | ", completed_state);
    if (completedFilter === "Completed" && completed_state) {
      newResults[index] = resolvedQuiz;
      //console.log(newResults);
    } else if (completedFilter === "Not Completed" && !completed_state) {
      newResults[index] = resolvedQuiz;
      //console.log(newResults);
    } else if (completedFilter === "All Quizzes") {
      newResults[index] = resolvedQuiz;
      //console.log(newResults);
    }
    counter -= 1;
    //console.log("counter : " + counter);
    if (counter === 0)
      setQuizzes(newResults);
  }

  const filterPublished = async (resolvedQuiz, index, newResults) => {
    if (resolvedQuiz) {
      resolvedQuiz.allowed = true;
      if (completedFilter === "Published" && resolvedQuiz.publish_state) {
        newResults[index] = resolvedQuiz;
        //console.log(newResults);
      } else if (completedFilter === "Not Published" && !resolvedQuiz.publish_state) {
        newResults[index] = resolvedQuiz;
        //console.log(newResults);
        if (counter === 0)
          setQuizzes(newResults);
      } else if (completedFilter === "All Quizzes") {
        newResults[index] = resolvedQuiz;
        //console.log(newResults);
      }
      counter -= 1;
      //console.log("counter : " + counter);
      if (counter === 0)
        setQuizzes(newResults);
    }
  }



  function sortQuizzes() {
    if (quizzes.length > 0) {
      quizzes.sort(function(a, b) {
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      });
      //console.log(quizzes)
      setQuizzes(quizzes)
    }
  }

  // trim out empty spots in quizzes array created from filtering
  const trimQuizzes = quizzes.filter(n => n);
  // chunk quizzes into arrays of 6 elements
  const quizChunks = trimQuizzes.reduce((all, one, i) => {
    const ch = Math.floor(i / 6);
    all[ch] = [].concat((all[ch] || []), one);
    return all
  }, [])
  const quizChunk = quizChunks[pageNum - 1];
  // prevent undefined error on quizzes being empty
  let rows;
  if (quizChunk)
    rows = [...Array(Math.ceil(quizChunk.length / 3))];
  else
    rows = [];
  const quizRows = rows.map((row, index) => quizChunk.slice(index * 3, index * 3 + 3))
  const content = quizRows.map((row, index) => (
    <Row className="row" key={index}>
      {row.map(quiz => (
        <QuizCard onDelete={handleSearch} quiz={quiz} key={quiz.id}></QuizCard>
      ))}
    </Row>
  ));
  let paginationItems = [
    <Pagination.First onClick={handleFirst} disabled={(pageNum <= 1)}/>,
    <Pagination.Prev onClick={handlePrev} disabled={(pageNum <= 1)}/>
  ]
  for (let index = 1; index <= quizChunks.length; index++) {
    paginationItems.push(
      <Pagination.Item key={index} active={index === pageNum} onClick={handlePageNum}> {index} </Pagination.Item>
    )
  }
  paginationItems.push(<Pagination.Next onClick={handleNext} disabled={(pageNum >= quizChunks.length)}/>)
  paginationItems.push(<Pagination.Last onClick={handleLast} disabled={(pageNum >= quizChunks.length)}/>)

  let profile = false;
  if (props.userDetails) {
    profile = (props.userDetails.id === params.id);
  }

  return (
    <div>
        <Stack direction="horizontal" gap={2} style={{ margin: "10px" }}>
            <InputGroup>
                <Button onClick={handleSearch} variant="secondary" id="button-addon1">🔍</Button>
                <FormControl onKeyDown={handleKeyDown} onChange={searchChanged} aria-label="Example text with button addon" placeholder="Enter search terms..." aria-describedby="basic-addon1" />
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
            <DropdownButton variant="outline-secondary" onSelect={handleSortByChange} title={orderBy + " "} id="input-group-dropdown-3">
                <Dropdown.Item eventKey="Publish Date">Order by Publish Date</Dropdown.Item>
                <Dropdown.Item eventKey="Quiz Name">Order by Quiz Name</Dropdown.Item>
            </DropdownButton>
            <DropdownButton variant="outline-secondary" onSelect={handleSortChange} title={searchFilter + " "} id="input-group-dropdown-2">
                <Dropdown.Item eventKey="Ascending">Ascending</Dropdown.Item>
                <Dropdown.Item eventKey="Descending">Descending</Dropdown.Item>
            </DropdownButton>
        </Stack>
        <br></br>
        {(quizzes.length===0 && emptySearch===false) && <Spinner style={{ marginTop: "100px" }} animation="border" role="status"></Spinner>}
        {(quizzes.length===0 && emptySearch===true && noSearch===false) && <div>no quizzes found</div>}
        {quizzes.length>0 &&
          <Container>
            {content}
            <Pagination>
              {paginationItems}
            </Pagination>
          </Container>}
    </div>
  );
}

export default Search;