import { Button, Form } from "react-bootstrap"
import { useRef, useEffect, useState } from 'react'

function About(props) {

  const [editing, setEditing] = useState(false)

  const textAreaRef = useRef();

  const savePressed = () => {
    //console.log(textAreaRef.current.value)
    props.helper(textAreaRef.current.value)
    setEditing(false)
  }

  const editingClicked = () => {
    setEditing(true)
    textAreaRef.current.value = props.about.description
  }
  const cancelClicked = () => {
    setEditing(false)
  }

  return (
    <div>
      <p>{props.about.content}</p>
      <p>{props.about.description}</p>
      <Form style={{display: editing ? 'block' : 'none'}}>
        <Form.Control as ="textarea" ref={textAreaRef} id="aboutText" rows={3}></Form.Control>
      </Form>
      {!editing && <Button onClick={editingClicked}>Edit</Button>}
      {editing && <Button onClick={savePressed}>Save</Button>}
      {editing && <Button onClick={cancelClicked}>Cancel</Button>}
    </div>
  );
}

export default About;