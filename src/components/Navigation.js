import { Navbar, Nav, Container } from "react-bootstrap";
import { default as logo } from "../logo.svg";
import { default as defaultUserIcon } from "../person-circle.svg";
import { default as settingsIcon } from "../settings-icon.png";
import LoginLogout from "./LoginLogout";

import { useAuthState } from "../Context/index";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import SettingsPopup from "./SettingsPopup";
import * as FirestoreBackend from "../services/Firestore.js";

function Navigation() {
  const userDetails = useAuthState();
  const loggedIn = userDetails.id !== "";

  let userIcon = defaultUserIcon;
  let userIconStyle = { filter: "invert(1)", borderRadius: "50%" };
  if (loggedIn) {
    userIcon = userDetails.imageUrl;
    userIconStyle = { borderRadius: "50%" };
  }

  const [modalShow, setModalShow] = useState(false);

  const history = useHistory();

  const handleHomeClick = (event) => {
    history.push({
      pathname: "/",
      state: userDetails,
    });
  }

  const handleCreatorClick = (event) => {
    history.push({
      pathname: userDetails.user === "" ? "/" : "/creator/",
      state: userDetails,
    });
  }

  const handleProfileClick = (event) => {
    if (userDetails.id === "") {
      history.push({
        pathname: "/",
        state: userDetails,
      });
    } else {
      history.push({
        pathname: "/profile/" + userDetails.id,
        state: {
          userDetails: userDetails,
          featuredQuiz: null
        },
      });
    }

  };

  const handleDiscoverClick = (event) => {
    history.push({
      pathname: "/discover",
      state: userDetails,
    });
  }

  const handlePlatformClick = (event) => {
    history.push({
      pathname: "/platforms",
      state: userDetails,
    });
  }

  function saveSettings() {
    // TODO
    console.log("saving settings...");
  }

  function resetSettings() {
    // TODO
    console.log("resetting all settings...");
  }

  // TODO: Firebase backend gets random quiz ID, but not in time for Nav component to use
  const handleRandom = async () => {
    let randomQuizId = await FirestoreBackend.getRandomQuiz();

    history.push({
      pathname: "/preview/" + randomQuizId,
      state: randomQuizId,
    });
  };

  return (
    <div>
      <SettingsPopup
        show={modalShow}
        onHide={() => setModalShow(false)}
        handleSaveSettings={() => saveSettings()}
        handleResetSettings={() => resetSettings()}
      ></SettingsPopup>
      <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand style={{cursor:"pointer"}} onClick={handleHomeClick}>
            <img src={logo} width="50" height="50" alt="Trivia Arabica" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Nav.Link onClick={handleHomeClick} >Home</Nav.Link>
              <Nav.Link
                onClick={handleProfileClick}
              >
                Profile
              </Nav.Link>
              <Nav.Link onClick={handleCreatorClick}>
                Creator
              </Nav.Link>
              <Nav.Link onClick={handleDiscoverClick}>Discover</Nav.Link>
              <Nav.Link onClick={handlePlatformClick}>Platforms</Nav.Link>
              <Nav.Link onClick={handleRandom}>Random</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              <LoginLogout />
              <Navbar.Brand
                onClick={handleProfileClick}
                style={{cursor:"pointer"}}
              >
                <img

                  src={userIcon}
                  width="50"
                  height="50"
                  alt="user icon"
                  style={userIconStyle}
                />
              </Navbar.Brand>
              {/*<Navbar.Brand style={{cursor:"pointer"}} onClick={() => setModalShow(true)}>
                <img
                  src={settingsIcon}
                  width="50"
                  height="50"
                  alt="settings icon"
                ></img>
              </Navbar.Brand>*/}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navigation;