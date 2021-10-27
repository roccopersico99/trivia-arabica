import '../App.css';
import Background from './Background.js'
import * as FirestoreBackend from '../services/firestore.js'


function Home() {
  return (
    <Background>
      <p>Home</p>
      <button onClick={()=>{
        const usr_query = FirestoreBackend.getUser('1');
        console.log(usr_query);
        usr_query.then((query_snapshot)=>{
          query_snapshot.forEach((user) => {
            console.log(user.data())
            console.log(user.data().display_name)
            console.log(user.data().user_bio)
          });
        });
        }}>Test get user where ID=1</button>
      <button onClick={()=>FirestoreBackend.createUser("gus", '2')}>
        Test add user gus ID:2</button>
    </Background>
  );
}

export default Home;