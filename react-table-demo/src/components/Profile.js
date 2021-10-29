import "../App.css";
import Background from "./Background.js";
import { useAuthState } from '../Context/index'
import * as FirestoreBackend from '../services/Firestore.js'
import { useState } from 'react'

import {
  Image,
  Container,
  Button,
  Row,
  Col,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import Home from "./profile-components/ProfileHome";
import Quizzes from "./profile-components/Quizzes";
import Posts from "./profile-components/Posts";
import About from "./profile-components/About";

function Profile() {
  const userDetails = useAuthState()
  const [about, setAbout] = useState("");


  const getAbout = async () => {
    const usr_query = FirestoreBackend.getUser(userDetails.id);
    usr_query.then((query_snapshot) => {
      query_snapshot.forEach((user) => {
        setAbout(user.data().user_bio)
      });
    });
  }

  const setAboutText = (val) => {
    const usr_query = FirestoreBackend.getUser(userDetails.id);
    usr_query.then((query_snapshot) => {
      query_snapshot.forEach((user) => {
        const userRef = user.ref;
        const medalCount = user.data().medals;
        const data = { user_bio: val };
        FirestoreBackend.updateData(userRef, data);
      });
    });
    setAbout(val)
  }

  getAbout()

  let quizzes = [{
      id: "1",
      title: "Baseball Quiz!!!",
      description: "This quiz is about MLB history.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/40/Heyward_lines_into_double_play_%2828356212176%29.jpg",
      creator: "1",
      platform: "1",
      questions: [{ title: "First Question", choices: [1, 2, 3, 4] }],
      ratings: [],
    },
    {
      id: "2",
      title: "Football Quiz!!!",
      description: "This quiz is about NFL history.",
      image: "https://wallpaperbat.com/img/157590-troy-polamalus-hall-of-fame-career-was-pure-chaos.jpg",
      creator: "1",
      platform: "1",
      questions: [{ title: "First Question", choices: [1, 2, 3, 4] }],
      ratings: [],
    },
    {
      id: "3",
      title: "Basketball Quiz!!!",
      description: "This quiz is about NBA history.",
      image: "https://theundefeated.com/wp-content/uploads/2018/03/gettyimages-587625016.jpg",
      creator: "1",
      platform: "1",
      questions: [{ title: "First Question", choices: [1, 2, 3, 4] }],
      ratings: [],
    },
  ];
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
    display_name: userDetails.user === "" ? "John Cena" : userDetails.user,
    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    banner_image: "https://image.freepik.com/free-vector/abstract-dotted-banner-background_1035-18160.jpg",
    about: {
      content: "About Me",
      description: about,
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




  return (
    <Background>
      <Image
        style={{ width: "100%", height: "200px", "object-fit": "cover" }}
        src={user.banner_image}
        alt="Banner"
      ></Image>

      <Container>
        <Row>
          <Col lg="3">
            <Image
              style={{
                top: "-25px",
                position: "relative",
                height: "150px",
                width: "150px",
              }}
              src={user.profile_picture}
              alt="Profile"
            ></Image>
          </Col>

          <Stack>
            <br></br>
            <div>{user.display_name}</div>
            <br></br>
            <Button>Follow</Button>
          </Stack>
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
                <Quizzes quizzes={user.quizzes_created}></Quizzes>
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