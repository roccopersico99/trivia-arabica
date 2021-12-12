import { Container, Col, Row, Card } from "react-bootstrap";
import QuizCard from "./QuizCard.js";
import PlatformCard from "./PlatformCard.js"

function ProfileHome(props) {
  return (
    <Container>
      <Row style={{justifyContent:"center"}}>
        <h3> Featured </h3>
        {props.featuredQuiz !== undefined &&
        <QuizCard
          heading={"Featured Quiz"}
          as={Col}
          quiz={props.featuredQuiz}
        ></QuizCard>
        }

        {props.featuredPlatform !== undefined && <PlatformCard
          heading={"Featured Platform"}
          as={Col}
          platform={props.featuredPlatform}
          >
        </PlatformCard>
        }

        {props.noFeatured &&
          <h2> User has no featured content. </h2>
        }
      </Row>
    </Container>
  );
}

export default ProfileHome;