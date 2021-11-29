import { Navbar, Nav, Container } from "react-bootstrap";
import { default as logo } from "../logo.svg";
import { default as userIcon } from "../person-circle.svg";
import { default as settingsIcon } from "../settings-icon.png";
import LoginLogout from "./LoginLogout";

import { useAuthState } from "../Context/index";
import { useHistory } from "react-router-dom";
import { useState } from "react"
import SettingsPopup from "./SettingsPopup";

function Navigation() {
  const userDetails = useAuthState();

  const [modalShow, setModalShow] = useState(false);

  const history = useHistory();
  const handleOnClick = (event) => {
    history.push({
      pathname: "/profile/" + userDetails.id,
      state: userDetails
    });
  };

  function saveSettings() {
    console.log("saving settings...")
  }

  function resetSettings() {
    console.log("resetting all settings...")
  }

  return (
    <div>
      <SettingsPopup show={modalShow} onHide={() => setModalShow(false)} handleSaveSettings={() => saveSettings()} handleResetSettings={() => resetSettings()} ></SettingsPopup>
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
              <Nav.Link href={
                  userDetails.user === "" ? "/" : "/creator/"
                }>Creator</Nav.Link>
              <Nav.Link href="/discover">Discover</Nav.Link>
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
                  style={{ filter: "invert(1)" }}
                />
              </Navbar.Brand>
              <Navbar.Brand onClick={() => setModalShow(true)}>
                <img src={settingsIcon} width="50" height="50" alt="settings icon"></img>
              </Navbar.Brand>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navigation;
