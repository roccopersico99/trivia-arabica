import '../App.css';
import React from 'react'
import { useHistory } from 'react-router';
import Background from './Background.js'
import { Container, Stack, Button, Image, ProgressBar, Spinner } from 'react-bootstrap'
import { Link } from "react-router-dom"

import { useAuthState } from '../Context/index'

function QuizPreview(props) {
    const userDetails = useAuthState();
    let history = useHistory();
    console.log(userDetails);

    const likes = 85;
    const dislikes = 15;

    function handleGoBack() {
        history.push("/profile");
    }

    if (userDetails.user === "") {
        return (
          <Background>
            <Spinner style={{marginTop:"100px"}} animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Background>
        )
    }
    return (
        <Background>
            <Container>
                <Stack direction="horizontal" gap={3}>
                    <Stack gap={3}>
                        <h3>Left Stack</h3>
                        <Button onClick={handleGoBack} variant="primary">Go back</Button>
                        <Stack gap={5} direction="horizontal" className="block-example border border-dark">
                            <Image
                                style={{
                                    width: "100px",
                                    height: "100px",
                                }}
                                src={userDetails.imageUrl}
                                alt="Profile Image"
                                className="block-example border border-dark">
                            </Image>
                            <h1>{userDetails.user}</h1>
                        </Stack>
                        <h2>Quiz Created: 10/29/2021</h2>
                        <h2>Community Rating:</h2>
                        <ProgressBar>
                            <ProgressBar variant="success" now={85} key={1} label={`${likes}%`} />
                            <ProgressBar variant="danger" now={15} key={2}  label={`${dislikes}%`}/>
                        </ProgressBar>
                        <Stack direction="horizontal" gap={3}>
                            <Link to='/play' className="btn btn-success w-50 p-3">Play!</Link>
                            <Button variant="danger" className="w-50 p-3">Report</Button>
                        </Stack>
                    </Stack>
                    <Stack gap={3}>
                        <h3>Right Stack</h3>
                        <Image
                            style={{
                                height: "350px",
                            }}
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            alt="Quiz Image"
                            className="block-example border border-dark w-100 p-3">
                        </Image>
                        <h1 className="block-example border border-dark">Quiz Title</h1>
                        <p className="block-example border border-dark">Quiz Description goes here</p>
                    </Stack>
                </Stack>
            </Container>
        </Background>
    );
}

export default QuizPreview;