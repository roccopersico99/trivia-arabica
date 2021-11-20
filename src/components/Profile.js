import "../App.css";
import Background from "./Background.js";
import { useAuthState } from "../Context/index";
import "bootstrap/dist/css/bootstrap.css";
import { SocialIcon } from 'react-social-icons';
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
import Search from "./Search";

function Profile() {
  const userDetails = useAuthState();

  const [searchTarget, setSearchTarget] = useState("")

  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [youtube, setYoutube] = useState("")
  const [facebook, setFacebook] = useState("")
  const [twitter, setTwitter] = useState("")
  const [reddit, setReddit] = useState("")

  const [featuredQuiz, setFeaturedQuiz] = useState();
  const [featuredPost, setFeaturedPost] = useState();

  const params = useParams();

  useEffect(() => {
    //get user

    async function getData() {
      const usr_query = FirestoreBackend.getUser(params.id);
      usr_query.then(async (query_snapshot) => {
        setAbout(query_snapshot.data().user_bio);
        setName(query_snapshot.data().display_name);
        setProfileImage(query_snapshot.data().profile_image);
        setYoutube(query_snapshot.data().youtubeURL);
        setFacebook(query_snapshot.data().facebookURL);
        setTwitter(query_snapshot.data().twitterURL);
        setReddit(query_snapshot.data().redditURL);

        const resolvedQuiz = await FirestoreBackend.getQuizFromString(query_snapshot.data().featured_quiz);
        setFeaturedQuiz(resolvedQuiz)
      });

    }
    getData()
  }, [userDetails, refreshKey])

  const handleTabChange = (e) => {
    setRefreshKey(refreshKey + 1)
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

  const setYoutubeLink = async (val) => {
    const res = FirestoreBackend.setUserYoutube(userDetails.id, val)
  }
  const setFacebookLink = async (val) => {
    const res = FirestoreBackend.setUserFacebook(userDetails.id, val)
  }
  const setTwitterLink = async (val) => {
    const res = FirestoreBackend.setUserTwitter(userDetails.id, val)
  }
  const setRedditLink = async (val) => {
    const res = FirestoreBackend.setUserReddit(userDetails.id, val)
  }

  const giveCorrectedYoutubeLink = (val) => {

  }

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
    // quizzes_created: quizzes,
    // quizzes_taken: quizzes,
    platforms: [],
    medals: [],
    featured_quiz: featuredQuiz,
    featured_post: [{
      post_title: "SAMPLE",
      post_text: "SAMPLE",
      post_creator: "SAMPLE"
    }],
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
      <div style={{position: "relative"}}>
        <Image
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
        src={user.banner_image}
        alt="Banner"
        ></Image>
        <div style={{position: 'absolute', right: "5px", bottom:"5px"}}>
          {(youtube.includes("https://youtube.com/") || youtube.includes("https://www.youtube.com/")) && <Button style={{background: "transparent", border:"none"}}><SocialIcon url={youtube}/></Button>}
          {(facebook.includes("https://facebook.com/") || facebook.includes("https://www.facebook.com/")) && <Button style={{background: "transparent", border:"none"}}><SocialIcon url={facebook}/></Button>}
          {(twitter.includes("https://twitter.com/") || twitter.includes("https://www.twitter.com/")) && <Button style={{background: "transparent", border:"none"}}><SocialIcon url={twitter}/></Button>}
          {(reddit.includes("https://reddit.com/user/") || reddit.includes("https://www.reddit.com/user/")) && <Button style={{background: "transparent", border:"none"}}><SocialIcon url={reddit}/></Button>}
        </div>
      </div>
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
            <Tabs onSelect={handleTabChange}>
              <Tab eventKey="home" title="Home">
                <Home
                  featuredQuiz={featuredQuiz}
                  featured_post={user.featured_post}
                ></Home>
              </Tab>
              <Tab eventKey="quizzes" title="Quizzes">
                <Search userDetails={userDetails} refreshKey={refreshKey}></Search>
              </Tab>
              <Tab eventKey="posts" title="Posts">
                <Posts profile={userDetails.id}></Posts>
              </Tab>
              <Tab eventKey="about" title="About">
                <About setAboutText={setAboutText}
                  setYoutubeLink={setYoutubeLink} setFacebookLink={setFacebookLink} setTwitterLink={setTwitterLink} setRedditLink={setRedditLink}
                  youtube={youtube} facebook={facebook} twitter={twitter} reddit={reddit}
                  setYoutube={setYoutube} setFacebook={setFacebook} setTwitter={setTwitter} setReddit={setReddit}
                  about={user.about}></About>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </Background>
  );
}

export default Profile;