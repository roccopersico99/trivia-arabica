import { Button, Form } from "react-bootstrap"
import { useRef, useState } from 'react'

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
      {(!editing && props.about.allowed) && <Button variant="info" onClick={editingClicked}>Edit</Button>}
      {editing && <Button variant="success" onClick={savePressed}>Save</Button>}
      {editing && <Button variant="danger" onClick={cancelClicked}>Cancel</Button>}
    </div>
  );
}

export default About;