import "../App.css";

import { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useAuthState } from "../Context/index";

import * as FirestoreBackend from "../services/Firestore";

import Background from "./Background.js";
import { Spinner, Image, Form, Stack, Button, Tabs, Tab, ListGroup } from "react-bootstrap";

function Platform() {

  //000000000 states
  const [owner, setOwner] = useState()
  const [member, setMember] = useState()
  const [applied, setApplied] = useState(false) //true if user has already applied, which disables the button

  const [applicants, setApplicants] = useState([])
  const [members, setMembers] = useState([])

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
  useEffect(async () => {
    if (ownerID === userDetails.id) {
      setOwner(true)
      populateApplicants()
      populateMembers()
    } else {
      setOwner(false)
      if (userDetails.id !== undefined && userDetails.id !== "") {
        const appReq = FirestoreBackend.isUserAppliedPlatform(userDetails.id, params.id)
        appReq.then(res => {
          setApplied(res.exists)
        })
        const memReq = FirestoreBackend.isUserInPlatform(userDetails.id, params.id)
        memReq.then(res => {
          setMember(res.exists)
        })
        populateMembers()
      }
    }
  }, [userDetails, ownerID])


  useEffect(() => {
    //console.log("hi")

  }, [params.id])


  //000000000 functions
  const populateMembers = async () => {
    const memreq = await FirestoreBackend.getMembers(params.id)
    let memArray = [{ name: (ownerName + " (Owner)"), id: ownerID }]
    memreq.forEach(member => {
      let user = {
        name: member.data().name,
        id: member.id
      }
      memArray.push(user)
    })
    setMembers(memArray)
  }

  const populateApplicants = async () => {
    const req = await FirestoreBackend.getApplicants(params.id)
    let tempArray = []
    req.forEach(applicant => {
      let user = {
        name: applicant.data().name,
        id: applicant.id
      }
      tempArray.push(user)
    })
    setApplicants(tempArray)
  }

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

  const attemptApply = () => {
    const apply = FirestoreBackend.applyForPlatform(userDetails.id, params.id, userDetails.user)
    apply.then(res => {
      setApplied(true)
    })
  }

  const acceptPressed = async (id, name) => {
    if (!owner) { return }
    const app = await FirestoreBackend.acceptUserApplication(id, params.id, name)
    FirestoreBackend.addPlatformToUser(id, params.id, platformName, false)

    populateApplicants()
    populateMembers()
  }

  const denyPressed = async (id) => {
    if (!owner) { return }
    FirestoreBackend.denyUserApplication(id, params.id)

    populateApplicants()
  }

  //000000000 setup
  if (params.id === "" || params.id === undefined) {
    history.push("/");
  }

  if (owner === undefined) {
    const req = FirestoreBackend.getPlatform(params.id)
    req.then(async res => {
      if (!res.exists) { //platform DNE
        history.push("/");
        return
      }
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
      {(!owner && !member) && <Button onClick={attemptApply} disabled={applied}> {!applied ? "Apply to join platform" : "Applied!"} </Button>}
      <br/>
      <br/>
      <Tabs>
        <Tab eventKey="quizzes" title="Quizzes">

        </Tab>
        <Tab eventKey="users" title="Contributors">
          <ListGroup style={{cursor:"pointer"}}>
            {members.map((member, index) => (
              <ListGroup.Item style={{cursor:"pointer"}} onClick={() => history.push("/profile/"+member.id)} key={index} style={{textAlign:'left'}}>
                {member.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Tab>
        {owner &&
        <Tab eventKey="requests" title="Join Requests">
          <ListGroup>
            {applicants.map((applicant, index) => (
              <ListGroup.Item key={index} style={{textAlign:'left'}}>
                {applicant.name}
                <Button variant="danger" onClick={() => denyPressed(applicant.id)} style={{float: 'right', marginLeft:"5px"}}>X</Button>
                <Button variant="success" onClick={() => acceptPressed(applicant.id, applicant.name)} style={{float: 'right'}}>✓</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Tab>}
      </Tabs>
      </Background>
    )
  }
}


export default Platform;