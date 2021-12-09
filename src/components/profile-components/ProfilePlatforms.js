import { Container, Row } from "react-bootstrap";
import PlatformCard from "./PlatformCard.js";

function ProfilePlatforms({ platforms }) {
  return (
    <Container style={{display: "flex", flexWrap:"wrap"}}>
      {platforms.map((platform, index) => (
          <PlatformCard platform={platform} key={index}></PlatformCard>
      ))}
    </Container>
  );
}

export default ProfilePlatforms;