import { Container, Row, Stack, InputGroup, FormControl, Spinner, Button, Dropdown, DropdownButton, Pagination } from "react-bootstrap";
import PlatformCard from "./profile-components/PlatformCard";
import { useState, useEffect } from 'react'
import * as FirestoreBackend from "../services/Firestore";
import { useParams } from "react-router-dom";
import { useAuthState } from "../Context";
import { getAuth } from "@firebase/auth";

function SearchPlatforms(props) {

  const userDetails = useAuthState();
  const auth = getAuth();

  const [completedFilter, setCompletedFilter] = useState("All Quizzes");
  const [orderBy, setOrderBy] = useState("Publish Date")
  const [searchFilter, setSearchFilter] = useState("Descending");
  const [searchTarget, setSearchTarget] = useState("")
  const [platforms, setPlatforms] = useState([]);
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
    setPageNum(platChunks.length);
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
    setPlatforms([]);
    setEmptySearch(false);
    const searchQuery = searchTarget;
    let order = 'desc';
    if (searchFilter === "Ascending")
      order = 'asc';
    let orderOn = 'publish_date'
    if (orderBy === "Quiz Name")
      orderOn = 'search_title'
    searchPlatforms(searchQuery, orderOn, order);
  }

  const searchPlatforms = async (searchQuery, orderOn, order) => {
    console.log(searchQuery)
    const results = await FirestoreBackend.searchPlatforms(searchQuery);
    if (results.empty) {
      //console.log("nothing found!");
      setEmptySearch(true);
    }
    counter = results.docs.length;
    //console.log("counter : " + counter);
    let newResults = [];
    results.docs.forEach(async (platform, index) => {
      newResults[index] = platform
    });
    console.log(newResults)
    setPlatforms(newResults)
  }

  // trim out empty spots in quizzes array created from filtering
  const trimPlats = platforms.filter(n => n);
  // chunk quizzes into arrays of 6 elements
  const platChunks = trimPlats.reduce((all, one, i) => {
    const ch = Math.floor(i / 6);
    all[ch] = [].concat((all[ch] || []), one);
    return all
  }, [])
  const platChunk = platChunks[pageNum - 1];
  // prevent undefined error on quizzes being empty
  let rows;
  if (platChunk)
    rows = [...Array(Math.ceil(platChunk.length / 3))];
  else
    rows = [];
  const platRows = rows.map((row, index) => platChunk.slice(index * 3, index * 3 + 3))
  const content = platRows.map((row, index) => (
    <Row className="row" key={index}>
      {row.map((platform, idx) => (
        <PlatformCard platform={platform} key={idx}></PlatformCard>
      ))}
    </Row>
  ));
  let paginationItems = [
    <Pagination.First key={-4} onClick={handleFirst} disabled={(pageNum <= 1)}/>,
    <Pagination.Prev key={-3} onClick={handlePrev} disabled={(pageNum <= 1)}/>
  ]
  for (let index = 1; index <= platChunks.length; index++) {
    paginationItems.push(
      <Pagination.Item key={index} active={index === pageNum} onClick={handlePageNum}> {index} </Pagination.Item>
    )
  }
  paginationItems.push(<Pagination.Next key={-2} onClick={handleNext} disabled={(pageNum >= platChunks.length)}/>)
  paginationItems.push(<Pagination.Last key={-1} onClick={handleLast} disabled={(pageNum >= platChunks.length)}/>)

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
        </Stack>
        <br></br>
        {(platforms.length===0 && emptySearch===false) && <Spinner style={{ marginTop: "100px" }} animation="border" role="status"></Spinner>}
        {(platforms.length===0 && emptySearch===true && noSearch===false) && <div>No platforms found</div>}
        {platforms.length>0 &&
          <Container>
            {content}
            <Pagination>
              {paginationItems}
            </Pagination>
          </Container>}
    </div>
  );
}

export default SearchPlatforms;