import "../App.css";
import Background from "./Background.js";
import { useAuthState } from "../Context/index";
import "bootstrap/dist/css/bootstrap.css";
import * as FirestoreBackend from "../services/Firestore.js";
import { useState } from "react";
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
} from "react-bootstrap";
import Home from "./profile-components/ProfileHome";
import Quizzes from "./profile-components/Quizzes";
import Posts from "./profile-components/Posts";
import About from "./profile-components/About";

function Profile() {
  const userDetails = useAuthState();
  const [loading, setLoading] = useState(false)

  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [quizzes, setQuizzes] = useState([])
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useParams();

  let currentUser = "";

  const setupProfile = async () => {
    if (loading) {
      return;
    }
    setLoading(true)
    currentUser = params.id;
    //get user
    const usr_query = FirestoreBackend.getUser(currentUser);
    usr_query.then((query_snapshot) => {
      query_snapshot.forEach((user) => {
        setAbout(user.data().user_bio);
        setName(user.data().display_name);
        setProfileImage(user.data().profile_image);
      });
    });
    //get user's quizzes
    const userquizzes = await FirestoreBackend.getUserQuizzes(currentUser)
    let quizii = []
    userquizzes.docs.forEach(async (doc) => {
      const qz = await FirestoreBackend.getQuizFromRef(doc.data().quizRef)
      quizii.push({
        id: qz.id,
        title: qz.data().quiz_title,
        description: qz.data().quiz_desc,
        image: qz.data().quiz_image,
        creator: name,
        platform: "unset",
        ratings: qz.data().quiz_ratings,
      });
      setQuizzes(quizii);
      setLoading(false);
    });
  };


  const setAboutText = (val) => {
    const usr_query = FirestoreBackend.getUser(userDetails.id);
    usr_query.then((query_snapshot) => {
      query_snapshot.forEach((user) => {
        const userRef = user.ref;
        //const medalCount = user.data().medals;
        const data = { user_bio: val };
        FirestoreBackend.updateData(userRef, data);
      });
    });
    setRefreshKey(refreshKey + 1);
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
      allowed: userDetails.id === currentUser,
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
    setupProfile();
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
                <Quizzes quizzes={quizzes}></Quizzes>
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