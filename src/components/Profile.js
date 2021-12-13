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
  Spinner
} from "react-bootstrap";
import Home from "./profile-components/ProfileHome";
import Posts from "./profile-components/Posts";
import About from "./profile-components/About";
import ProfilePlatforms from "./profile-components/ProfilePlatforms";
import Search from "./Search";
import UserReportPopup from "./UserReportPopup";
import { getAuth } from "@firebase/auth";

function Profile() {
  const userDetails = useAuthState();
  const auth = getAuth();

  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [medals, setMedals] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [profileId, setProfileID] = useState("")
  const [platforms, setPlatforms] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [youtube, setYoutube] = useState("")
  const [facebook, setFacebook] = useState("")
  const [twitter, setTwitter] = useState("")
  const [reddit, setReddit] = useState("")

  const [featuredQuiz, setFeaturedQuiz] = useState();
  const [featuredPlatform, setFeaturedPlatform] = useState();
  const [noFeatured, setNoFeatured] = useState(false);

  const [modalShow, setModalShow] = useState(false);

  const params = useParams();

  const [owner, setOwner] = useState()

  useEffect(() => {
    if (params.id === userDetails.id) {
      setOwner(true)
    } else {
      setOwner(false)
    }
  }, [userDetails])

  const [currentTab, setCurrentTab] = useState("home");
  const handleTabChange = (e) => {
    setCurrentTab(e)
    console.log(e)
    setRefreshKey(refreshKey + 1)
  }

  const setAboutText = async (val) => {
    const usr_query = FirestoreBackend.getUser(userDetails.id);
    usr_query.then((query_snapshot) => {
      const userRef = query_snapshot.ref;
      //const medalCount = user.data().medals;
      const data = { user_bio: val };
      FirestoreBackend.updateData(userRef, data);
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

  function handleChangeFeatured(q) {
    setFeaturedQuiz(q);
    setNoFeatured(false)
    handleTabChange('home');
  }

  const setFeaturedPlatformProp = (platform) => {
    setFeaturedPlatform(platform)
    setNoFeatured(false)
    handleTabChange('home')
  }

  function handleReport(res) {
    let sentBy = ""
    userDetails.user === "" ? sentBy = "Guest" : sentBy = userDetails.id
    let currentTime = new Date()
    try {
      window.Email.send({
        SecureToken: "36297ca5-2675-43a0-82be-c6640938db00",
        To: 'rocco.persico@stonybrook.edu',
        From: "roccopersico99@gmail.com",
        Subject: "User Reported: " + params.id,
        Body: "A user has been reported on Trivia Arabica...<br />" +
          "Reported User: " + params.id + "<br />" +
          "Reported by User: " + sentBy + "<br />" +
          "Time of Report: " + currentTime.toString() + "<br />" +
          "User Response: " + res
      }).then(
        message => message === "OK" ? alert("Report Submitted. Thank you!") : alert(message)
      ).then(setModalShow(false));
    } catch (e) {
      console.log(e)
    }
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
    medals: medals,
    featured_quiz: featuredQuiz,
    featured_post: [{
      post_title: "SAMPLE",
      post_text: "SAMPLE",
      post_creator: "SAMPLE"
    }],
    following: [],
    followers: [],
  };



  if (owner === undefined || params.id !== profileId) {
    const usr_query = FirestoreBackend.getUser(params.id);
    usr_query.then(async (query_snapshot) => {

      setProfileID(params.id)
      setAbout(query_snapshot.data().user_bio);
      setName(query_snapshot.data().display_name);
      setMedals(query_snapshot.data().medals);
      setProfileImage(query_snapshot.data().profile_image);
      setYoutube(query_snapshot.data().youtubeURL);
      setFacebook(query_snapshot.data().facebookURL);
      setTwitter(query_snapshot.data().twitterURL);
      setReddit(query_snapshot.data().redditURL);

      const plats = await FirestoreBackend.getUserPlatforms(query_snapshot.id)
      let platformArray = []
      plats.forEach(pform => {
        platformArray.push(pform)
      })
      setPlatforms(platformArray)

      const resolvedQuiz = await FirestoreBackend.getQuizFromString(query_snapshot.data().featured_quiz);
      const resolvedPlat = await FirestoreBackend.getUserPlatform(params.id, query_snapshot.data().featured_platform)
      setFeaturedQuiz(resolvedQuiz)
      setFeaturedPlatform(resolvedPlat)

      if (resolvedQuiz === undefined && resolvedPlat.data() === undefined) {
        console.log("true")
        setNoFeatured(true)
      }
    });
  }


  if (params.id !== profileId) {
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
      <UserReportPopup show={modalShow} onHide={() => setModalShow(false)} onSubmit={(res) => handleReport(res)}></UserReportPopup>
      <div style={{position: "relative"}}>
        <Image
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
        src={user.banner_image}
        alt="Banner"
        ></Image>
        <div style={{position: 'absolute', right: "5px", bottom:"5px"}}>
          {(youtube?.includes("https://youtube.com/") || youtube?.includes("https://www.youtube.com/")) && <Button style={{background: "transparent", border:"none"}}><SocialIcon target="_blank" rel="noopener noreferrer" url={youtube}/></Button>}
          {(facebook?.includes("https://facebook.com/") || facebook?.includes("https://www.facebook.com/")) && <Button style={{background: "transparent", border:"none"}}><SocialIcon target="_blank" rel="noopener noreferrer" url={facebook}/></Button>}
          {(twitter?.includes("https://twitter.com/") || twitter?.includes("https://www.twitter.com/")) && <Button style={{background: "transparent", border:"none"}}><SocialIcon target="_blank" rel="noopener noreferrer" url={twitter}/></Button>}
          {(reddit?.includes("https://reddit.com/user/") || reddit?.includes("https://www.reddit.com/user/")) && <Button style={{background: "transparent", border:"none"}}><SocialIcon target="_blank" rel="noopener noreferrer" url={reddit}/></Button>}
        </div>
      </div>
      <Container>
        <Row>
          <Stack direction="horizontal">
            <Image
              style={{
                height: "125px",
                width: "125px",
                borderRadius: "50%",
                margin: "10px",
              }}
              src={user.profile_picture}
              alt="Profile"
            ></Image>
            <Stack>
              <h2 style={{marginTop: "40px", marginRight:"525px"}}>{user.display_name}</h2>
              <h5 style={{marginRight:"550px"}}>{"🏅 " + user.medals + " medals"}</h5>
            </Stack>
            {userDetails.id !== params.id && <Button variant="outline-danger" onClick={() => setModalShow(true)} style={{maxWidth: "50px", width: "50px", height: "50px", marginBottom: "70px"}}>🚩</Button>}
          </Stack>
        </Row>

        <Row>
          <Col>
            <Tabs activeKey={currentTab} onSelect={handleTabChange}>
              <Tab eventKey="home" title="Home">
                <Home
                  noFeatured={noFeatured}
                  featuredQuiz={featuredQuiz}
                  featuredPlatform={featuredPlatform}
                ></Home>
              </Tab>
              <Tab eventKey="quizzes" title="Quizzes">
                <Search featuredQuiz={featuredQuiz} setFeaturedQuiz={handleChangeFeatured} userDetails={userDetails} uid={auth.currentUser?.uid} refreshKey={refreshKey}></Search>
              </Tab>
              <Tab eventKey="posts" title="Posts">
                <Posts profile={userDetails.id} uid={auth.currentUser?.uid}></Posts>
              </Tab>
              <Tab style={{marginLeft:"50px"}} eventKey="platforms" title="Platforms">
                <ProfilePlatforms setFeaturedPlatformProp={setFeaturedPlatformProp} featuredPlatform={featuredPlatform} userDetails={userDetails} ownProfile={userDetails.id === params.id} platforms={platforms}></ProfilePlatforms>
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