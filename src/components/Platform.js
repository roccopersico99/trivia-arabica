import "../App.css";

import { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useAuthState } from "../Context/index";

import * as FirestoreBackend from "../services/Firestore";

import Background from "./Background.js";
import { Spinner, Image, Form, Stack, Button, Tabs, Tab } from "react-bootstrap";

function Platform() {

  //000000000 states
  const [owner, setOwner] = useState()

  const [platformRef, setPlatformRef] = useState()
  const [platformName, setPlatformName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerID, setOwnerID] = useState("")
  const [isAContributor, setIsAContributor] = useState(false)
  const [platformImage, setPlatformImage] = useState()
  const [platformDescription, setPlatformDescription] = useState("")

  const [tempDescription, setTempDescription] = useState("")
  const [editingDesc, setEditingDesc] = useState(false)

  //000000000 misc consts
  const userDetails = useAuthState();
  const params = useParams();
  const history = useHistory();


  //000000000 hooks
  useEffect(() => {
    if (ownerID === userDetails.id) {
      setOwner(true)
    } else {
      setOwner(false)
    }
  }, [userDetails, ownerID])


  useEffect(() => {
    console.log("hi")
  }, [params.id])
  //000000000 functions
  const onImgUpld = async (event) => {
    setPlatformImage(URL.createObjectURL(event.target.files[0]))
    if (event.target.files[0] !== null && event.target.files[0] !== undefined) {
      const imgSnap = await FirestoreBackend.uploadFile(userDetails.id, event.target.files[0])
      FirestoreBackend.updateData(platformRef, { imageURL: imgSnap.ref.fullPath })
    }
  }

  const changeDescriptionPressed = () => {
    setTempDescription(platformDescription)
    setEditingDesc(true)
  }

  const tempDescChanged = (e) => {
    setTempDescription(e.target.value)
  }

  const saveDescription = () => {
    setPlatformDescription(tempDescription)
    FirestoreBackend.updateData(platformRef, { description: tempDescription })
    setEditingDesc(false)
  }

  const cancelDescription = () => {
    setTempDescription("")
    setEditingDesc(false)
  }



  //000000000 setup
  if (params.id === "" || params.id === undefined) {
    history.push("/");
  }

  if (owner === undefined) {
    const req = FirestoreBackend.getPlatform(params.id)
    req.then(async res => {
      setPlatformRef(res.ref)
      setPlatformName(res.data().name)
      setOwnerName(res.data().owner_name)
      setOwnerID(res.data().owner_id)
      if (res.data().imageURL !== "") {
        setPlatformImage(await FirestoreBackend.getImageURL(res.data().imageURL))
      }
      setPlatformDescription(res.data().description)
    });

    //000000000 renders
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
    )
  } else {
    return (
      <Background>
      <br/>
      <h1>{platformName}</h1>
      <h4 style={{cursor:"pointer"}} onClick={() => history.push("/profile/"+ownerID)}> Owner: {ownerName}</h4>
      <br/>
      {platformImage!==undefined && <Image
        style={{ width: "250px", backgroundSize: "cover" }}
        src={platformImage}
        alt="Platform Image"
      ></Image>}
      <Stack style={{alignItems:"center", marginTop:"50px"}}>
      {owner &&
      <Form.Group controlId="formFile" className="mb-3">
        Platform Image
        <Form.Control onChange={onImgUpld} accept=".jpg, .jpeg, .png" type="file" />
      </Form.Group>
    }
    </Stack>
      <br/>
      {!editingDesc && <p>{platformDescription}</p>}
      {(owner && !editingDesc )&&
        <Button onClick={changeDescriptionPressed}>Change Description</Button>
      }
      {(owner && editingDesc) &&
        <>
        <Form style={{width:"60%", margin:"auto", marginBottom:"20px"}}>
          <Form.Control as ="textarea" id="aboutText" onChange={tempDescChanged} value={tempDescription} rows={3}></Form.Control>
        </Form>
        <Button style={{marginRight:"5px"}} onClick={saveDescription}>Save</Button>
        <Button style={{marginLeft:"5px"}} onClick={cancelDescription} variant="secondary">Cancel</Button>
        </>
      }
      <Tabs>
        <Tab eventKey="quizzes" title="Quizzes">

        </Tab>
        <Tab eventKey="users" title="Contributors">

        </Tab>
        {owner &&
        <Tab eventKey="requests" title="Join Requests">

        </Tab>}
      </Tabs>
      </Background>
    )
  }
}


export default Platform;