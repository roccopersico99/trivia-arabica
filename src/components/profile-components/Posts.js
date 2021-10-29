import { Container, ListGroup, Card, Button } from "react-bootstrap";

function Posts(props) {
  return (
    <Container>
      <ListGroup>
        <Card>
          <Card.Body>
            <Card.Title>{props.posts[0].title}</Card.Title>
            <Card.Text>{props.posts[0].content}</Card.Text>
            <Button variant="success">Like</Button>
            <Button variant="danger">Dislike</Button>
          </Card.Body>
        </Card>

        <br></br>

        <Card>
          <Card.Body>
            <Card.Title>{props.posts[1].title}</Card.Title>
            <Card.Text>{props.posts[1].content}</Card.Text>
            <Button variant="success">Like</Button>
            <Button variant="danger">Dislike</Button>
          </Card.Body>
        </Card>
      </ListGroup>
    </Container>
  );
}

export default Posts;
