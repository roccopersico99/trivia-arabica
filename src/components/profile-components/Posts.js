import { Container, ListGroup, Card, Button, Form } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import * as FirestoreBackend from "../../services/Firestore.js";

function Posts(props) {

  const [editing, setEditing] = useState(false)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts()
  }, [])

  const params = useParams();
  const titleAreaRef = useRef();
  const textAreaRef = useRef();

  const getPosts = async () => {
    setPosts([]);
    const post_snapshot = FirestoreBackend.getUserPagePosts(params.id);
      post_snapshot.then((doc_snapshot)=>{
        setPosts([]);
        for (const doc of doc_snapshot.docs) {
          console.log(doc.data());
          setPosts(posts => [...posts, doc.data()]);
        }
      })
  }

  const editingClicked = () => {
    setEditing(true)
  }
  const cancelClicked = () => {
    setEditing(false)
  }
  const savePressed = () => {
    //console.log(textAreaRef.current.value)
    FirestoreBackend.createUserPagePost(props.profile, params.id, titleAreaRef.current.value, textAreaRef.current.value)
    setEditing(false)
    titleAreaRef.current.value = ""
    textAreaRef.current.value = ""
    getPosts()
  }

  return (
    <Container>
      <div>
        <br>
        </br>
        <Form style={{display: editing ? 'block' : 'none'}}>
          <div class="form-group">
            <Form.Control type="text" ref={titleAreaRef} id="aboutText"></Form.Control>
            <Form.Control as ="textarea" ref={textAreaRef} id="aboutText" rows={3}></Form.Control>
          </div>
          <div class="form-group">
            {editing && <Button className="float-end" variant="success" onClick={savePressed}>Publish</Button>}
            {editing && <Button className="float-end" variant="danger"onClick={cancelClicked}>Cancel</Button>} 
            <br></br>
          </div>
        </Form>
        {(!editing) && <Button  className="my-3" onClick={editingClicked}>Add Post</Button>}
      </div>
      <br></br>
      <ListGroup>
      {posts.length > 0 ?
        (posts.map((post)=>(
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
