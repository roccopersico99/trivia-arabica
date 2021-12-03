import { Container, Row } from "react-bootstrap";
import PlatformCard from "./PlatformCard.js";

function ProfilePlatforms({ platforms }) {

  const rows = [...Array(Math.ceil(platforms.length / 3))];
  const platformRows = rows.map((row, index) => platforms.slice(index * 3, index * 3 + 3))

  let keys = 1;
  const content = platformRows.map((row, index) => (
    <Row className="row" key={index}>
      {row.map(platform => (
        <PlatformCard platform={platform} key={keys++}></PlatformCard>
      ))}
    </Row>));
  return (
    <Container>
      {content}
    </Container>
  );
}

export default ProfilePlatforms;