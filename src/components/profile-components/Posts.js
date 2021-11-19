import { Container, ListGroup, Card, Button } from "react-bootstrap";

function Posts(props) {
  return (
    <Container>
      <Button className="my-3">Add Post</Button>
      <ListGroup>
        {props.posts?.length > 0 ?
          (props.posts?.map((post) => (
            <Card>
              <Card.Body>
                <Card.Title>{post.post_title + " by userID: " + post.post_creator}</Card.Title>
                <Card.Text>{post.publish_date.toDate().toString() + "\n" + post.post_text}</Card.Text>
                <Button variant="success">Like</Button>
                <Button variant="danger">Dislike</Button>
              </Card.Body>
            </Card>
          ))) : <div>Make your first post!</div>}
      </ListGroup>
    </Container>
  );
}

export default Posts;
