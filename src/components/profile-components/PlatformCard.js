import { Col, Card, Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import * as FirestoreBackend from "../../services/Firestore";
import { default as logo } from "../../logo.svg";

function PlatformCard(props) {
  const history = useHistory();
  const [platImg, setPlatImg] = useState("https://media.istockphoto.com/vectors/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-vector-id1193046540?k=20&m=1193046540&s=612x612&w=0&h=HQfBJLo1S0CJEsD4uk7m3EkR99gkICDdf0I52uAlk-8=")

  if (props.platform?.data() === undefined) {
    return (<></>)
  }
  const req = FirestoreBackend.getPlatform(props.platform?.id)
  req.then(async res => {
    setPlatImg(await FirestoreBackend.getImageURL(res.data().imageURL))
  })

  const platClicked = () => {
    history.push("/platform/" + props.platform?.id);
  }

  const handleFeatured = () => {
    FirestoreBackend.setUserFeaturedPlatform(props.userDetails.id, props.platform.id)
    props.setFeaturedPlatformProp(props.platform)
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <p
      style={{cursor:"pointer"}}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <span className="threedots" />
    </p>));


  return (
    <div style={{maxWidth:"calc(95% / 3)", display:"inline-flex"}} >

      <Card as={Col} style={{ margin: "10px" }}>
        <h3>{props.heading}</h3>
        {props.ownProfile &&
        <Dropdown style={{position:"absolute", right:"0"}}>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item disabled={props.featuredPlatform?.id === props.platform?.id} onClick={handleFeatured}>Set Featured</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      }
        <Card.Body style={{cursor:"pointer"}} onClick={platClicked}>
          <Card.Title>{props.platform?.data().name}</Card.Title>
          <Card.Img
            style={{maxHeight: "100%", height: "150px", maxWidth: "100%", width: "200px", backgroundSize: "contain" }}
            variant="top"
            src={platImg === "" ? logo : platImg}
          ></Card.Img>
          {props.platform?.data().owner!==undefined && <Card.Text>{props.platform?.data().owner ? "Owner" : "Contributor"}</Card.Text>}
        </Card.Body>
      </Card>
    </div>
  );

}

export default PlatformCard;