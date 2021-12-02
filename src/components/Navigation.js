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
  let userIconStyle = { filter: "invert(1)" };
  if (loggedIn) {
    userIcon = userDetails.imageUrl;
    userIconStyle = {};
  }

  const [modalShow, setModalShow] = useState(false);

  const history = useHistory();
  const handleOnClick = (event) => {
    history.push({
      pathname: "/profile/" + userDetails.id,
      state: userDetails,
    });
  };

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
    const random_quiz = await FirestoreBackend.getRandomQuiz();
    console.log("random quiz id: ", random_quiz);
    history.push({
      pathname: "/preview/" + random_quiz,
      state: userDetails,
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
          <Navbar.Brand href="/">
            <img src={logo} width="50" height="50" alt="Trivia Arabica" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link
                onClick={handleOnClick}
                href={
                  userDetails.user === "" ? "/" : "/profile/" + userDetails.id
                }
              >
                Profile
              </Nav.Link>
              <Nav.Link href={userDetails.user === "" ? "/" : "/creator/"}>
                Creator
              </Nav.Link>
              <Nav.Link href="/discover">Discover</Nav.Link>
              <Nav.Link href="/platforms">Platforms</Nav.Link>
              <Nav.Link onClick={handleRandom}>Random</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              <LoginLogout />
              <Navbar.Brand
                href={
                  userDetails.user === "" ? "/" : "/profile/" + userDetails.id
                }
              >
                <img
                  src={userIcon}
                  width="50"
                  height="50"
                  alt="user icon"
                  style={ userIconStyle }
                />
              </Navbar.Brand>
              <Navbar.Brand onClick={() => setModalShow(true)}>
                <img
                  src={settingsIcon}
                  width="50"
                  height="50"
                  alt="settings icon"
                ></img>
              </Navbar.Brand>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navigation;
