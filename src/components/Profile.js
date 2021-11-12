import "../App.css";
import Background from "./Background.js";
import { useAuthState } from "../Context/index";
import "bootstrap/dist/css/bootstrap.css";
import * as FirestoreBackend from "../services/Firestore.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Image,
  Container,
  Button,
  Row,
  Col,
  Stack,
  Tab,
  Tabs,
  Spinner,
  InputGroup,
  FormControl,
  Dropdown,
  DropdownButton
} from "react-bootstrap";
import Home from "./profile-components/ProfileHome";
import Quizzes from "./profile-components/Quizzes";
import Posts from "./profile-components/Posts";
import About from "./profile-components/About";

function Profile() {
  const userDetails = useAuthState();

  const [completedFilter, setCompletedFilter] = useState("All Quizzes");
  const [publishedFilter, setPublishedFilter] = useState("All Quizzes");
  const [searchFilter, setSearchFilter] = useState("Ascending");

  const [searchTarget, setSearchTarget] = useState("")

  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [quizzes, setQuizzes] = useState([])
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useParams();

  useEffect(() => {
    //get user

    async function getData() {
      if (userDetails.user === "") {
        return
      }
      const usr_query = FirestoreBackend.getUser(params.id);
      usr_query.then((query_snapshot) => {
        setAbout(query_snapshot.data().user_bio);
        setName(query_snapshot.data().display_name);
        setProfileImage(query_snapshot.data().profile_image);
      });
      //get user's quizzes
      const userquizzes = FirestoreBackend.searchUserQuizzes(params.id, (userDetails.id === params.id))
      let quizii = []
      userquizzes.then(async (query_snapshot) => {
        for (const doc of query_snapshot.docs) {
          const quiz = await FirestoreBackend.resolveQuizRef(doc.ref);
          if (quiz !== undefined) {
            quiz.allowed = userDetails.id === params.id;
            quizii.push(quiz);
            setQuizzes(quizzes.concat(quizii));
          }
        }
      });
    }
    getData()
  }, [userDetails, refreshKey])

  const handleFilterChange = (e) => {
    if(userDetails.id === params.id)
      setPublishedFilter(e)
    else
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

  const handleSearch = () => {
    setQuizzes([]);
    const searchQuery = searchTarget;
    let order = 'desc';
    const yourProfile = userDetails.id === params.id
    if (searchFilter === "Ascending")
      order = 'asc';
    console.log("searching for: '", searchQuery, "'");
    const results = FirestoreBackend.searchUserQuizzes(params.id, yourProfile, searchQuery, 99, 'publish_date', order);
    results.then(async (query_snapshot) => {
      if (query_snapshot.empty) {
        console.log("nothing found!");
      }
      for (const quiz of query_snapshot.docs) {
        const resolvedQuiz = await FirestoreBackend.resolveQuizRef(quiz.ref);
        resolvedQuiz.allowed = userDetails.id === params.id;
        console.log(publishedFilter, " | ", resolvedQuiz.publish_state);
        if(yourProfile && publishedFilter === "Published" && resolvedQuiz.publish_state){
          console.log("first")
          setQuizzes(results => [...results, resolvedQuiz]);
        }
        else if(yourProfile && publishedFilter === "Not Published" && !resolvedQuiz.publish_state){
          console.log("2nd")
          setQuizzes(results => [...results, resolvedQuiz]);
        }
        else if (yourProfile && publishedFilter === "All Quizzes") {
          console.log("3rd")
          setQuizzes(results => [...results, resolvedQuiz]);
        }
      };
    });
  }

  const setAboutText = async (val) => {
    const usr_query = FirestoreBackend.getUser(userDetails.id);
    usr_query.then((query_snapshot) => {
      const userRef = query_snapshot.ref;
      //const medalCount = user.data().medals;
      const data = { user_bio: val };
      FirestoreBackend.updateData(userRef, data);
      setQuizzes([])
      setRefreshKey(refreshKey + 1);
    });
  };

  let posts = [{
      title: "First Post",
      content: "This is my first post",
      date: "10/28/2021",
    },
    {
      title: "Second Post",
      content: "This is my second post",
      date: "10/31/2021",
    },
  ];
  let user = {
    id: "1",
    display_name: name,
    profile_picture: profileImage === "" ?
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" : profileImage,
    banner_image: "https://image.freepik.com/free-vector/abstract-dotted-banner-background_1035-18160.jpg",
    about: {
      content: "About Me",
      description: about,
      allowed: userDetails.id === params.id,
    },
    posts: posts,
    quizzes_created: quizzes,
    quizzes_taken: quizzes,
    platforms: [],
    medals: [],
    featured_quiz: quizzes[0],
    featured_post: posts[0],
    following: [],
    followers: [],
  };

  if (name === "") {
    return (
      <Background>
        <Spinner
          style={{ marginTop: "100px" }}
          animation="border"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Background>
    );
  }
  return (
    <Background>
      <Image
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
        src={user.banner_image}
        alt="Banner"
      ></Image>

      <Container>
        <Row>
          <Col lg="3" style={{ position: "relative", top: "-25px" }}>
            <Image
              style={{
                height: "150px",
                width: "150px",
              }}
              src={user.profile_picture}
              alt="Profile"
            ></Image>
            <Stack>
              <div>{user.display_name}</div>
              <Button
                style={{ width: "100px", margin: "auto", position: "relative" }}
              >
                Follow
              </Button>
            </Stack>
          </Col>
        </Row>

        <Row>
          <Col>
            <Tabs>
              <Tab eventKey="home" title="Home">
                <Home
                  featured_quiz={user.featured_quiz}
                  featured_post={user.featured_post}
                ></Home>
              </Tab>
              <Tab eventKey="quizzes" title="Quizzes">
                <Stack direction="horizontal" gap={2} style={{ margin: "10px" }}>
                  <InputGroup>
                      <Button onClick={handleSearch} variant="secondary" id="button-addon1">🔍</Button>
                      <FormControl onChange={searchChanged} aria-label="Example text with button addon" placeholder="Enter search terms..." aria-describedby="basic-addon1" />
                  </InputGroup>
                {(userDetails.id === params.id) && <DropdownButton variant="outline-secondary" onSelect={(e) => {setPublishedFilter(e); handleSearch();}} title={publishedFilter + " "} id="input-group-dropdown-1">
                      <Dropdown.Item eventKey="All Quizzes">All Quizzes</Dropdown.Item>
                      <Dropdown.Item eventKey="Published">Published</Dropdown.Item>
                      <Dropdown.Item eventKey="Not Published">Not Published</Dropdown.Item>
                  </DropdownButton>}
                  {(userDetails.id !== params.id) && <DropdownButton variant="outline-secondary" onSelect={handleFilterChange} title={completedFilter + " "} id="input-group-dropdown-1">
                        <Dropdown.Item eventKey="All Quizzes">All Quizzes</Dropdown.Item>
                        <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                        <Dropdown.Item eventKey="Not Completed">Not Completed</Dropdown.Item>
                    </DropdownButton>}
                  <DropdownButton variant="outline-secondary" onSelect={handleSortChange} title={searchFilter + " "} id="input-group-dropdown-2">
                  <Dropdown.Item eventKey="Ascending">Ascending</Dropdown.Item>
                    <Dropdown.Item eventKey="Descending">Descending</Dropdown.Item>
                    {/* <Dropdown.Item as="button"><div onClick={(e) => setSearchFilter(e.target.textContent)}>SmartSort</div></Dropdown.Item> */}
                  </DropdownButton>
                </Stack>
                <Quizzes setQuizzes={setQuizzes} refreshKey={refreshKey} setRefreshKey={setRefreshKey} quizzes={quizzes}></Quizzes>
              </Tab>
              <Tab eventKey="posts" title="Posts">
                <Posts posts={user.posts}></Posts>
              </Tab>
              <Tab eventKey="about" title="About">
                <About helper={setAboutText} about={user.about}></About>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </Background>
  );
}

export default Profile;