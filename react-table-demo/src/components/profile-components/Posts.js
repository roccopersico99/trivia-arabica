import { Container, ListGroup, Card, Button } from 'react-bootstrap';

function Posts(props) {

    return (
        <Container>
            <ListGroup>
                <Card>
                    <Card.Body>
                        <Card.Title>Post Title</Card.Title>
                        <Card.Text>
                            This is where the posts made by the user will be populated when this tab is selected.
                        </Card.Text>
                        <Button variant="primary">Like</Button>
                        <Button variant="secondar">Dislike</Button>
                    </Card.Body>
                </Card>

                <br></br>

                <Card>
                    <Card.Body>
                        <Card.Title>2nd Post</Card.Title>
                        <Card.Text>
                            This is where the posts made by the user will be populated when this tab is selected.
                        </Card.Text>
                        <Button variant="primary">Like</Button>
                        <Button variant="secondar">Dislike</Button>
                    </Card.Body>
                </Card>
            </ListGroup>
        </Container>
    );
}

export default Posts;