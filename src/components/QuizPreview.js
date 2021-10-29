import '../App.css';
import React from 'react'
import Background from './Background.js'

import { useAuthState } from '../Context/index'

function QuizPreview() {
    const userDetails = useAuthState();
    console.log(userDetails);

    return (
        <Background>
            <span>Welcome to {userDetails.user}'s Quiz!</span>
        </Background>
    );
}

export default QuizPreview;