import { Container } from "react-bootstrap";
import PlatformCard from "./PlatformCard.js";

function ProfilePlatforms(props) {
  if (props.platforms.length === 0) {
    return (
      <Container>
        <h3 style={{marginTop:"20px"}}> User is in no platforms </h3>
      </Container>
    )
  } else {
    return (
      <Container style={{display: "flex", flexWrap:"wrap"}}>
        {props.platforms.map((platform, index) => (
            <PlatformCard setFeaturedPlatformProp={props.setFeaturedPlatformProp}  featuredPlatform={props.featuredPlatform} userDetails={props.userDetails} ownProfile={props.ownProfile} platform={platform} key={index}></PlatformCard>
        ))}
      </Container>
    );
  }
}

export default ProfilePlatforms;