import { Modal, Form, Button } from "react-bootstrap"
import { useState } from "react"

function ReportPopup(props) {
    const [response, setResponse] = useState("")

    function handleResponse(e) {
        setResponse(e.target.value)
    }

    function handleSubmit() {
        props.onSubmit(response)
    }

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Report this Quiz 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Thank you for helping keep our site clean!</h5>
          <br></br>
          <h6>Our moderation team will futher review this quiz to determine if it should belong on the Trivia Arabica platform.</h6>
          <br></br>
          <Form.Group >
              <Form.Label>Please add anything else you think we should know:</Form.Label>
              <Form.Control as="textarea" rows={5} onChange={(e) => handleResponse(e)} value={response} placeholder="Enter response here..."/>           
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" type="submit" onClick={handleSubmit}>Submit</Button>
          <Button variant="outline-danger" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

export default ReportPopup;