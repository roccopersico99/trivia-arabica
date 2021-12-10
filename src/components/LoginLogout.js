import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { refreshTokenSetup } from '../services/refreshToken';
import * as FirestoreBackend from '../services/Firestore.js'
import { useAuthState, useAuthDispatch } from '../Context/index'
import { useHistory } from 'react-router-dom'
import { getAuth, signInWithCredential, GoogleAuthProvider, signOut } from "firebase/auth";

const clientId = '232679417776-evek906rd0viu2j08vqsciphcrjhttir.apps.googleusercontent.com';

export default function LoginLogout() {

  const history = useHistory();

  const dispatch = useAuthDispatch()
  const userDetails = useAuthState()

  const onLoginSuccess = async (res) => {

    // Build Firebase credential with the Google ID token.
    const credential = GoogleAuthProvider.credential(res.tokenId);

    // Sign in with credential from the Google user.
    const auth = getAuth();
    await signInWithCredential(auth, credential);
    console.log(auth.currentUser);
    
    console.log("Logged in as: ", res.profileObj);
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.profileObj })

    refreshTokenSetup(res);

    const usr_query = FirestoreBackend.getUser('' + res.profileObj.googleId);
    usr_query.then((query_snapshot) => {
      if (!query_snapshot.exists) {
        //create account
        FirestoreBackend.createUser(res.profileObj.name, '' + res.profileObj.googleId, res.profileObj.imageUrl, auth.currentUser.uid)
      } else {
        //double check profile image is up to date'
        const userRef = query_snapshot.ref;
        const profileImg = query_snapshot.data().profile_image;
        if (profileImg !== res.profileObj.imageUrl) {
          console.log("updating profile image on our end!")
          const data = { profile_image: res.profileObj.imageUrl };
          FirestoreBackend.updateData(userRef, data);
        }
        //update existing accounts to have a uid field
        const uid = query_snapshot.data().uid;
        if (uid !== auth.currentUser.uid){
          const data = { uid: auth.currentUser.uid };
          FirestoreBackend.updateData(userRef, data);
        }
      }
    });
  };

  const onLoginFailure = (res) => {
    console.log("Failed login: ", res)
    dispatch({ type: 'LOGIN_ERROR', error: "error" })
  };

  const onLogoutSuccess = (res) => {
    const auth = getAuth();
    signOut(auth)
    console.log("Logged out of: ", res);
    dispatch({ type: 'LOGOUT' });

    history.push("/");
  };

  if (userDetails.user === "") {
    return (
      <div style={{margin:"auto", marginRight:"20px"}}>
          <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={onLoginSuccess}
            onFailure={onLoginFailure}
            cookiePolicy={"single_host_origin"}
            style={{ marginTop: '100px' }}
            isSignedIn={true}
          />
        </div>
    );
  } else {
    return (
      <div style={{margin:"auto", marginRight:"20px"}}>
        <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={onLogoutSuccess}
        />
      </div>
    );
  }
}