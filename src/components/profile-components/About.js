import { Button, Form, InputGroup, FormControl } from "react-bootstrap"
import { useRef, useState } from 'react'

function About(props) {

  const [editing, setEditing] = useState(false)

  const textAreaRef = useRef();

  const savePressed = () => {
    //console.log(textAreaRef.current.value)
    props.setAboutText(textAreaRef.current.value)
    setEditing(false)
  }

  const editingClicked = () => {
    setEditing(true)
    textAreaRef.current.value = props.about.description
  }
  const cancelClicked = () => {
    setEditing(false)
  }

  const onYTChanged = (e) => {
    props.setYoutube(e.target.value)
  }

  const onFBChanged = (e) => {
    props.setFacebook(e.target.value)
  }

  const onTwitterChanged = (e) => {
    props.setTwitter(e.target.value)
  }

  const onRedditChanged = (e) => {
    props.setReddit(e.target.value)
  }

  const saveSocialsClicked = () => {
    //if valid:
    if (props.youtube.startsWith("https://www.youtube.com/") || props.youtube.startsWith("https://youtube.com/")) {
      props.setYoutubeLink(props.youtube)
    } else if (props.youtube.startsWith("youtube.com/") || props.youtube.startsWith("www.youtube.com/")) {
      props.setYoutubeLink("https://" + props.youtube)
    } else if (props.youtube === "") {
      props.setYoutubeLink(props.youtube)
    }

    if (props.facebook.startsWith("https://www.facebook.com/") || props.facebook.startsWith("https://facebook.com/")) {
      props.setFacebookLink(props.facebook)
    } else if (props.facebook.startsWith("facebook.com/") || props.facebook.startsWith("www.facebook.com/")) {
      props.setFacebookLink("https://" + props.facebook)
    } else if (props.facebook === "") {
      props.setFacebookLink(props.facebook)
    }

    if (props.twitter.startsWith("https://www.twitter.com/") || props.twitter.startsWith("https://twitter.com/")) {
      props.setTwitterLink(props.twitter)
    } else if (props.twitter.startsWith("twitter.com/") || props.twitter.startsWith("www.twitter.com/")) {
      props.setTwitterLink("https://" + props.twitter)
    } else if (props.twitter === "") {
      props.setTwitterLink(props.twitter)
    }

    if (props.reddit.startsWith("https://www.reddit.com/user/") || props.reddit.startsWith("https://reddit.com/user/")) {
      props.setRedditLink(props.reddit)
    } else if (props.reddit.startsWith("reddit.com/user/") || props.reddit.startsWith("www.reddit.com/user/")) {
      props.setRedditLink("https://" + props.reddit)
    } else if (props.reddit === "") {
      props.setRedditLink(props.reddit)
    }
  }

  return (
    <div>
      <h4>{props.about.content}</h4>
      <p>{props.about.description}</p>
      <Form style={{display: editing ? 'block' : 'none'}}>
        <Form.Control as ="textarea" ref={textAreaRef} id="aboutText" rows={3}></Form.Control>
      </Form>
      {(!editing && props.about.allowed) && <Button variant="info" onClick={editingClicked}>Edit</Button>}
      {editing && <Button variant="success" onClick={savePressed}>Save</Button>}
      {editing && <Button variant="danger" onClick={cancelClicked}>Cancel</Button>}


      {(props.about.allowed) && (
        <div style={{width: "60%", margin:"auto"}}>
          <br></br>
          <br></br>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default"> YouTube </InputGroup.Text>
            <FormControl aria-label="Default" onChange={onYTChanged} value={props.youtube} placeholder="https://www.youtube.com/channel/"/>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default"> Facebook </InputGroup.Text>
            <FormControl aria-label="Default" onChange={onFBChanged} value={props.facebook} placeholder="https://www.facebook.com/"/>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default"> Twitter </InputGroup.Text>
            <FormControl aria-label="Default" onChange={onTwitterChanged} value={props.twitter} placeholder="https://twitter.com/"/>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default"> Reddit </InputGroup.Text>
            <FormControl aria-label="Default" onChange={onRedditChanged} value={props.reddit} placeholder="https://www.reddit.com/user/"/>
          </InputGroup>
          <Button variant="success" onClick={saveSocialsClicked}>Save Social Media</Button>
        </div>
      )}

    </div>
  );
}

export default About;