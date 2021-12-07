import { Container, ListGroup, Card, Button, Form } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import * as FirestoreBackend from "../../services/Firestore.js";

function Posts(props) {

  const [editing, setEditing] = useState(false)
  const [posts, setPosts] = useState([]);
  const [isLiked, setIsLiked] = useState(0);

  useEffect(() => {
    getPosts()
  }, [])

  const params = useParams();
  const titleAreaRef = useRef();
  const textAreaRef = useRef();

  async function handleLike() {

  }

  async function handleDislike() {

  }

  function handleDelete(index) {
    console.log(index);
    console.log(posts[index].ref);
    FirestoreBackend.deleteUserPagePost(params.id, posts[index].ref);
    getPosts();
  }

  const getPosts = async () => {
    setPosts([]);
    const post_snapshot = FirestoreBackend.getUserPagePosts(params.id);
    post_snapshot.then(async (doc_snapshot) => {
      setPosts([]);
      for (const doc of doc_snapshot.docs) {
        // console.log(doc.data());
        const poster_name = await FirestoreBackend.getUser(doc.data().post_creator);
        const postdata = doc.data();
        postdata.name = poster_name.data().display_name;
        postdata.ref = doc.ref.id;
        //console.log(postdata);
        setPosts(posts => [...posts, postdata]);
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
    FirestoreBackend.createUserPagePost(props.profile, params.id, titleAreaRef.current.value, textAreaRef.current.value, props.uid)
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
        {(!editing && props.profile !== '') && <Button  className="my-3" onClick={editingClicked}>Add Post</Button>}
      </div>
      <br></br>
      <ListGroup>
      {posts.length > 0 ?
        (posts.map((post, index) =>(
          <Card>
            <Card.Body className="post">
              {((!post.post_deleted) && (params.id === props.profile || post.post_creator === props.profile)) && <Button onClick={()=>{handleDelete(index)}} className="float-right" variant="danger">Delete</Button>}
              {(post.post_deleted !== true) && <Card.Title>{post.post_title}</Card.Title>}
              <Card.Subtitle className="post mb-2 text-muted">
                {"posted by: " + post.name}<br></br>
                {post.publish_date.toDate().toLocaleDateString() + " at " + post.publish_date.toDate().toLocaleTimeString()}
              </Card.Subtitle>
              {(post.post_deleted !== true) && <Card.Text className="post">{post.post_text}</Card.Text>}
              {(post.post_deleted === true) && <Card.Text className="post font-italic font-weight-lighter">{"This post has been deleted"}</Card.Text>}
              {/* {props.profile !== "" && <Button onClick={handleLike} variant="light" disabled={isLiked === 1}><FaThumbsUp /></Button>}
              {props.profile !== "" && <Button onClick={handleDislike} variant="light" disabled={isLiked === 2}><FaThumbsDown /></Button>} */}
            </Card.Body>
          </Card>
        ))) : <div>Make your first post!</div>}
      </ListGroup>
    </Container>
  );
}

export default Posts;