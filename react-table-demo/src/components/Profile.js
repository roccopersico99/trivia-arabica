import '../App.css';
import Background from './Background.js'
import { Image, Container, Button, Row, Col, Stack, Tab, Tabs } from 'react-bootstrap';
import Home from './profile-components/ProfileHome';
import Quizzes from './profile-components/Quizzes';
import Posts from './profile-components/Posts';
import About from './profile-components/About';

function Profile() {

  return (
    <Background>
      <Image
        style={{ width: '100%', height: '200px', 'object-fit': 'cover' }}
        src="https://image.freepik.com/free-vector/abstract-dotted-banner-background_1035-18160.jpg"
        alt="Banner">
      </Image>

      <Container>
        <Row>
          <Col lg="3">
            <Image
              style={{ top: '-25px', position: 'relative', height: '150px', width: '150px' }}
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt='Profile'>
            </Image>
          </Col>

          <Stack>
            <br></br>
            <div>Display Name</div>
            <br></br>
            <Button>Follow</Button>
          </Stack>

        </Row>

        <Row>
          <Col>
            <Tabs>
              <Tab eventKey="home" title="Home">
                <Home></Home>
              </Tab>
              <Tab eventKey="quizzes" title="Quizzes">
                <Quizzes></Quizzes>
              </Tab>
              <Tab eventKey="posts" title="Posts">
                <Posts></Posts>
              </Tab>
              <Tab eventKey="about" title="About">
                <About></About>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>

    </Background >
  );
}

export default Profile;