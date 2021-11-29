import { Modal, Form, Button } from "react-bootstrap"
import { useState } from "react"

function SettingsPopup(props) {

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1>Settings and Preferences</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h5>Appearance</h5>
            <Form.Check type="radio" label="Light"></Form.Check>
            <Form.Check type="radio" label="Dark"></Form.Check>
            <br></br>
            <h5>Colorblind Filter</h5>
            <Form.Check type="radio" label="None"></Form.Check>
            <Form.Check type="radio" label="Protanopia"></Form.Check>
            <Form.Check type="radio" label="Deuteranopia"></Form.Check>
            <Form.Check type="radio" label="Tritanopia"></Form.Check>
            <br></br>
            <h5>Content Discovery</h5>
            <Form.Check type="radio" label="Under 18"></Form.Check>
            <Form.Check type="radio" label="18+"></Form.Check>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit" onClick={props.handleSaveSettings}>Save Settings</Button>
          <Button variant="danger" onClick={props.handleResetSettings}>Reset All Settings</Button>
          <Button variant="outline-danger" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

export default SettingsPopup;