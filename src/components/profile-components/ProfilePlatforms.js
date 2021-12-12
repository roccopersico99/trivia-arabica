import { Container } from "react-bootstrap";
import PlatformCard from "./PlatformCard.js";

function ProfilePlatforms(props) {
  return (
    <Container style={{display: "flex", flexWrap:"wrap"}}>
      {props.platforms.map((platform, index) => (
          <PlatformCard setFeaturedPlatformProp={props.setFeaturedPlatformProp}  featuredPlatform={props.featuredPlatform} userDetails={props.userDetails} ownProfile={props.ownProfile} platform={platform} key={index}></PlatformCard>
      ))}
    </Container>
  );
}

export default ProfilePlatforms;