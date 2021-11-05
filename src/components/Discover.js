import { Container, Row } from "react-bootstrap";
import QuizCard from "./profile-components/QuizCard";
import { useEffect } from 'react'
import Background from "./Background";

function Discover() {

//   useEffect(() => {
//     console.log(quizzes);
//   }, [quizzes])

//   return (
//     <Container>
//       {/*
//         get number of quizzes from this user
//         generate n rows for every i (3) quizzes
//         */}
//         Welcome to Quiz Discover!

//       <Row>
//         {quizzes.map((quiz, index) => {
//           return (  <QuizCard quiz={quiz} key={index}></QuizCard>)
//         })}
//       </Row>
//     </Container>
    
//   );
    return (
        <Background>
            <h1>Welcome to the Quiz Discover Page!</h1>
        </Background>
    );
}

export default Discover;