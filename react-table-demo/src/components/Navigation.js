import { Navbar, Nav, Container } from 'react-bootstrap';
import { default as logo } from "../logo.svg";
import { default as userIcon } from "../person-circle.svg";
import LoginLogout from './LoginLogout';

import { useAuthState } from '../Context/index'

function Navigation() {
  const userDetails = useAuthState()

  return (
    <div>
    <Navbar collapseOnSelect  expand='sm' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>
        <img
        src={logo}
        width = "50"
        height = "50"
        alt = "Trivia Arabica"
        />
      </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav>
            <Nav.Link href='/'>Home</Nav.Link>
            <Nav.Link href={userDetails.user==="" ? '/' : '/profile'}>Profile</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <LoginLogout />
            <Navbar.Brand href={userDetails.user==="" ? '/' : '/profile'}>
              <img
                src={userIcon}
                width = "50"
                height = "50"
                alt = "user icon"
                style={{filter:"invert(1)"}}
              />
            </Navbar.Brand>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </div>
  );
}

export default Navigation;