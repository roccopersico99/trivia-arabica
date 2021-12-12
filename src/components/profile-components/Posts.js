import { Container, ListGroup, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import * as FirestoreBackend from "../../services/Firestore.js";
import { getAuth } from "firebase/auth";

function Posts(props) {
  const auth = getAuth()
  const [editing, setEditing] = useState(false)
  const [posts, setPosts] = useState([]);
  const [lastPostSnapshot, setLastPostSnapshot] = useState("")
  const [noMorePosts, setNoMorePosts] = useState(false)
  const page = window.location.pathname.split("/")[1];

  useEffect(() => {
    getPosts()
  }, [])

  const params = useParams();
  const titleAreaRef = useRef();
  const textAreaRef = useRef();

  function handleDelete(index) {
    console.log(index);
    console.log(posts[index].ref);
    FirestoreBackend.deleteUserPagePost(params.id, posts[index].ref);
    getPosts();
  }

  const getPosts = async () => {
    FirestoreBackend.getPagePosts(page, params.id, 6).then(async (doc_snapshot) => processPosts(doc_snapshot));
  }

  function processPosts(doc_snapshot) {
    let postlist = [];
    let counter = doc_snapshot.docs.length;
    if(counter < 6){
      setNoMorePosts(true);
    }
    doc_snapshot.docs.forEach(async (doc, index) => {
      const poster_name = await FirestoreBackend.getUser(doc.data().post_creator);
      const postdata = doc.data();
      postdata.name = poster_name.data().display_name;
      postdata.ref = doc.ref.id;
      postlist[index] = postdata;
      if(index == doc_snapshot.docs.length-1) {
        setLastPostSnapshot(doc)
      }
      counter -= 1;
      if(counter === 0){
        setPosts(posts.concat(postlist))
      }
    })
  }

  function loadMore() {
    FirestoreBackend.getPagePosts(page, params.id, 6, lastPostSnapshot).then(async (doc_snapshot) => processPosts(doc_snapshot));
  }

  const editingClicked = () => {
    setEditing(true)
  }
  const cancelClicked = () => {
    setEditing(false)
  }
  const savePressed = () => {
    //console.log(textAreaRef.current.value)
    console.log(props.profile)
    switch(page) {
      case "profile":
        FirestoreBackend.createPagePost("users", "user_posts", props.profile, params.id, titleAreaRef.current.value, textAreaRef.current.value, auth.currentUser.uid)
        break;
      case "preview":
        FirestoreBackend.createPagePost("quizzes", "quiz_posts", props.profile, params.id, titleAreaRef.current.value, textAreaRef.current.value, auth.currentUser.uid)
        break;
    } 
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
          <div className="form-group">
            <Form.Control type="text" ref={titleAreaRef} id="aboutText"></Form.Control>
            <Form.Control as ="textarea" ref={textAreaRef} id="aboutText" rows={3}></Form.Control>
          </div>
          <div className="form-group">
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
          <Card key={index}>
            <Card.Body className="post">
              {((!post.post_deleted) && (params.id === props.profile || post.post_creator === props.profile)) && <Button onClick={()=>{handleDelete(index)}} className="float-right" variant="danger">Delete</Button>}
              {(post.post_deleted !== true) && <Card.Title>{post.post_title}</Card.Title>}
                <Card.Subtitle className="post mb-2 text-muted">
                  {"posted by: "} 
                  <Link className="post mb-2 text-muted"
                  to={{ pathname: "/profile/" + post.post_creator }}
                  style={{ textDecoration: 'none' }}>
                  {post.name}<br></br>
                  </Link>
                  {post.publish_date.toDate().toLocaleDateString() + " at " + post.publish_date.toDate().toLocaleTimeString()}
                </Card.Subtitle>
              {(post.post_deleted !== true) && <Card.Text className="post">{post.post_text}</Card.Text>}
              {(post.post_deleted === true) && <Card.Text className="post font-italic font-weight-lighter">{"This post has been deleted"}</Card.Text>}
              {/* {props.profile !== "" && <Button onClick={handleLike} variant="light" disabled={isLiked === 1}><FaThumbsUp /></Button>}
              {props.profile !== "" && <Button onClick={handleDislike} variant="light" disabled={isLiked === 2}><FaThumbsDown /></Button>} */}
            </Card.Body>
          </Card>
      ))) : 
      <div>
        {page === "profile" && <div>Make your first post!</div>}
        {page === "preview" && <div>Be the first to post on this quiz!</div>}
      </div>}
      
      </ListGroup>
      {posts.length > 0 && 
        <div>
          <br></br>
          <Button onClick={loadMore} disabled={noMorePosts}>Load More</Button>
          <br></br>
          <br></br>
        </div>}
    </Container>
  );
}

export default Posts;