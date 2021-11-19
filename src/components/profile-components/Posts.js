import { Container, ListGroup, Card, Button } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useState } from 'react';
import * as FirestoreBackend from '../../services/Firestore';
import { useAuthState } from "../../Context/index";

function Posts(props) {
  const userDetails = useAuthState();
  return (
    <Container>
      {props.allowed ?
        <Button className="my-3">Add Post</Button> : () => { }
      }
      <ListGroup>
        {props.posts?.length > 0 ?
          (props.posts?.map((post) => (
            <Card>
              <Card.Body>
                <Card.Title>{post.post_title + " by userID: " + post.post_creator}</Card.Title>
                <Card.Text>{post.publish_date.toDate().toString() + "\n" + post.post_text}</Card.Text>
                <Button variant="light"><FaThumbsUp /></Button>
              </Card.Body>
            </Card>
          ))) : <div>Make your first post!</div>}
      </ListGroup>
    </Container>
  );
}

export default Posts;
