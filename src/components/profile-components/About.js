import { Button, Form, InputGroup } from "react-bootstrap"
import { useRef, useState } from 'react'

function About(props) {

  const [editing, setEditing] = useState(false)

  const [youtubeInvalid, setYoutubeInvalid] = useState(false)
  const [facebookInvalid, setFacebookInvalid] = useState(false)
  const [twitterInvalid, setTwitterInvalid] = useState(false)
  const [redditInvalid, setRedditInvalid] = useState(false)

  const [prevDesc, setPrevDesc] = useState("")
  const [descInvalid, setDescInvalid] = useState(false)

  const textAreaRef = useRef();
  const aboutParaRef = useRef();

  const savePressed = () => {
    //console.log(textAreaRef.current.value)
    props.about.description = textAreaRef.current.value
    props.setAboutText(textAreaRef.current.value)
    setEditing(false)
  }

  const descChanged = (e) => {
    if (e.target.value.length > 600) {
      setDescInvalid(true)
      textAreaRef.current.value = prevDesc
    } else {
      setDescInvalid(false)
      setPrevDesc(textAreaRef.current.value)
    }
  }

  const editingClicked = () => {
    setPrevDesc(props.about.description)
    setEditing(true)
    textAreaRef.current.value = props.about.description
  }
  const cancelClicked = () => {
    setEditing(false)
  }

  const onYTChanged = (e) => {
    props.setYoutube(e.target.value)
    setYoutubeInvalid(false)
  }

  const onFBChanged = (e) => {
    props.setFacebook(e.target.value)
    setFacebookInvalid(false)
  }

  const onTwitterChanged = (e) => {
    props.setTwitter(e.target.value)
    setTwitterInvalid(false)
  }

  const onRedditChanged = (e) => {
    props.setReddit(e.target.value)
    setRedditInvalid(false)
  }

  const saveSocialsClicked = () => {
    //if valid:
    if (props.youtube.startsWith("https://www.youtube.com/") || props.youtube.startsWith("https://youtube.com/")) {
      props.setYoutubeLink(props.youtube)
    } else if (props.youtube.startsWith("youtube.com/") || props.youtube.startsWith("www.youtube.com/")) {
      props.setYoutube("https://" + props.youtube)
      props.setYoutubeLink("https://" + props.youtube)
    } else if (props.youtube === "") {
      props.setYoutubeLink(props.youtube)
    } else {
      setYoutubeInvalid(true)
    }

    if (props.facebook.startsWith("https://www.facebook.com/") || props.facebook.startsWith("https://facebook.com/")) {
      props.setFacebookLink(props.facebook)
    } else if (props.facebook.startsWith("facebook.com/") || props.facebook.startsWith("www.facebook.com/")) {
      props.setFacebook("https://" + props.facebook)
      props.setFacebookLink("https://" + props.facebook)
    } else if (props.facebook === "") {
      props.setFacebookLink(props.facebook)
    } else {
      setFacebookInvalid(true)
    }

    if (props.twitter.startsWith("https://www.twitter.com/") || props.twitter.startsWith("https://twitter.com/")) {
      props.setTwitterLink(props.twitter)
    } else if (props.twitter.startsWith("twitter.com/") || props.twitter.startsWith("www.twitter.com/")) {
      props.setTwitter("https://" + props.twitter)
      props.setTwitterLink("https://" + props.twitter)
    } else if (props.twitter === "") {
      props.setTwitterLink(props.twitter)
    } else {
      setTwitterInvalid(true)
    }

    if (props.reddit.startsWith("https://www.reddit.com/user/") || props.reddit.startsWith("https://reddit.com/user/")) {
      props.setRedditLink(props.reddit)
    } else if (props.reddit.startsWith("reddit.com/user/") || props.reddit.startsWith("www.reddit.com/user/")) {
      props.setReddit("https://" + props.reddit)
      props.setRedditLink("https://" + props.reddit)
    } else if (props.reddit === "") {
      props.setRedditLink(props.reddit)
    } else {
      setRedditInvalid(true)
    }
  }

  return (
    <div>
      <h4>{props.about.content}</h4>
      <p ref={aboutParaRef}>{props.about.description}</p>
      <Form hasValidation style={{display: editing ? 'block' : 'none'}}>
        <Form.Control isInvalid={descInvalid} as ="textarea" onChange={descChanged} ref={textAreaRef} id="aboutText" rows={3}></Form.Control>
        <Form.Control.Feedback
          style={{marginLeft:"10px", marginRight:"10px"}}
          type="invalid"> Character count cannot exceed 600.
        </Form.Control.Feedback>

      </Form>
      {(!editing && props.about.allowed) && <Button variant="info" onClick={editingClicked}>Edit</Button>}
      {editing && <Button variant="success" onClick={savePressed}>Save</Button>}
      {editing && <Button variant="danger" onClick={cancelClicked}>Cancel</Button>}


      {(props.about.allowed) && (
        <div style={{width: "60%", margin:"auto"}}>
          <br></br>
          <br></br>
          <Form>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default"> YouTube </InputGroup.Text>
              <Form.Control isInvalid={youtubeInvalid} aria-label="Default" onChange={onYTChanged} value={props.youtube} placeholder="https://www.youtube.com/channel/"/>
            </InputGroup>
            <InputGroup hasValidation className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default"> Facebook </InputGroup.Text>
              <Form.Control isInvalid={facebookInvalid} aria-label="Default" onChange={onFBChanged} value={props.facebook} placeholder="https://www.facebook.com/"/>
            </InputGroup>
            <InputGroup hasValidation className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default"> Twitter </InputGroup.Text>
              <Form.Control isInvalid={twitterInvalid} aria-label="Default" onChange={onTwitterChanged} value={props.twitter} placeholder="https://twitter.com/"/>
            </InputGroup>
            <InputGroup hasValidation className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default"> Reddit </InputGroup.Text>
              <Form.Control isInvalid={redditInvalid} aria-label="Default" onChange={onRedditChanged} value={props.reddit} placeholder="https://www.reddit.com/user/"/>
            </InputGroup>
            <Button variant="success" onClick={saveSocialsClicked}>Save Social Media</Button>
        </Form>
        </div>
      )}

    </div>
  );
}

export default About;