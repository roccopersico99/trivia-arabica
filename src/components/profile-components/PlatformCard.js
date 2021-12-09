import { Col, Card, Button, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";
import * as FirestoreBackend from "../../services/Firestore";

function PlatformCard(props) {
  const history = useHistory();
  const [platImg, setPlatImg] = useState("https://media.istockphoto.com/vectors/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-vector-id1193046540?k=20&m=1193046540&s=612x612&w=0&h=HQfBJLo1S0CJEsD4uk7m3EkR99gkICDdf0I52uAlk-8=")

  const req = FirestoreBackend.getPlatform(props.platform?.id)
  req.then(async res => {
    setPlatImg(await FirestoreBackend.getImageURL(res.data().imageURL))
  })

  const platClicked = () => {
    history.push("/platform/" + props.platform?.id);
  }

  return (
    <div onClick={platClicked} style={{cursor:"pointer", width:"fit-content", margin:"5px"}} >
    <Card as={Col} style={{ margin: "10px" }}>
      <Card.Body>
        <Card.Title>{props.platform?.data().name}</Card.Title>
        <Card.Img
          style={{maxHeight: "100%", height: "150px", maxWidth: "100%", width: "200px", backgroundSize: "contain" }}
          variant="top"
          src={platImg}
        ></Card.Img>
        <Card.Text>{props.platform?.data().owner ? "Owner" : "Contributor"}</Card.Text>
      </Card.Body>
    </Card>
  </div>
  );
}

export default PlatformCard;