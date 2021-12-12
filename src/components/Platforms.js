import "../App.css";

import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAuthState } from "../Context/index";

import * as FirestoreBackend from "../services/Firestore.js";

import Background from "./Background.js";
import SearchPlatforms from './SearchPlatforms.js'
import { Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { getAuth } from "@firebase/auth";


// ------------- Platforms

function Platforms() {

  const userDetails = useAuthState();
  const auth = getAuth();

  const [createPlatformName, setCreatePlatformName] = useState("")
  const [modalShow, setModalShow] = useState(false);
  const [platformInvalid, setPlatformInvalid] = useState(false);

  const history = useHistory();

  const createPlatform = () => {
    const q = FirestoreBackend.createPlatform(createPlatformName, userDetails.id, userDetails.user, auth.currentUser.uid);
    q.then(res => {
      if (!res) {
        setPlatformInvalid(true)
      } else {
        //go to platform page to edit details/add people
        setModalShow(false)
        FirestoreBackend.addPlatformToUser(userDetails.id, res.id, createPlatformName, true)
        history.push("/platform/" + res.id);
      }
    });
  }

  const nameChanged = (e) => {
    setCreatePlatformName(e.target.value)
    setPlatformInvalid(false)
  }

  return (
    <Background>
      <br/>
      <h1>Quiz Platforms</h1>
      <h4>Platforms allow multiple users to create and dedicate quizzes to a unified collection</h4>

      <br/>
      <br/>

      { userDetails.user !== "" &&
      <Button
        onClick={() => setModalShow(true)}
      >
      Create Platform
      </Button>
      }
      <br/>
      <hr/>
      <SearchPlatforms/>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onExited={() => {
          setCreatePlatformName("")
          setPlatformInvalid(false)
        }}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Platform</Modal.Title>
        </Modal.Header>

        <Form>
          <InputGroup  className="mb-3">
            <Form.Control style={{marginLeft:"10px", marginRight:"10px", marginTop:"20px"}}
              onChange={nameChanged} isInvalid={platformInvalid}
              value={createPlatformName} aria-label="Default" placeholder="Platform Name"/>
            <Form.Control.Feedback
              style={{marginLeft:"10px", marginRight:"10px"}}
              type="invalid"> Requested platform name is taken. </Form.Control.Feedback>
          </InputGroup>
      </Form>
      <Modal.Footer>
        <Button onClick={createPlatform}>Create</Button>
        <Button onClick={() => setModalShow(false)} variant="secondary"> Cancel </Button>
      </Modal.Footer>
      </Modal>


    </Background>
  )
}

export default Platforms;